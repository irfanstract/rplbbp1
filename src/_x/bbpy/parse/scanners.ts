

import * as BBP from "_x/bbpy/all" ;








;

import { analyseLineBreaks, } from "./lineBreaks";

import { SourceFileInfoHost, } from "./sourceFiles";

// 7 ;
;

/** 
 * declares exactly these three properties :
 * - {@link presentlyPosC }
 * - {@link presentlyLineNumber}
 * - {@link presentlyColNumber }
 */
export interface ScannerPosInfo {
  /** 
   * starts from `0` . 
   */
  presentlyPosC: number ;
  /** 
   * starts from `1` . 
   */
  presentlyLineNumber: number ;
  /** 
   * starts from `0` . 
   */
  presentlyColNumber: number ;
}

import { getKeywordAndIdentMatchSupport, } from "./grammar/keywordAndIdentifier";

/** 
 * every {@link Scanner} 
 * is to *divide* a full-file code-string into *tokens* for further processing by grammar-checker(s).
 * 
 * the `type` {@link Scanner} doesn't itself provide methods to advance its state; instead, 
 * it exposes `this.state` typed as {@link Scanner.State} and 
 * the relevant methods take place there .
 * 
 */
export class Scanner {
  state: Scanner.State ;
  
  protected constructor(properties: Scanner) ;
  protected constructor(properties: Scanner) {
    this.state = properties.state ;
  }

  toString() {
    return `[object Scanner ; state: ${String(this.state) } ; ]` ;
  }
  
}
type M = ReturnType<typeof Array.prototype.reduce<string> >;
export namespace Scanner {
  /** 
   * without this semicolon, 
   * - `tsc` would complain `must use export type`
   * - *occurences* would not properly detect coalescence `class` and `namespace`
   */
  ; 

  /** 
   * every {@link Scanner} maintains *its state* which shall be instance of this `type` (*immutable*).
   * 
   * instances of this `type` shall be immutable and value-based.
   * it shall provide {@link afterNextKeyWord `afterNextYyyMethods`}, and 
   * they each 
   * shall return either (on negative) `false` or 
   * (on positive) `[matchedToken, nextState]` (with `nextState` being {@link DerivedOfState the derived State}) .
   * 
   * @see {@link State}
   */
  /* the `@link` tag be necessary to enable easy, non-breaking rename */
  export interface State extends StateI {}
  interface StateI extends SourceFileInfoHost {}
  interface StateI extends ScannerPosInfo {}
  interface StateI {
    DerivedState : (options: never) => State ;

    FalseOrDidMatch: <Value>(options: never) => (false | MatchedValueAndAfterhandScannerState<Value, DerivedOfState<this>>) ;

    afterNextToken(): (
      | false 
      | MatchedValueAndAfterhandScannerState<(
        | {
          type: (
            | "linebreak"
            | "spacelike"
          ) ; 
          value: string ; 
          startPos: number ;
        }
        | {
          type: ( 
            | "keyword"
          ) ; 
          value: string ; 
          startPos: number ;
        }
        | (
          & ReturnType<KeywIdentParseSupport["nameFromVarOrVerbIdentMatch"]>
          & { startPos: number ; }
        )
      ), DerivedOfState<this>>
    ) ;

    afterNextLinebreak(): false | MatchedValueAndAfterhandScannerState<string, DerivedOfState<this>> ;

