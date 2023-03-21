

import * as BBP from "_x/bbpy/all" ;








;

import { analyseLineBreaks, } from "./lineBreaks";

import { SourceFileInfoHost, } from "./sourceFiles";
import { 
  getDefaultCcConfig,
  CompilerChainConfig ,
} from "_x/bbpy/compiling/toolChainConfig";

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
type KeywIdentParseSupport = (
  ReturnType<typeof getKeywordAndIdentMatchSupport>
) ;
import {
  TerminalBindingNameConstruct ,
  TerminalBindingNameConstructType ,
} from "./grammar/keywordAndIdentifier";

import { PureConstruct, } from "./grammar/main";

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
    
    afterNextKeyWord()     : false | MatchedValueAndAfterhandScannerState<PureConstruct.KeyWord   , DerivedOfState<this>> ;
    afterNextIdentifier()  : false | MatchedValueAndAfterhandScannerState<PureConstruct.Identifier, DerivedOfState<this>> ;
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
    ]): (
      | false 
      | MatchedValueAndAfterhandScannerState<(
        {
          fullMatchedGroupsList: RegExpMatchArray ,
        }
      ), DerivedOfState<this>>
    ) ;

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
    | (
      | (
        ReturnType<({
          (...[v1, v2]: Exclude<ReturnType<This["afterNextCommentNode"]> , null | false | 0> ): [
            (typeof v1) & MaybeRequiredToSpecifyTheStartAndEndPos, 
            typeof v2, 
          ] ;
        })>
      )
      | MatchedValueAndAfterhandScannerState<(
        & (
          | {
            type: (
              | "linebreak"
              | "spacelike"
            ) ; 
            value: string ; 
          }
          | {
            type: ( 
              | "keyword"
            ) ; 
            value: string ; 
          }
          | (
            & {
              type: "identifier" ,
              value: Exclude<ReturnType<This["afterNextIdentifier"] >, false >[0] ,
            }
          )
        )
        & MaybeRequiredToSpecifyTheStartAndEndPos
      ), DerivedOfState<This>>
    )
  ) ;
  /** 
   * in addition to `type` and `contents` which will always be essential,
   * there might arise need to maintain additional info like `pos`, `sourceText` ;
   * add more properties here
   */
  export interface MaybeRequiredToSpecifyTheStartAndEndPos {
    startPos: number ; 
    endPos : number ;
    sourceText: string ;
  } ;
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

export namespace Scanner {

  export import ParsedCommentTokenType = PureConstruct.CommentTokenType ;
  
  export enum ParsedTokenType {
    JdStyleComment = ParsedCommentTokenType.JdStyle ,
    ShStyleComment = ParsedCommentTokenType.ShStyle ,
    DisabledCodeSection = ParsedCommentTokenType.DisabledCodeSection ,
    // Keyword = "keyword" satisfies "keyword" ,
    // ClassName = "class" ,
    // ClassName = "class" ,
  }
  
} ;

