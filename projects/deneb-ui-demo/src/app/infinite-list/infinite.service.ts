import { Injectable } from '@angular/core';
import { InfiniteDataBucket } from '../../../../irohalab/deneb-ui/src/infinite-list/infinite-data-collection';
import { Observable, of } from 'rxjs';
const MOCK_DATA = require('../../MOCK_DATA.json');
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Injectable()
export class InfiniteService {
    public buckets!: InfiniteDataBucket[];
    constructor() {
        const length = MOCK_DATA.length;
        const bucketCount = Math.ceil(length / 20);
        this.buckets = [];
        for (let i = 0; i < bucketCount; i++) {
            const start = i * 20;
            let end = start + 20;
            if (end >= length) {
                end = length - 1;
            }
            this.buckets.push({
                start,
                end,
                filled: false
            });
        }
    }

    async getBucketData(bucketIndex: number): Promise<any[]> {
        await sleep(3000);
        console.log('bucket data filled');
        const bucket = this.buckets[bucketIndex];
        if (bucket) {
            return await Promise.resolve(MOCK_DATA.slice(bucket.start, bucket.end + 1));
        }
        return Promise.reject(new Error('bucket index out of range'));
    }
}