    afterNextSingleLineWhitespace(): false | MatchedValueAndAfterhandScannerState<string, DerivedOfState<this>> ;
    afterNextKeyWord()             : false | MatchedValueAndAfterhandScannerState<string, DerivedOfState<this>> ;
    afterNextIdentifier()          : false | MatchedValueAndAfterhandScannerState<ReturnType<KeywIdentParseSupport["nameFromVarOrVerbIdentMatch"]>, DerivedOfState<this>> ;
    /** 
     * after parsing a lex unit which span for (possibly) not more than one line(s).
     * 
     * RegExp `p` shall not contain metachar `^`, metachar `$`, flag `g`,
     * 
     */
    afterNextLexUnitWithPattern?(...args: [
      RegExp ,
      { 
        /** 
         * to avoid the expense/overhead of `String.instance.slice`,
         * it might be important to limit the search to a sample single-line; however,
         * that's not always appropriate, eg 
         * that'd effectively prevent parsing multi-line constructs like multi-line comments.
         */
        singleLineOnly: boolean ; 
        /** 
         * unused. please do not pass this.
         */
        fubar ?: true ;
      } ,
    ]): false | MatchedValueAndAfterhandScannerState<string, DerivedOfState<this>> ;

    /** 
     * advanced by `n` code-points disregarding the presently pointed-to token kind.
     * @deprecated
     */
    asAdvancedByNChars(n: number): DerivedOfState<this> ;

  }
  export type DerivedOfState<S extends State> = (
    ReturnType<S["DerivedState"]>
  ) ;
  type KeywIdentParseSupport = (
    ReturnType<typeof getKeywordAndIdentMatchSupport>
  ) ;
  export type InitialStates = {

    /**
     * for an unnamed (frozen) script file with given full-text
     * (typical of REPL, `eval`, etc), 
     * initially. 
     */
    initiallyForInlineScript(options: (
      & {
        sourceCode: string ;
        fileNameExt: BBP.AcceptedFileNameExt ;
      }
    ) ): State ;

  } ;

}

export type MatchedValueAndAfterhandScannerState<V, S> = [
  matchedVal: V, 
  afterhandScannerState: S ,
] ;