const scannerStateImpl = (() => {
  type HostLevelConfig = import("_x/bbpy/compiling/toolChainConfig").CompilerChainConfig ;
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
    getUnnamedSourceFileInfo ,
  } : (
    ReturnType<{
      ({ ...etc } : HostLevelConfig): typeof etc ;
    }>
  )) => {
    type SSFI = Scanner.State["sourceFileInfo"] ;
    interface XSourceFileInfo extends BBP.CompilerChain.SourceFileInfo {
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
    interface XScannerState extends Scanner.State {
      DerivedState : () => XScannerState ;

      afterNextLexUnitWithPattern(...args: (
        Parameters<(
          Required<Scanner.State>["afterNextLexUnitWithPattern"]
        )>
      )): (
        | false 
        | MatchedValueAndAfterhandScannerState<(
          {
            fullMatchedGroupsList: RegExpMatchArray ,
          }
        ), Scanner.DerivedOfState<this>>
      ) ;

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
                const spe = (
                  (c: XScannerState) => ({
                    startPos: presentlyPosC ,
                    endPos: c.presentlyPosC ,
                    sourceText: sourceCode.slice(presentlyPosC, c.presentlyPosC ) ,
                  } satisfies Scanner.MaybeRequiredToSpecifyTheStartAndEndPos)
                ) ;
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextLinebreak() ) ) {
                  return [{ type: "linebreak", value: match, ...spe(nextState), }, nextState] ;
                }
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextSingleLineWhitespace() ) ) {
                  return [{ type: "spacelike", value: match, ...spe(nextState), }, nextState] ;
                }
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextKeyWord() ) ) {
                  return [{ type: "keyword", value: match, ...spe(nextState), }, nextState] ;
                }
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextIdentifier() ) ) {
                  return [{ type: "identifier", value: match, ...spe(nextState), }, nextState] ;
                }
                for (const [match, nextState] of FOR_TRUTHY(this1.afterNextCommentNode() ) ) {
                  return [{ ...match, ...spe(nextState), }, nextState] ;
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
                  return [
                    { fullMatchedGroupsList: kwp, }, 
                    this1.asAdvancedByNChars(l.length) ,
                  ] ;
                }
                return false satisfies false ;
              } ,
              
              afterNextKeyWord() {
                for (const [{ fullMatchedGroupsList: match, } ,nextState] of FOR_TRUTHY((
                  this1.afterNextLexUnitWithPattern(keywordPattern, { singleLineOnly: true }) 
                )) ) {
                  return [match[0] ,nextState] satisfies [string, Scanner.State] ;
                }
                return false ;
              } ,
              afterNextSingleLineWhitespace() {
                for (const [{ fullMatchedGroupsList: match, } ,nextState] of FOR_TRUTHY((
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
                for (const [{ fullMatchedGroupsList: match, }, nextState] of FOR_TRUTHY((
                  this1.afterNextLexUnitWithPattern(classIdentPattern, { singleLineOnly: true }) 
                )) ) {
                  // TODO
                  return [
                    (() => {
                      const name = match[0] satisfies string ;
                      return (
                        [
                          "", 
                          { 
                            type: TerminalBindingNameConstructType.TopLevelName, 
                            value: name , 
                          } ,
                        ] satisfies MainMatchSampleDesc
                      ) ;
                    })(), 
                    nextState ,
                  ] satisfies [MainMatchSampleDesc, Scanner.State] ;
                }
                for (const [{ fullMatchedGroupsList: matchL, }, nextState] of FOR_TRUTHY((
                  false
                  || this1.afterNextLexUnitWithPattern((varIdentPattern ), { singleLineOnly: true, })
                  || this1.afterNextLexUnitWithPattern((verbIdentPattern), { singleLineOnly: true, })
                )) ) {
                  return [
                    (() => {
                      BBP.Debug.ok(matchL[2], JSON.stringify(matchL) ) ;
                      const fullMatch = matchL[0] ;
                      const prefix = (
                        (/* TODO */ (() => {
                          switch(fullMatch[0]) {
                            case "" :
                              return BBP.Debug.fail(`spurious EOW`) ;
                            case "!":
                            case "$" :
                              return fullMatch[0] ;
                            default :
                              return BBP.Debug.fail(`unsupported sequence: '${fullMatch[0] }' `) ;
                          }
                        })() )
                      ) ;
                      const nameConstruction = (
                        nameFromVarOrVerbIdentMatch(matchL )
                      ) ;
                      return (
                        [
                          prefix, 
                          nameConstruction,
                        ] satisfies MainMatchSampleDesc
                      ) ;
                    })(), 
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
                      return BBP.Debug.fail(`shall have yielt positive. source code at 'presentlyPos': '${sourceCode.slice(presentlyPosC).slice(0, 32) }' `) ;
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
  ) = (scannerStateImpl.getFactory)((
    getDefaultCcConfig()
  )) ;
  
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
      value: "me amus Me Gonna $Me $Amus !Me ![Me]Gonna /* meanwhile */ "  ,
      type: "bbpyn" ,
    },
  ] satisfies (
    { 
      type: ReturnType<{ (...[{ fileNameExt, }]: Parameters<typeof Scanner.State.initiallyForInlineScript>): typeof fileNameExt ; }> , 
      value: string , 
    }[]
  ) ) ) {
    ;
    const menn: { m: () => object } = { m() { return this ; } } ;
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
        return (
          `<${BBP.impl.Debug.inspect([desc.startPos, desc.endPos, desc.sourceText, ]) }>`
          +
          " "
          +
          ((): string => {
            ;
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
                  return prefix + ((): string => {
                    switch (nmq.type) {
                      case TerminalBindingNameConstructType.TopLevelName :
                        return nmq.value ;
                      case TerminalBindingNameConstructType.Qualified2Name :
                        return `[${nmq.value1 } ]${nmq.value2 }` ;
                    }
                  })() ;
                }
              case Scanner.ParsedCommentTokenType.JdStyle :
              case Scanner.ParsedCommentTokenType.ShStyle :
                return desc.sourceText ;
            }
            return BBP.impl.Debug.inspect(desc) ;
          } )()
        ) ;
      } )
    )) ;
  }
}) ;














/** 
 * this file is named `scanners` and not `scanner`.
 */
export {} ; // TS-1208
