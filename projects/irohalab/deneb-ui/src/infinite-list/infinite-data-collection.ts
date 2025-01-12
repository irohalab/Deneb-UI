export type InfiniteDataBucket = {
    start: number;
    end: number;
    filled?: boolean;
    fetching?: boolean;
}

export class InfiniteDataBucketsStub {
    constructor(public buckets: InfiniteDataBucket[],
                public context: any,
                public onLoadBucket: (bucketIndex: number) => Promise<Iterable<any>>) {
    }

    loadBucket(bucketIndex: number): Promise<Iterable<any>> {
        return this.onLoadBucket.call(this.context, bucketIndex);
    }
}