const scannerStateImpl = (() => {
  const FOR_TRUTHY: {

    /** 
     * if truthy then return `[v]`, otherwise return `[]`.
     * ```
     * for (const matched of FOR_TRUTHY(tryMatchYyy(...) ) ) {
     *   if (isAppropriate(matched) ) {
     *     return matched.determinant ;
     *   }
     * }
     * ```
     */
    <A extends unknown>(v: A): (
      | [] 
      | [(
        // A extends (undefined | null) ? never :
        // A extends (false | 0 | "") ? never :
        A & (true | number | symbol | string | object)
      )]
    ) ;

  } = (v) => (v ? [v] : []) ;
  for (const v of FOR_TRUTHY(false as const)) {
    ;
  };
  for (const v of FOR_TRUTHY(0)) {
    ;
  };
  const getFactory = ({
    xFail ,
  } : {
    xFail: {
      <R>(...args: Parameters<typeof BBP.impl.Debug.formatErrorMesssageWithInspect>): R ;
    } ;
  }) => {
    type SSFI = Scanner.State["sourceFileInfo"] ;
    interface XSourceFileInfo extends SSFI {
      fullFileContents: string ;
    }
    const {
      keywordPattern ,
      varIdentPattern ,
      verbIdentPattern ,
      classIdentPattern ,
      nameFromVarOrVerbIdentMatch ,
    } = (
      getKeywordAndIdentMatchSupport()
    ) ;
    const getUnnamedSourceFileInfo = (
      ({
        sourceCode ,
        fileNameExt ,
      } : {
        sourceCode: string ;
        fileNameExt: (Required<Parameters<typeof BBP.getExpectedMimeType>>[0] & {} )["ext"] ;
      }) => {
        ;
        const mimeType = (
          BBP.getExpectedMimeType({
            ext: fileNameExt, 
          })
        ) ;
        const sourceFileInfDict = {
          fullFileContents: sourceCode ,
          mimeType: mimeType ,
          href: "data:" + mimeType + "," + sourceCode ,
        } satisfies XSourceFileInfo ;
        ;
        return (
          sourceFileInfDict
        ) ;
      }
    ) ;
    // Always use arrow functions !!!
    const globalInitialStates = {

      initiallyForInlineScript: (
        ({
          sourceCode ,
          fileNameExt ,
        }): Scanner.State => {
          const sourceFileInfDict = (
            getUnnamedSourceFileInfo({
              sourceCode ,
              fileNameExt ,
            })
          ) ;
          return (
            globalInitialStates.initiallyForSourceFileByInfo(sourceFileInfDict)
          ) ;
        }
      ) ,
      
      initiallyForSourceFileByInfo: (
        (sourceFileInfDict) => {
          const {
            sourceCodeLineBreakSeq1 ,
            sourceCodeLinebroken1 ,
            sourceCode ,
            getLineAndColNumberForPos ,
          } = (
            analyseLineBreaks(sourceFileInfDict.fullFileContents)
          ) ;
          interface XScannerState extends Scanner.State {
            DerivedState : () => XScannerState ;

            afterNextLexUnitWithPattern(...args: (
              Parameters<(
                Required<Scanner.State>["afterNextLexUnitWithPattern"]
              )>
            )): false | MatchedValueAndAfterhandScannerState<string, Scanner.DerivedOfState<this>> ;
            
          }
          const mainGetStateAt: {

            (options: {
              presentlyPosC: number ; 
              fallbackState: XScannerState | false ;
            }): XScannerState ; 
            
          } = function ({
            presentlyPosC ,
            fallbackState ,
          }) {
            const presentlyLineNumberAndColNumber = (
              getLineAndColNumberForPos(presentlyPosC)
            ) ;
            if (presentlyLineNumberAndColNumber) {
              //
            } else {
              if (fallbackState) {
                return fallbackState ;
              }
              return (
                xFail((
                  `not found 'presentlyLineNumberAndColNumber'. ` +
                  `char index ${presentlyPosC} doesn't appear to lie within any of all the lines. `
                ), {
                  presentlyPosC ,
                  lines: (
                    sourceCodeLinebroken1.slice(0, 32)
                  ) ,
                })
              ) ;
            }
            const {
              localCaretOffset: presentlyColNumber ,
              name: presentlyLineNumber ,
            } = presentlyLineNumberAndColNumber ;
            /* avoid relying on the built-in `this` keyword . */
            const this1: XScannerState = {

              DerivedState: () => BBP.Debug.fail("illegal constructor 'DerivedState'") ,

              FalseOrDidMatch: () => BBP.Debug.fail("illegal constructor 'FalseOrDidMatch'") ,

              sourceFileInfo: (
                sourceFileInfDict
              ) ,

              presentlyPosC ,
              presentlyLineNumber ,
              presentlyColNumber ,

              asAdvancedByNChars(advances) {
                  // TODO
                  return (
                    mainGetStateAt({
                      presentlyPosC: (
                        presentlyPosC + advances
                      ) ,
                      fallbackState: this1 ,
                    })
                  ) ;
              },

              afterNextToken() {
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextLinebreak() ) ) {
                  return [{ type: "linebreak", value: match, startPos: presentlyPosC, }, nextState] ;
                }
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextSingleLineWhitespace() ) ) {
                  return [{ type: "spacelike", value: match, startPos: presentlyPosC, }, nextState] ;
                }
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextKeyWord() ) ) {
                  return [{ type: "keyword", value: match, startPos: presentlyPosC, }, nextState] ;
                }
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextIdentifier() ) ) {
                  return [{ ...match, startPos: presentlyPosC, }, nextState] ;
                }
                return false ;
              },

              afterNextLinebreak() {
                for (const m of FOR_TRUTHY((
                  // TODO
                  sourceCode.slice(presentlyPosC, presentlyPosC + 11 )
                  .match(/^\r?\n/g)
                )) ) {
                  const matchedStr = (
                    (m[0] || BBP.Debug.fail() )
                  ) satisfies string ;
                  return [
                    matchedStr ,
                    (
                      this1.asAdvancedByNChars(matchedStr.length)
                    ) satisfies XScannerState ,
                  ] satisfies [string, Scanner.State] ;
                }
                return false ;
              },

              afterNextLexUnitWithPattern: (...[
                expectedPattern, 
                { singleLineOnly, fubar = true, } ,
              ]) => {
                const kwp = (
                  tryAtPresentCharPosDoParseGivenPattern(expectedPattern, {
                    singleLineOnly ,
                    fubar ,
                  })
                ) ;
                // TODO
                if (kwp) {
                  const l = kwp[0];
                  return [l, this1.asAdvancedByNChars(l.length) ] ;
                }
                return false satisfies false ;
              } ,
              
              afterNextKeyWord() {
                for (const matchAndNextState of FOR_TRUTHY((
                  this1.afterNextLexUnitWithPattern(keywordPattern, { singleLineOnly: true }) 
                )) ) {
                  return matchAndNextState satisfies [string, Scanner.State] ;
                }
                return false ;
              } ,
              afterNextSingleLineWhitespace() {
                for (const matchAndNextState of FOR_TRUTHY((
                  // TODO
                  this1.afterNextLexUnitWithPattern(/\s+?(?=\S|[\r\n]|$)/, { singleLineOnly: true }) 
                )) ) {
                  return matchAndNextState satisfies [string, Scanner.State] ;
                }
                return false ;
              } ,
              afterNextIdentifier() {
                type KeywIdentParseSupport = (
                  ReturnType<typeof getKeywordAndIdentMatchSupport>
                ) ;
                for (const [match, nextState] of FOR_TRUTHY((
                  this1.afterNextLexUnitWithPattern(classIdentPattern, { singleLineOnly: true }) 
                )) ) {
                  return [
                    { type: "top-level-name", value: match, }, 
                    nextState ,
                  ] satisfies [ReturnType<KeywIdentParseSupport["nameFromVarOrVerbIdentMatch"]>, Scanner.State] ;
                }
                for (const [match, nextState] of FOR_TRUTHY((
                  false
                  || this1.afterNextLexUnitWithPattern((varIdentPattern ), { singleLineOnly: true, })
                  || this1.afterNextLexUnitWithPattern((verbIdentPattern), { singleLineOnly: true, })
                )) ) {
                  return [
                    nameFromVarOrVerbIdentMatch([match]), 
                    nextState ,
                  ] satisfies [ReturnType<KeywIdentParseSupport["nameFromVarOrVerbIdentMatch"]>, Scanner.State] ;
                }
                return (
                  false
                ) ;
              },

            } satisfies XScannerState ;
            /** 
             * .
             * this is the backend for {@link XScannerState.afterNextLexUnitWithPattern}.
             */
            const tryAtPresentCharPosDoParseGivenPattern = (
              ((...[
                expectedPattern, 
                { singleLineOnly, } ,
              ]) => {
                const {
                  lookaheadSample ,
                } = (
                  getLookaheadStateAndEtcAtPresent({
                    forSingleLineScanning: singleLineOnly ,
                  })
                ) ;
                const kwp = (
                  /** 
                   * make `match` by `RegExp("^" + expectedPattern.source, "g" )` 
                   * against {@link lookaheadSample}.
                   */
                  lookaheadSample
                  .match(RegExp("^" + expectedPattern.source, "g" ) )
                ) ;
                return kwp ;
              }) satisfies {
                (...args: (
                  Parameters<XScannerState["afterNextLexUnitWithPattern"]> extends [infer P, infer Options] ?
                  [P, Required<Options>] : never
                ) ): ReturnType<String["match"]> ;
              }
            ) ;
            /** 
             * {@link getLookaheadStateAndEtcAt } .
             */
            const getLookaheadStateAndEtcAtPresent = (
              (options: (
                ReturnType<{ 
                  (...[{ presentlyPosC, ...otherOptions }] : Parameters<typeof getLookaheadStateAndEtcAt> ): typeof otherOptions ; 
                }>
              ) ) => (
                getLookaheadStateAndEtcAt({
                  ...options ,
                  presentlyPosC ,
                })
              )
            ) ;
            return this1 ;
          } ;
          /** 
           * either {@link String.slice `fullFileContents.slice(presentlyPosC)`},
           * or, if possible, [...]
           */
          const getLookaheadStateAndEtcAt = (
            (({
              presentlyPosC ,
              forSingleLineScanning ,
            }) => {
              if (forSingleLineScanning) {
                const l = getLineAndColNumberForPos(presentlyPosC) ;
                if (l) {
                  return {
                    lookaheadSample: (
                      l.value
                      .slice(l.localCaretOffset)
                    ) ,
                  } ;
                }
              }
              return {
                lookaheadSample: (
                  sourceFileInfDict.fullFileContents
                  .slice(presentlyPosC)
                ) ,
              } ;
            }) satisfies {
              (options: (
                & {
                  presentlyPosC: number ;
                }
                & { 
                  /** 
                   * whether the lookahead could be restricted to the same line, 
                   * necessary to avoid unecessary string ops.
                   */
                  forSingleLineScanning : false | true ; 
                }
              )) : {
                lookaheadSample: string ;
              } ;
            }
          ) ;
          return (
            mainGetStateAt({
              presentlyPosC: 0 ,
              fallbackState: false ,
            })
          ) ;
        }
      ) satisfies {
        (sample: XSourceFileInfo) : Scanner.State ;
      } ,
    
    } satisfies (
      Scanner.InitialStates 
      & { initiallyForSourceFileByInfo: Function ; }
    ) ;
    return {
      ...globalInitialStates ,
    } ;
  } ;
  return {
    getFactory ,
  } ;
})() ;

