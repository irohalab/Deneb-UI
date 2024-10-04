import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export interface ObservableStub {
    target: Element;
    callback(rect: ClientRect): void;
    unobserveOnVisible: boolean;
}

@Injectable()
export class UIResponsiveService {
    private _observer: IntersectionObserver | ServerIntersectionObserverFallback;

    private _observableStubList: ObservableStub[] = [];

    constructor(@Inject(PLATFORM_ID) platformId: object) {
        if (isPlatformServer(platformId)) {
            this._observer = new ServerIntersectionObserverFallback(this.intersectionCallback.bind(this));
        } else {
            this._observer = new IntersectionObserver(this.intersectionCallback.bind(this));
        }
    }

    intersectionCallback(entries: IntersectionObserverEntry[]) {
        entries.filter(entry => {
            return entry['isIntersecting']; // current lib.es6.d.ts not updated.
        }).forEach((entry: IntersectionObserverEntry) => {
            let stub = this.getStub(entry.target);
            if (stub) {
                stub.callback(entry.boundingClientRect);
                if (stub.unobserveOnVisible) {
                    this.unobserve(stub);
                }
            }
        });
    }

    observe(stub: ObservableStub) {
        if (this.getStub(stub.target)) {
            throw new Error('Duplicate ObservableStub on target');
        }
        this._observableStubList.push(stub);
        this._observer.observe(stub.target);
    }

    unobserve(stub: ObservableStub) {
        let index = this._observableStubList.findIndex(obStub => obStub == stub);
        if (index !== -1) {
            this._observableStubList.splice(index, 1);
            this._observer.unobserve(stub.target);
        }
    }

    private getStub(target: Element) {
        if (!this._observableStubList) {
            return null;
        }
        return this._observableStubList.find(stub => stub.target === target);
    }
}

class ServerIntersectionObserverFallback  {
    constructor(private callback: IntersectionObserverCallback) {}
    observe(target: Element) {
    }
    unobserve(target: Element) {}
}
