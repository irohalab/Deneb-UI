
import {filter} from 'rxjs/operators';
import {
    Directive,
    DoCheck,
    EmbeddedViewRef,
    Input,
    isDevMode,
    IterableChangeRecord,
    IterableChanges,
    IterableDiffer,
    IterableDiffers,
    NgIterable,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    TrackByFunction,
    ViewContainerRef,
    ViewRef
} from '@angular/core';
import {InfiniteList} from './infinite-list';
import {Subscription} from 'rxjs';
import { InfiniteDataBucket, InfiniteDataBucketsStub } from './infinite-data-collection';

export class Recycler {
    private limit: number = 0;
    private scrapViews: Map<number, ViewRef> = new Map();

    getView(position: number): ViewRef | null {
        let view = this.scrapViews.get(position);
        if (!view && this.scrapViews.size > 0) {
            position = this.scrapViews.keys().next().value;
            view = this.scrapViews.get(position);
        }
        if (view) {
            this.scrapViews.delete(position);
        }
        return view || null;
    }

    recycleView(position: number, view: ViewRef) {
        view.detach();
        this.scrapViews.set(position, view);
    }

    /**
     * scrap view count should not exceed the number of current attached views.
     */
    pruneScrapViews() {
        if (this.limit <= 1) {
            return;
        }
        let keyIterator = this.scrapViews.keys();
        let key: number;
        while (this.scrapViews.size > this.limit) {
            key = keyIterator.next().value;
            this.scrapViews.get(key).destroy();
            this.scrapViews.delete(key);
        }
    }

    setScrapViewsLimit(limit: number) {
        this.limit = limit;
        this.pruneScrapViews();
    }

    clean() {
        this.scrapViews.forEach((view: ViewRef) => {
            view.destroy();
        });
        this.scrapViews.clear();
    }
}

export class InfiniteRow {
    constructor(public $implicit: any, public index: number, public count: number, public isInitialized: boolean) {
    }

    get first(): boolean {
        return this.index === 0;
    }

    get last(): boolean {
        return this.index === this.count - 1;
    }

    get even(): boolean {
        return this.index % 2 === 0;
    }

    get odd(): boolean {
        return !this.even;
    }
}

@Directive({
    selector: '[infiniteFor][infiniteForOf]'
})
export class InfiniteForOf<T> implements OnChanges, DoCheck, OnInit, OnDestroy {

    private _differ: IterableDiffer<T>;
    private _trackByFn: TrackByFunction<T>;
    private _subscription: Subscription = new Subscription();
    /**
     * scroll offset of y-axis in pixel
     */
    private _scrollY: number = 0;
    /**
     * first visible item index in collection
     */
    private _firstItemPosition: number;
    /**
     * last visible item index in collection
     */
    private _lastItemPosition: number;

    private _containerWidth: number;
    private _containerHeight: number;

    /**
     * when this value is true, a full clean layout is required, every element must be reposition
     * @type {boolean}
     * @private
     */
    private _invalidate: boolean = true;
    /**
     * when this value is true, a layout is in process
     * @type {boolean}
     * @private
     */
    private _isInLayout: boolean = false;

    private _isInMeasure: boolean = false;

    private _pendingMeasurement: number;

    private _collection: any[] = [];

    private _recycler: Recycler = new Recycler();

    private _bucketsStub: InfiniteDataBucketsStub;

    @Input() infiniteForOf: NgIterable<T>;