export namespace Scanner {

  export const State: (
    & InitialStates
  ) = (scannerStateImpl.getFactory)({
    xFail: (...args) => (
      BBP.impl.Debug.fail((
        BBP.impl.Debug.formatErrorMesssageWithInspect(...args)
      ))
    ) ,
  }) ;
  
}

// TEST ;
BBP.Debug.dispatchAsyncUnitTestCallback(() => {
  for (const { value: sourceCode, type, } of ([
    {
      value: "me amus me"  ,
      type: "bbpyn" ,
    },
    // {
    //   value: "Me amus me"  ,
    //   type: "bbpyn" ,
    // },
    {
      value: "me amus Me Gonna Me Anus Me Gonna "  ,
      type: "bbpyn" ,
    },
    {
      value: "me amus Me Gonna Me Anus Me \r\n Gonna Be Back \r\n Soon "  ,
      type: "bbpyn" ,
    },
  ] satisfies (
    { 
      type: ReturnType<{ (...[{ fileNameExt, }]: Parameters<typeof Scanner.State.initiallyForInlineScript>): typeof fileNameExt ; }> , 
      value: string , 
    }[]
  ) ) ) {
    ;
    const s2215 = (
      Scanner.State.initiallyForInlineScript({
        sourceCode: sourceCode ,
        fileNameExt: type ,
      })
    ) ;
    console["log"]({
      sourceCode ,
      type ,
    }) ;
    {
      (s2215.afterNextKeyWord() || BBP.Debug.fail() )[1].afterNextSingleLineWhitespace() ;
    }
    console["log"]((
      Array.from({
        *[Symbol.iterator]() {
          let v: Scanner.State | false = s2215 ;
          LOOP:
          while (v) {
            const m = ((): Scanner.State => v)().afterNextToken() ;
            if (m) {
              yield m[0] ;
              v = m[1] ;
              continue LOOP ;
            } else {
              return ;
            }
            ;
            break LOOP ;
          }
        }
      })
    )) ;
  }
}) ;














/** 
 * this file is named `scanners` and not `scanner`.
 */
export {} ; // TS-1208
