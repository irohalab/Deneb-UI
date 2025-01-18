import { Component, OnInit } from '@angular/core';
import { InfiniteService } from './infinite.service';
import { InfiniteDataBucketsStub } from '../../../../irohalab/deneb-ui/src';

// const MOCK_DATA = require('../../MOCK_DATA.json');

@Component({
    selector: 'infinite-list-demo',
    templateUrl: './infinite-list.html',
    styles: [`
        .demo-container {
            width: 100%;
            height: 100%;
            position: relative;
            background-color: #f0f0f0;
            display: flex;
            flex-direction: row;
        }
        infinite-list {
            width: 600px;
            height: 100%;
            display: block;
        }
    `],
    providers: [InfiniteService]
})
export class InfiniteListDemo implements OnInit {

    collection: {id: number, image: string, content: string}[];

    newPosition = 0;

    bucketsStub: InfiniteDataBucketsStub;
    scrollPosition: number = 0;

    bucketsStubIdx = 0;

    constructor(private infiniteService: InfiniteService) {
    }

    onScrollPositionChange(p: number) {
        this.scrollPosition = p;
    }

    ngOnInit(): void {
        this.bucketsStub = new InfiniteDataBucketsStub(this.infiniteService.buckets, this, this.onLoadBucket);
        this.collection = [];
    }

    onLoadBucket(bucketIndex: number): Promise<Iterable<any>> {
        return this.infiniteService.getBucketData(bucketIndex);
    }

    onLoadBucket2(bucketIndex: number): Promise<Iterable<any>> {
        return this.infiniteService.getBucket2Data(bucketIndex);
    }

    switchBucket() {
        if (this.bucketsStubIdx === 0) {
            this.bucketsStubIdx = 1;
            this.bucketsStub = new InfiniteDataBucketsStub(this.infiniteService.buckets2, this, this.onLoadBucket2);
        } else {
            this.bucketsStubIdx = 0;
            this.bucketsStub = new InfiniteDataBucketsStub(this.infiniteService.buckets, this, this.onLoadBucket);
        }
        this.collection = [];
    }
}
