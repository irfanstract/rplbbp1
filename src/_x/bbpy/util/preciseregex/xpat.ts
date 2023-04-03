





import * as BBP from "_x/bbpy/all" ;













export namespace XPat {

  export const NULL: null | false = null ;
  
  export type PS<R extends (
    | true 
    | ((number | string) | object)
  )> = {

    /** 
     * parse the start of the given string
     */
    parseLead(...args: [string, {}? ]): (
      | (typeof NULL) 
      | { fullMatchStr: string ; matchedValue: R ; }
    ) ;

    stringify(options: {
      /** 
       * supposedly the value returned by the prior call to {@link}
       */
      value: R ;
      type ?: undefined ;
    }): string ;

  } ;
  // type L = PS ;
  ;

  export function Never(): PS<never> ;
  export function Never() {
    return {
      s: "never" ,
      parseLead: () => false ,
      stringify: () => BBP.Debug.fail() ,
    } satisfies (
      PS<never> & { s: "never" , }
    ) ;
  }
  
  export function forRegExp(pattern: RegExp): PS<RegExpMatchArray> ;
  export function forRegExp(...[p] : [pattern: RegExp])  {
    return {
      parseLead: (sample) => {
        const m = sample.match(p) ;
        if (m) {
          const fullMatchStr = m[0] ;
          if (fullMatchStr === sample.slice(0, fullMatchStr.length) ) {
            return { fullMatchStr, matchedValue: m , } ;
          }
        } 
        return false ;
      } ,
      stringify({ value, }) {
        return value[0] ;
      } ,
      toString() {
        return `forRegExp(${p })` ;
      } ,
      s: p ,
    } satisfies ( 
      & PS<RegExpMatchArray>
      & { toString(): string ; }
      & { s: {} ; }
    ) ;
  }

}















/** 
 * `An import declaration can only be used at the top level of a namespace or module.ts(1232)`
 */
namespace _test1 {
  ;
  import PS = XPat.PS ;
  BBP.impl.Debug.dispatchAsyncUnitTestCallback(() => {
    type PType<E extends XPat.PS<any>> = (
      E extends XPat.PS<infer R> ? 
      R : never
    ) ;
    type PAgain<E extends XPat.PS<any>> = (
      E extends XPat.PS<infer R> ? 
      PS<R> : never
    ) ;
    (
      ([
        [XPat.Never() as XPat.PS<string>, { sample: "wordie ", expectedToMatchLead: false, }] ,
        [XPat.forRegExp(/\w+/), { sample: "wordie", expectedToMatchLead: true, }] ,
        [XPat.forRegExp(/\w+/), { sample: "wordie ", expectedToMatchLead: true, }] ,
        [XPat.forRegExp(/\w+/), { sample: " wordie ", expectedToMatchLead: false, }] ,
      ] satisfies [XPat.PS<any>, { sample: string ; expectedToMatchLead: boolean ; } ][])
      .forEach(([pattern0, { sample, expectedToMatchLead, } ]) => {
        const pattern = (
          pattern0 satisfies PAgain<typeof pattern0>
        ) ;
        const m = pattern.parseLead(sample) ;
        BBP.Debug.ok(!!m === (expectedToMatchLead satisfies boolean) , (
          BBP.Debug.inspect({
            pattern , 
            sample ,
            expectedToMatchLead ,
            m ,
          })
        ) ) ;
        console["log"](`entry test successful`, {
          pattern , 
          sample ,
          expectedToMatchLead ,
          m ,
        }) ;
      } )
    ) ;
  }) ;
}
String(_test1);