    @Input()
    set infiniteForTrackBy(fn: TrackByFunction<T>) {
        if (isDevMode() && fn != null && typeof fn !== 'function') {
            if (<any>console && <any>console.warn) {
                console.warn(
                    `trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
                    `See https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html#!#change-propagation for more information.`);
            }
        }
        this._trackByFn = fn;
    }

    get infiniteForTrackBy(): TrackByFunction<T> {
        return this._trackByFn;
    }

    @Input()
    set infiniteForWithBucket(stub: InfiniteDataBucketsStub) {
        if (!stub) {
            this._bucketsStub = new InfiniteDataBucketsStub([], null, null);
        }
        this._bucketsStub = stub;
    }

    get infiniteForWithBucket(): InfiniteDataBucketsStub {
        return this._bucketsStub;
    }

    @Input()
    set infiniteForTemplate(value: TemplateRef<InfiniteRow>) {
        if (value) {
            this._template = value;
        }
    }

    get buckets(): InfiniteDataBucket[] {
        return this._bucketsStub ? this._bucketsStub.buckets : [];
    }

    get length() {
        if (this.buckets.length === 0) {
            return this._collection ? this._collection.length : 0;
        } else {
            return this.buckets[this.buckets.length - 1].end + 1 - this.buckets[0].start;
        }
    }

    constructor(private _infiniteList: InfiniteList,
                private _differs: IterableDiffers,
                private _template: TemplateRef<InfiniteRow>,
                private _viewContainerRef: ViewContainerRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('infiniteForWithBucket' in changes && this._differ) {
            const currentValue = changes['infiniteForWithBucket'].currentValue;
            const previousValue = changes['infiniteForWithBucket'].previousValue;
            if (currentValue !== previousValue && previousValue && !this._differ.diff(this.infiniteForOf)) {
                // clean state of buckets
                this.buckets.forEach((bucket: InfiniteDataBucket) => {
                    bucket.fetching = false;
                    bucket.filled = false;
                });
                this._collection = [];
                this.requestMeasure();
            }
        }
        if ('infiniteForOf' in changes) {
            // React on infiniteForOf only once all inputs have been initialized
            const value = changes['infiniteForOf'].currentValue;
            if (!this._differ && value) {
                try {
                    this._differ = this._differs.find(value).create(this._trackByFn);
                } catch (e) {
                    throw new Error(`Cannot find a differ supporting object '${value}' of type '${getTypeNameForDebugging(value)}'. NgFor only supports binding to Iterables such as Arrays.`);
                }
            }
        }
    }

    ngDoCheck(): void {
        if (this._differ) {
            const changes = this._differ.diff(this.infiniteForOf);
            if (changes) {
                this.applyChanges(changes);
            }
        }
    }

    private applyChanges(changes: IterableChanges<T>) {
        let isMeasurementRequired = false;
        changes.forEachOperation((item: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {
            if (item.previousIndex == null) {
                // new item
                isMeasurementRequired = true;
                this._collection.splice(currentIndex, 0, item.item);
            } else if (currentIndex == null) {
                // remove item
                isMeasurementRequired = true;
                this._collection.splice(adjustedPreviousIndex, 1);
            } else {
                // move item
                this._collection.splice(currentIndex, 0, this._collection.splice(adjustedPreviousIndex, 1)[0]);
            }
        });
        changes.forEachIdentityChange((record: any) => {
            this._collection[record.currentIndex] = record.item;
        });

        if (isMeasurementRequired) {
            this.requestMeasure();
            return;
        }

        this.requestLayout();
    }

    ngOnInit(): void {
        this._subscription.add(this._infiniteList.scrollPosition.pipe(
            filter((scrollY) => {
                return Math.abs(scrollY - this._scrollY) >= this._infiniteList.rowHeight;
            }))
            .subscribe(
                (scrollY) => {
                    this._scrollY = scrollY;
                    this.requestLayout();
                }
            ));
        this._subscription.add(this._infiniteList.sizeChange
            .pipe(filter(([width, height]) => {
                return width !== 0 && height !== 0;
            })).subscribe(
            ([width, height]) => {
                this._containerWidth = width;
                this._containerHeight = height;
                this.requestMeasure();
            }
        ));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
        this._recycler.clean();
    }

    private requestMeasure() {
        if (this._isInMeasure || this._isInLayout) {
            clearTimeout(this._pendingMeasurement);
            this._pendingMeasurement = window.setTimeout(() => {
                this.requestMeasure();
            }, 60);
            return;
        }
        this.measure();
    }

    private requestLayout() {
        if (!this._isInMeasure && this._infiniteList.rowHeight) {
            this.layout();
        }
    }

    private measure() {
        this._isInMeasure = true;
        this._infiniteList.holderHeight = this._infiniteList.rowHeight * this.length;
        // calculate a approximate number of which a view can contain
        this.calculateScrapViewsLimit();
        this._isInMeasure = false;
        this._invalidate = true;
        this.requestLayout();
    }

    private layout() {
        if (this._isInLayout) {
            return;
        }
        this._isInLayout = true;
        let {width, height} = this._infiniteList.measure();
        this._containerWidth = width;
        this._containerHeight = height;
        if (this.length === 0) {
            // detach all views without recycle them.
            for (let i = 0; i < this._viewContainerRef.length; i++) {
                let child = <EmbeddedViewRef<InfiniteRow>> this._viewContainerRef.get(i);
                // if (child.context.index < this._firstItemPosition || child.context.index > this._lastItemPosition || this._invalidate) {
                this._viewContainerRef.detach(i);
                // this._recycler.recycleView(child.context.index, child);
                i--;
                // }
            }
            this._isInLayout = false;
            this._invalidate = false;
            return;
        }
        this.findPositionInRange();
        for (let i = 0; i < this._viewContainerRef.length; i++) {
            let child = <EmbeddedViewRef<InfiniteRow>> this._viewContainerRef.get(i);
            // if (child.context.index < this._firstItemPosition || child.context.index > this._lastItemPosition || this._invalidate) {
            this._viewContainerRef.detach(i);
            this._recycler.recycleView(child.context.index, child);
            i--;
            // }
        }
        this.insertViews();
        this._recycler.pruneScrapViews();
        this._isInLayout = false;
        this._invalidate = false;
    }

    private calculateScrapViewsLimit() {
        let limit = this._containerHeight / this._infiniteList.rowHeight + 2;
        this._recycler.setScrapViewsLimit(limit);
    }

    private insertViews() {
        if (this._viewContainerRef.length > 0) {
            let firstChild = <EmbeddedViewRef<InfiniteRow>> this._viewContainerRef.get(0);
            let lastChild = <EmbeddedViewRef<InfiniteRow>> this._viewContainerRef.get(this._viewContainerRef.length - 1);
            for (let i = firstChild.context.index - 1; i >= this._firstItemPosition; i--) {
                let view = this.getView(i);
                this.dispatchLayout(i, view, true);
            }
            for (let i = lastChild.context.index + 1; i <= this._lastItemPosition; i++) {
                let view = this.getView(i);
                this.dispatchLayout(i, view, false);
            }
        } else {
            for (let i = this._firstItemPosition; i <= this._lastItemPosition; i++) {
                let view = this.getView(i);
                this.dispatchLayout(i, view, false);
            }
        }
    }

    //noinspection JSMethodCanBeStatic
    private applyStyles(viewElement: HTMLElement, y: number) {
        viewElement.style.transform = `translate3d(0, ${y}px, 0)`;
        viewElement.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
        viewElement.style.width = `${this._containerWidth}px`;
        viewElement.style.height = `${this._infiniteList.rowHeight}px`;
        viewElement.style.position = 'absolute';
    }

    private dispatchLayout(position: number, view: ViewRef, addBefore: boolean) {
        let startPosY = position * this._infiniteList.rowHeight;
        this.applyStyles((view as EmbeddedViewRef<InfiniteRow>).rootNodes[0], startPosY);
        if (addBefore) {
            this._viewContainerRef.insert(view, 0);
        } else {
            this._viewContainerRef.insert(view);
        }
        view.reattach();
    }

    private findPositionInRange() {
        let scrollY = this._scrollY;
        let firstPosition = Math.floor(scrollY / this._infiniteList.rowHeight);
        let firstPositionOffset = scrollY - firstPosition * this._infiniteList.rowHeight;
        let lastPosition = Math.ceil((this._containerHeight + firstPositionOffset) / this._infiniteList.rowHeight) + firstPosition;
        this._firstItemPosition = Math.max(firstPosition - 1, 0);
        this._lastItemPosition = Math.min(lastPosition + 1, this.length - 1);
    }

    private getView(position: number): ViewRef {
        let bucketIndex = -1;
        if (this.buckets.length > 0) {
            bucketIndex = this.findBucketIndexByPosition(position);
        }
        if (bucketIndex > -1) {
            const bucket = this.buckets[bucketIndex];
            if (!bucket.filled) {
                this.loadBucket(bucketIndex);
            }
        }
        let item = this._collection[position];
        const isInitialized = !!item;
        let count = this.length;
        let view = this._recycler.getView(position);
        if (!view) {
            view = this._template.createEmbeddedView(new InfiniteRow(item || {}, position, count, isInitialized));
        } else {
            (view as EmbeddedViewRef<InfiniteRow>).context.$implicit = item || {};
            (view as EmbeddedViewRef<InfiniteRow>).context.index = position;
            (view as EmbeddedViewRef<InfiniteRow>).context.count = count;
            (view as EmbeddedViewRef<InfiniteRow>).context.isInitialized = isInitialized;
        }
        return view;
    }

    private findBucketIndexByPosition(position: number): number {
        const offset = position + this.buckets[0].start;
        for (let i = 0; i < this.buckets.length; i++) {
            let bucket = this.buckets[i];
            if (bucket.start <= offset && offset <= bucket.end) {
                return i;
            }
        }
        return -1;
    }

    private loadBucket(bucketIndex: number): void {
        if (this.buckets.length === 0) {
            return;
        }
        const bucket = this.buckets[bucketIndex];
        if (!bucket || bucket.fetching) {
            return;
        }
        bucket.fetching = true;
        this._bucketsStub.loadBucket(bucketIndex)
            .then((bucketData: Iterable<any>) => {
                bucket.fetching = false;
                let i = 0;
                let firstStart = this.buckets[0].start;
                for (let item of bucketData) {
                    let offset = bucket.start - firstStart + i
                    this._collection[offset] = item;
                    i++;
                }
                bucket.filled = true;
                this.requestLayout();
            });
    }
}


export function getTypeNameForDebugging(type: any): string {
    return type['name'] || typeof type;
}
