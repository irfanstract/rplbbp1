

import * as BBP from "_x/bbpy/all" ;








;

import { analyseLineBreaks, } from "./lineBreaks";

import { SourceFileInfoHost, } from "./sourceFiles";

7 ;

/** 
 * declares exactly these three properties :
 * - {@link presentlyLetterIndex }
 * - {@link presentlyLineNumber}
 * - {@link presentlyColNumber }
 */
export interface ScannerPosInfo {
  /** 
   * starts from `0` . 
   */
  presentlyLetterIndex: number ;
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

export class Scanner {
  state: Scanner.State ;
  
  protected constructor(properties: Scanner) ;
  protected constructor(properties: Scanner) {
    this.state = properties.state ;
  }
  
}
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
   * @see {@link State}
   */
  /* the `@link` tag be necessary to enable easy, non-breaking rename */
  export interface State extends StateI {}
  interface StateI extends SourceFileInfoHost {}
  interface StateI extends ScannerPosInfo {}
  interface StateI {
    DerivedState : State[] ;
    afterNextKeyWord(): false | MatchedValueAndAfterhandScannerState<string, DerivedState<this>> ;
    afterNextIdentifier(): false | MatchedValueAndAfterhandScannerState<ReturnType<KeywIdentParseSupport["nameFromVarOrVerbIdentMatch"]>, DerivedState<this>> ;
    /** 
     * advanced by `n` code-points disregarding the presently pointed-to token kind.
     * @deprecated
     */
    asAdvancedByNChars(n: number): DerivedState<this> ;
  }
  export type DerivedState<S extends State> = (
    S["DerivedState"][number]
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
    // Always use arrow functions !!!
    const globalInitialStates = {

      initiallyForInlineScript: (
        ({
          sourceCode ,
          fileNameExt ,
        }): Scanner.State => {
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
            getLineAndColNumberForPos ,
          } = (
            analyseLineBreaks(sourceFileInfDict.fullFileContents)
          ) ;
          interface XScannerState extends Scanner.State {
            DerivedState : XScannerState[] ;
            /** 
             * after parsing a lex unit which span for not more than one line(s).
             * 
             * RegExp `p` shall not contain metachar `^`, metachar `$`, flag `g`,
             * 
             */
            afterNextLexUnitWithPattern(...args: [
              RegExp ,
              { 
                /** 
                 * to avoid the expense/overhead of `String.instance.slice`,
                 * it might be important to limit the search to a sample single-line; however,
                 * that's not always appropriate, eg 
                 * that'd effectively prevent parsing multi-line constructs like multi-line comments.
                 */
                singleLineOnly: boolean ; 
              } ,
            ]): false | MatchedValueAndAfterhandScannerState<string, Scanner.DerivedState<this>> ;
          }
          const mainGetStateAt: {

            (options: {
              presentlyLetterIndex: number ; 
              fallbackState: XScannerState | false ;
            }): XScannerState ; 
            
          } = function ({
            presentlyLetterIndex ,
            fallbackState ,
          }) {
            const presentlyLineNumberAndColNumber = (
              getLineAndColNumberForPos(presentlyLetterIndex)
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
                  `char index ${presentlyLetterIndex} doesn't appear to lie within any of all the lines. `
                ), {
                  presentlyLetterIndex ,
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

              DerivedState: [] ,

              sourceFileInfo: (
                sourceFileInfDict
              ) ,

              presentlyLetterIndex ,
              presentlyLineNumber ,
              presentlyColNumber ,

              asAdvancedByNChars(advances) {
                  // TODO
                  return (
                    mainGetStateAt({
                      presentlyLetterIndex: (
                        presentlyLetterIndex + advances
                      ) ,
                      fallbackState: this1 ,
                    })
                  ) ;
              },

              afterNextLexUnitWithPattern: (...[
                expectedPattern, 
                { singleLineOnly, } ,
              ]) => {
                /** 
                 * either {@link String.slice `fullFileContents.slice(presentlyLetterIndex)`},
                 * or, if possible, [...]
                 */
                const {
                  lookaheadSample ,
                } = (
                  getLookaheadStateAndEtcAt({
                    presentlyLetterIndex ,
                    forSingleLineScanning: singleLineOnly ,
                  })
                ) ;
                const kwp = (
                  lookaheadSample
                  .match(RegExp("^" + expectedPattern.source, "g" ) )
                ) ;
                // TODO
                if (kwp) {
                  const l = kwp[0];
                  return [l, this1.asAdvancedByNChars(l.length) ] ;
                }
                return false satisfies false ;
              } ,
              
              afterNextKeyWord() {
                for (const [matched, nextState] of FOR_TRUTHY((
                  this1.afterNextLexUnitWithPattern(keywordPattern, { singleLineOnly: true }) 
                )) ) {
                  return [matched, nextState] satisfies [string, Scanner.State] ;
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
            return this1 ;
          } ;
          const getLookaheadStateAndEtcAt = (
            (({
              presentlyLetterIndex ,
              forSingleLineScanning ,
            }) => {
              if (forSingleLineScanning) {
                const l = getLineAndColNumberForPos(presentlyLetterIndex) ;
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
                  .slice(presentlyLetterIndex)
                ) ,
              } ;
            }) satisfies {
              (options: (
                & {
                  presentlyLetterIndex: number ;
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
              presentlyLetterIndex: 0 ,
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














/** 
 * this file is named `scanners` and not `scanner`.
 */
export {} ; // TS-1208
