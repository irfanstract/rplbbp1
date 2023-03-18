

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

type MSc = ReturnType<typeof Array.prototype.reduce<string> >;

/** 
 * every {@link Scanner} 
 * is to *divide* a full-file code-string into *tokens* for further processing by grammar-checker(s).
 * 
 * the `type` {@link Scanner} doesn't itself provide methods to advance its state; instead, 
 * it exposes `this.state` typed as {@link Scanner.State} and 
 * the relevant methods take place there .
 * 
 * find out more on {@link Scanner.State }
 * 
 */
export class Scanner {
  state: Scanner.State ;
  
  protected constructor(properties: { state: Scanner.State ; }) ;
  protected constructor(properties: { state: Scanner.State ; }) {
    this.state = properties.state ;
  }

  static initiallyWithState(state: Scanner.State): Scanner {
    return new Scanner({ state, }) ;
  }

  toString(): string {
    // return `[object Scanner ; state: ${String(this.state) } ; ]` ;
    return `[object ${this[Symbol.toStringTag] }]: ${String(this.state) }` ;
  }
  [Symbol.toStringTag]: string = "Bbpy.Scanner" ;
  
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
   * instances of this `type` shall be immutable and value-based.
   * it shall provide {@link afterNextKeyWord `afterNextYyyMethods`}, and 
   * they each 
   * shall return either (on negative) `false` or 
   * (on positive) `[matchedToken, nextState]` (with `nextState` being {@link DerivedOfState the derived State}) .
   * 
   * note that the scanning might choose to (not automatically skip wsp(s)), and
   * it's the caller's responsibility to add that step, as
   * a whitespace could be significant depending on usage
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

    afterNextToken(): AfterNextTokenR<this> ;

    afterNextLinebreak(): false | MatchedValueAndAfterhandScannerState<string, DerivedOfState<this>> ;

