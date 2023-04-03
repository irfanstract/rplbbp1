









/* module uses `export = ...` ; can't simply use `export * from it` */
export {
  AssertPredicate ,
  AssertionError ,
  CallTracker ,
  CallTrackerReportInformation ,
  deepStrictEqual ,
  doesNotReject ,
  doesNotThrow ,
  fail as fail ,
  fail as failTodo ,
  ifError ,
  notDeepStrictEqual ,
  notStrictEqual ,
  ok ,
  rejects ,
  strict, 
  strictEqual ,
  throws ,
} from "assert" ;

import { 
  inspect ,
  InspectOptions ,
} from "util" ; 
export { inspect, } ;
export { InspectOptions, } ;

export const formatErrorMesssageWithInspect: {
  <M extends string, C extends object>(...args: [
    message: M, 
    ctxVars: C,
    ...etc: C extends Function ? [never] : [],
  ] ): string ;
} = (
  (message, vars, ..._1) => (
    "" + message + "\n=====\n" + inspect(vars)
  )
) ;

/** 
 * dispatch the given callback async-ly.
 * a work-around to cyclic dependency .
 */
export function dispatchAsyncUnitTestCallback(...args: [
  main: { (): void ; } ,
]): void ;
export function dispatchAsyncUnitTestCallback(...[doExpectedThing]: [() => void]) {
  process.nextTick(() => (
    doExpectedThing()
  ))
}













