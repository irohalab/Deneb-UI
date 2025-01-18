import { Injectable } from '@angular/core';
import { InfiniteDataBucket } from '../../../../irohalab/deneb-ui/src';
const MOCK_DATA = require('../../MOCK_DATA.json');
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Injectable()
export class InfiniteService {
    public buckets!: InfiniteDataBucket[];
    public buckets2!: InfiniteDataBucket[];
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

        this.buckets2 = [];
        const length2 = 2;
        const bucketCount2 = Math.ceil( length2 / 20);
        let start = length2;
        for (let i = 0; i < bucketCount2; i++) {
            start = i * 20;
            let end = start + 20;
            if (end >= length2) {
                end = length2 - 1;
            }
            this.buckets2.push({
                start: length2 + start,
                end: length2 + end,
                filled: false
            });
        }
    }

    async getBucketData(bucketIndex: number): Promise<any[]> {
        await sleep(1500);
        console.log('bucket data filled');
        const bucket = this.buckets[bucketIndex];
        if (bucket) {
            return await Promise.resolve(MOCK_DATA.slice(bucket.start, bucket.end + 1));
        }
        return Promise.reject(new Error('bucket index out of range'));
    }

    async getBucket2Data(bucketIndex: number): Promise<any[]> {
        await sleep(1500);
        console.log('bucket data filled');
        const bucket = this.buckets2[bucketIndex];
        if (bucket) {
            return await Promise.resolve(MOCK_DATA.slice(bucket.start, bucket.end + 1));
        }
        return Promise.reject(new Error('bucket index out of range'));
    }
}