    afterNextSingleLineWhitespace(): false | MatchedValueAndAfterhandScannerState<string, DerivedOfState<this>> ;
    afterNextKeyWord()             : false | MatchedValueAndAfterhandScannerState<string, DerivedOfState<this>> ;
    afterNextIdentifier()          : false | MatchedValueAndAfterhandScannerState<["" | "$" | "!", ReturnType<KeywIdentParseSupport["nameFromVarOrVerbIdentMatch"]>], DerivedOfState<this>> ;
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
    ]): false | MatchedValueAndAfterhandScannerState<RegExpMatchArray, DerivedOfState<this>> ;

    afterNextCommentNode(options?: {} ): (
      | false 
      | MatchedValueAndAfterhandScannerState<(
        | { type: ParsedCommentTokenType.JdStyle ; }
        | { type: ParsedCommentTokenType.ShStyle ; }
        | { type: ParsedCommentTokenType.DisabledCodeSection ; }
      ), DerivedOfState<this>>
    );

    /** 
     * advanced by `n` code-points disregarding the presently pointed-to token kind.
     * @deprecated
     */
    asAdvancedByNChars(n: number): DerivedOfState<this> ;

  }
  export type DerivedOfState<S extends State> = (
    ReturnType<S["DerivedState"]>
  ) ;
  // necessary to avoid the spurious Ts-2526 complaint
  type AfterNextTokenR<This extends StateI> = (
    | false 
    | Exclude<ReturnType<This["afterNextCommentNode"]> , null | false | 0>
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
        & {
          type: "identifier" ,
          value: Exclude<ReturnType<This["afterNextIdentifier"] >, false >[0] ,
        }
        & {
          startPos: number ;
        }
      )
    ), DerivedOfState<This>>
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

  export enum ParsedCommentTokenType {
    JdStyle = "/* comment" ,
    ShStyle = "# comment" ,
    DisabledCodeSection = "// op()" , 
  }
  export enum ParsedTokenType {
    JdStyleComment = ParsedCommentTokenType.JdStyle ,
    ShStyleComment = ParsedCommentTokenType.ShStyle ,
    DisabledCodeSection = ParsedCommentTokenType.DisabledCodeSection ,
    // Keyword = "keyword" satisfies "keyword" ,
    // ClassName = "class" ,
    // ClassName = "class" ,
  }

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
    interface XScannerState extends Scanner.State {
      DerivedState : () => XScannerState ;

      afterNextLexUnitWithPattern(...args: (
        Parameters<(
          Required<Scanner.State>["afterNextLexUnitWithPattern"]
        )>
      )): false | MatchedValueAndAfterhandScannerState<RegExpMatchArray, Scanner.DerivedOfState<this>> ;

    }
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
                  return [{ type: "identifier", value: match, startPos: presentlyPosC, }, nextState] ;
                }
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextCommentNode() ) ) {
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
                  return [kwp, this1.asAdvancedByNChars(l.length) ] ;
                }
                return false satisfies false ;
              } ,
              
              afterNextKeyWord() {
                for (const [match ,nextState] of FOR_TRUTHY((
                  this1.afterNextLexUnitWithPattern(keywordPattern, { singleLineOnly: true }) 
                )) ) {
                  return [match[0] ,nextState] satisfies [string, Scanner.State] ;
                }
                return false ;
              } ,
              afterNextSingleLineWhitespace() {
                for (const [match ,nextState] of FOR_TRUTHY((
                  // TODO
                  this1.afterNextLexUnitWithPattern(/\s+?(?=\S|[\r\n]|$)/, { singleLineOnly: true }) 
                )) ) {
                  return [match[0] ,nextState] satisfies [string, Scanner.State] ;
                }
                return false ;
              } ,
              afterNextIdentifier() {
                type KeywIdentParseSupport = (
                  ReturnType<typeof getKeywordAndIdentMatchSupport>
                ) ;
                type MainMatchSampleDesc = (
                  Exclude<ReturnType<XScannerState["afterNextIdentifier"]>, false >[0]
                ) ;
                for (const [match, nextState] of FOR_TRUTHY((
                  this1.afterNextLexUnitWithPattern(classIdentPattern, { singleLineOnly: true }) 
                )) ) {
                  // TODO
                  return [
                    ["", { type: "top-level-name", value: match[0], }], 
                    nextState ,
                  ] satisfies [MainMatchSampleDesc, Scanner.State] ;
                }
                for (const [matchL, nextState] of FOR_TRUTHY((
                  false
                  || this1.afterNextLexUnitWithPattern((varIdentPattern ), { singleLineOnly: true, })
                  || this1.afterNextLexUnitWithPattern((verbIdentPattern), { singleLineOnly: true, })
                )) ) {
                  const match = matchL[0] ;
                  BBP.Debug.ok(matchL[2], JSON.stringify(matchL) ) ;
                  return [
                    [(/* TODO */ (() => {
                      switch(match[0]) {
                        case "" :
                        case "!":
                        case "$" :
                          return match[0] ;
                        default :
                          return BBP.Debug.fail(`unsupported sequence: '${match[0] }' `) ;
                      }
                    })() ), nameFromVarOrVerbIdentMatch(matchL )], 
                    nextState ,
                  ] satisfies [MainMatchSampleDesc, Scanner.State] ;
                } 
                FALSECASE_DEBUGSWITCH :
                {
                  BBP.Debug.ok(0 <= presentlyPosC ) ;
                  BBP.Debug.ok( presentlyPosC <= sourceCode.length) ;
                  if (sourceCode.length <= presentlyPosC) { 
                    break FALSECASE_DEBUGSWITCH;
                  }
                  switch (sourceCode[presentlyPosC] ) {
                    case "" :
                      return false ;
                    case "!" :
                    case "$" :
                      return BBP.Debug.fail(`shall have yielded positive. source code at 'presentlyPos': '${sourceCode.slice(presentlyPosC).slice(0, 32) }' `) ;
                  }
                }
                return (
                  false
                ) ;
              },

              afterNextCommentNode() {
                for (const m of FOR_TRUTHY((
                  // TODO
                  sourceCode.slice(presentlyPosC, )
                  .match(/^\/\*[^]*?\*\//g)
                )) ) {
                  const matchedStr = (
                    (m[0] || BBP.Debug.fail() )
                  ) satisfies string ;
                  return [
                    {
                      type: Scanner.ParsedCommentTokenType.JdStyle ,
                    } ,
                    (
                      this1.asAdvancedByNChars(matchedStr.length)
                    ) satisfies XScannerState ,
                  ] satisfies [{ type: Scanner.ParsedCommentTokenType ; }, Scanner.State] ;
                }
                return false ;
              } ,

            } satisfies (
              XScannerState
              & {}
            ) ;
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
                   * against {@link lookaheadSample}, and then
                   * , if any, make further (re)match again by `expectedPattern`.
                   */
                  ((): null | RegExpMatchArray => {
                    const m1 = ( 
                      lookaheadSample
                      .match(RegExp("^" + expectedPattern.source, "g" ) )
                    ) ;
                    return (
                      m1 &&
                      m1[0]
                      .match(expectedPattern)
                    ) ;
                  })()
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
      value: "me amus Me Gonna Me Amus Me Gonna "  ,
      type: "bbpyn" ,
    },
    {
      value: "me amus Me Gonna Me Amus Me \r\n Gonna Be Back \r\n Soon "  ,
      type: "bbpyn" ,
    },
    {
      value: "while $MainProcess $[MainProcess]Id ![MainProcess]Interrupt $[MainProcess]Alive "  ,
      type: "bbpyn" ,
    },
    {
      value: "me amus Me Gonna $Me $Amus !Me ![Me]Gonna "  ,
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
      .map(desc => {
        switch (desc.type) {
          case "linebreak" :
            return desc.value ;
          case "spacelike" :
            return desc.value ;
          case "keyword" :
            return desc.value ;
          case "identifier" :
            {
              const [prefix, nmq] = desc.value ;
              switch (nmq.type) {
                case "keyword" :
                  return nmq.value ;
                case "top-level-name" :
                case "qualified-2-name" :
                  return prefix + ((): string => {
                    switch (nmq.type) {
                      case "top-level-name" :
                        return nmq.value ;
                      case "qualified-2-name" :
                        return `[${nmq.value1 } ]${nmq.value2 }` ;
                    }
                  })() ;
              }
              return desc.value ;
            }
        }
        return desc ;
      } )
    )) ;
  }
}) ;














/** 
 * this file is named `scanners` and not `scanner`.
 */
export {} ; // TS-1208
