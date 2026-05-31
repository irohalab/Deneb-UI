// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting
} from '@angular/platform-browser/testing';

// The application bootstraps with `provideZoneChangeDetection()` (see the demo's main.ts).
// Mirror that here so tests use the same Zone-based change detection instead of the stricter
// default scheduler, which otherwise reports ExpressionChangedAfterItHasBeenCheckedError.
@NgModule({
  providers: [provideZoneChangeDetection()]
})
class ZoneChangeDetectionTestModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  [BrowserTestingModule, ZoneChangeDetectionTestModule],
  platformBrowserTesting(),
);
