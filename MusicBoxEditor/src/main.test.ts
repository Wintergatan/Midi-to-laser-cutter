/*when hosting .html*/
/*
import 'jasmine-core/lib/jasmine-core/jasmine.css';
import 'jasmine-core/lib/jasmine-core/jasmine.js';
import 'jasmine-core/lib/jasmine-core/jasmine-html.js';
import 'jasmine-core/lib/jasmine-core/boot.js';
*/

import 'reflect-metadata';
import 'core-js/es6';
import 'core-js/es7/reflect';

import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import "zone.js/dist/sync-test";
import "zone.js/dist/proxy";
import "zone.js/dist/jasmine-patch";

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { TestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";

TestBed.initTestEnvironment(
     BrowserDynamicTestingModule,
     platformBrowserDynamicTesting());

let testContext = require.context('./app', true, /\.spec/);
testContext.keys().forEach(testContext);