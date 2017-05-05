declare var app: {
  environment: string;
};

//jasmine subset

//declare var require: any;
declare function describe(description: string, specDefinitions: () => void): void;
declare function fdescribe(description: string, specDefinitions: () => void): void;
declare function xdescribe(description: string, specDefinitions: () => void): void;

declare function it(expectation: string, assertion?: (done: DoneFn) => void, timeout?: number): void;
declare function fit(expectation: string, assertion?: (done: DoneFn) => void, timeout?: number): void;
declare function xit(expectation: string, assertion?: (done: DoneFn) => void, timeout?: number): void;

/** If you call the function pending anywhere in the spec body, no matter the expectations, the spec will be marked pending. */
declare function pending(reason?: string): void;

declare function beforeEach(action: (done: DoneFn) => void, timeout?: number): void;
declare function afterEach(action: (done: DoneFn) => void, timeout?: number): void;

declare function beforeAll(action: (done: DoneFn) => void, timeout?: number): void;
declare function afterAll(action: (done: DoneFn) => void, timeout?: number): void;

declare function expect(spy: Function): Matchers<any>;
declare function expect<T>(actual: T): Matchers<T>;

declare function fail(e?: any): void;
/** Action method that should be called when the async work is complete */
interface DoneFn extends Function {
    (): void;

    /** fails the spec and indicates that it has completed. If the message is an Error, Error.message is used */
    fail: (message?: Error|string) => void;
}

interface Matchers<T> {

    new (env: any, actual: T, spec: any, isNot?: boolean): any;

    env: any;
    actual: T;
    spec: any;
    isNot?: boolean;
    message(): any;

    toBe(expected: any, expectationFailOutput?: any): boolean;
    toEqual(expected: any, expectationFailOutput?: any): boolean;
    toMatch(expected: string | RegExp, expectationFailOutput?: any): boolean;
    toBeDefined(expectationFailOutput?: any): boolean;
    toBeUndefined(expectationFailOutput?: any): boolean;
    toBeNull(expectationFailOutput?: any): boolean;
    toBeNaN(): boolean;
    toBeTruthy(expectationFailOutput?: any): boolean;
    toBeFalsy(expectationFailOutput?: any): boolean;
    toHaveBeenCalled(): boolean;
    toHaveBeenCalledWith(...params: any[]): boolean;
    toHaveBeenCalledTimes(expected: number): boolean;
    toContain(expected: any, expectationFailOutput?: any): boolean;
    toBeLessThan(expected: number, expectationFailOutput?: any): boolean;
    toBeLessThanOrEqual(expected: number, expectationFailOutput?: any): boolean;
    toBeGreaterThan(expected: number, expectationFailOutput?: any): boolean;
    toBeGreaterThanOrEqual(expected: number, expectationFailOutput?: any): boolean;
    toBeCloseTo(expected: number, precision?: any, expectationFailOutput?: any): boolean;
    toThrow(expected?: any): boolean;
    toThrowError(message?: string | RegExp): boolean;
    toThrowError(expected?: new (...args: any[]) => Error, message?: string | RegExp): boolean;
    not: Matchers<T>;

    Any: any;
}