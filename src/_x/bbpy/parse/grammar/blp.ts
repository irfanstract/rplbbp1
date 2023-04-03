

import * as BBP from "_x/bbpy/all" ;

enum ProgressionalTristate {
  Initial = 0 ,
  Moderal = 1 ,
  Terminal = 5 ,
}








export const getBlp = () => getBlpImpl() ;

import { StrTokDigestState, } from "_x/bbpy/parse/strTokDigestAutomaton";
interface StrTokDigestState1 extends StrTokDigestState {
  
  AdvancedState: BBP.impl.Constructor.ForCovar<StrTokDigestState1 > ;

  /** 
   * note that `boolean`(s) will be represented as `number`(s)
   * 
   */
  getValue?(): string | number | object ;

  getParsedTreeRepr?(): { [k: string]: {} ; } ;

}

function getBlpImpl() {
  // abstract class
  interface XStrTokDigestState extends StrTokDigestState1 {
    AdvancedState: BBP.impl.Constructor.ForInvar<XStrTokDigestState > ;
  }
  abstract class Base1 implements XStrTokDigestState {
    AdvancedState = (
      BBP.impl.Constructor.getFakeInstance() satisfies XStrTokDigestState["AdvancedState"]
    ) ;
    
    abstract withSubsequentRangeSourceCodeInfo(desc: (
      StrTokDigestState.SubsequentRangeSourceCodeInfo
    )): StrTokDigestState.ResultAfterReceivingSubsequentRangeSrcCodeInf<this> ;

    abstract afterSourceToken(desc: (
      StrTokDigestState.SourceCodeTokenInfo
    )): StrTokDigestState.ResultAfterSourceToken<this> ;

    abstract toDebugString(): string;

  } 
  const forExprStart: XStrTokDigestState = {
    toDebugString: () => `[## forExprStart]` ,
    AdvancedState: BBP.impl.Constructor.getFakeInstance() ,
    
    withSubsequentRangeSourceCodeInfo: (srcFileDesc) => (
      implWithSubsequentRangeSourceCodeInfo((
        forExprStart
      ), () => forExprStart, {
        ...srcFileDesc ,
      })
    ) ,
    // TODO
    afterSourceToken: (tokenDesc) => {
      const { content, } = tokenDesc ;
      {
        if (content === "[" || content === "(" || content === "<" ) {
          return (
            afterGroupStartToken(content )
          ) ; 
        }
      }
      {
        if (content.match(/* starts with [...] */ /^(?:[0-9]|0x|[+\-]|minus)/) ) {
          const value = Number(content satisfies string);
          if (!Number.isNaN(value satisfies number ) ) {
            return {
              afterstates: [(
                afterNumericLiteral(value)
              )] ,
            } ;
          }
        }
      }
      return {
        afterstates: [] ,
      } ;
    } ,

  } satisfies XStrTokDigestState ;
  const atBlockLevelExprStart: XStrTokDigestState = {
    toDebugString: () => `[## atBlockLevelExprStart]` ,
    AdvancedState: BBP.impl.Constructor.getFakeInstance() ,

    withSubsequentRangeSourceCodeInfo: (srcFileDesc) => (
      implWithSubsequentRangeSourceCodeInfo((
        atBlockLevelExprStart
      ), () => atBlockLevelExprStart, {
        ...srcFileDesc ,
      })
    ) ,
    afterSourceToken: (...[tokenDesc]) => {
      for (const childDigestAfterstate of forExprStart.afterSourceToken(tokenDesc).afterstates ) {
        return {
          afterstates: [childDigestAfterstate] ,
        } ;
      }
      return {
        afterstates: [] ,
      } ;
    } ,

  } satisfies XStrTokDigestState ;
  const atFunctionArgLevelExprStart = (
    forExprStart
  ) ;
  const afterGroupStartToken = ((...[content]) => {
    ; 
    /* "After Tuple Literal Starting Brace" */
    return {
      afterstates: Array.from({
        *[Symbol.iterator]() {
          for (const acceptableSeparator of [",", ";"] satisfies string[]) yield (
            atup1({
              openingBrace: content ,
              acceptableSeparators: [acceptableSeparator] ,
            })(true, {
              isOpenOrFinalised: ProgressionalTristate.Moderal,
              currentItemIndex: 0 ,
              // currentlyChildParseHead: argLevelExprStart ,
              allParsedChildren: [] ,
            } )
          ) ;
        }
      }) satisfies XStrTokDigestState[] ,
    } ;
  } ) satisfies {
    (...args: [openingChar: SupportedOpeningBrace]): {} ;
  };
  type ListExprFixture = (
    & { 
      openingBrace: SupportedOpeningBrace ; 
      acceptableSeparators: [string, ...string[]] ;
    } 
  ) ;
  type ListBodyParsingStateLsb = ( 
    & {
      /** 
       * 
       */
      currentItemIndex: number ; 
      /** 
       * all child expression(s) parsing state(s), in order
       * 
       */
      allParsedChildren: XStrTokDigestState[] ;

      /** 
       * whether this remains open, or instead a closing construct has been encountered
       * 
       */
      isOpenOrFinalised: ProgressionalTristate.Moderal | ProgressionalTristate.Terminal ; 

    }
  ) ;
  /** 
   * 
   * @see "After The Tuple Literal Starting Brace"
   */
  const atup1: {

    /** 
     * notice that 
     * it'd be impossible to change *the facts* (including, among others, the argument `openingBrace`) afterwards.
     * 
     */
    ( options: (
      & ListExprFixture
    ) ): {

      (_1: true, options: ( 
        & ListBodyParsingStateLsb
      ) ): XStrTokDigestState ;

    } ;

  } = /* TODO */ (...[
    {
      openingBrace: openingBraceChar, 
      acceptableSeparators: mAcceptableSeparators ,
    } , 
  ]) => {
    const isClosingBrace = (
      (tokenDesc: StrTokDigestState.SourceCodeTokenInfo) => (
        (tokenDesc.content satisfies string) 
        === getClosingBrace(openingBraceChar, )
      )
    ) ;
    const isKnownInterItemSeparator = (
      (tokenDesc: StrTokDigestState.SourceCodeTokenInfo) => (
        mAcceptableSeparators
        .includes(tokenDesc.content satisfies string )
      ) satisfies boolean
    ) ;
    const anext = ((_1, ...[
      {
        isOpenOrFinalised ,
        currentItemIndex ,
        allParsedChildren, 
      } , 
    ]) => {
      BBP.impl.Debug.ok((
        allParsedChildren.length < currentItemIndex 
      ) === false ) ;
      const currentlyChildParseHead = (
        allParsedChildren[currentItemIndex]
        ?? (
          // BBP.impl.Debug.fail("OOB here")
          forExprStart
        )
      ) satisfies XStrTokDigestState ;
      const forHavingTheCurrentChildrenAdvanced: {
        (options: {
          childDigestAfterstate: XStrTokDigestState ;
        }) : (
          ReturnType<(typeof this1)["afterSourceToken"]>
        ) ;
      } = ({
        childDigestAfterstate ,
      }) => (
        (
          BBP.impl.Debug.strictEqual((
            isOpenOrFinalised
          ), ProgressionalTristate.Moderal)
        ) 
        // eslint-disable-next-line no-sequences
        ,
        {
          afterstates: [(
            anext(true, { 
              // openingBrace, 
              
              isOpenOrFinalised, 

              currentItemIndex,
              // currentlyChildParseHead: childDigestAfterstate, 
              allParsedChildren: (
                BBP.impl.Immutable.List(allParsedChildren )
                .set(currentItemIndex, childDigestAfterstate )
                .toArray()
              ) , 

            } ) 
          )] ,
        } 
      ) ;
      const afterSourceTokenImpl: {
        (desc: StrTokDigestState.SourceCodeTokenInfo ): (
          ReturnType<(typeof this1)["afterSourceToken"]>
        ) ;
      } = (tokenDesc ) => {
        F1 :
        { 
          if (!(ProgressionalTristate.Initial < isOpenOrFinalised && isOpenOrFinalised < ProgressionalTristate.Terminal ) ) {
            break F1 ;
          }
          BBP.impl.Debug.strictEqual((
            isOpenOrFinalised
          ), ProgressionalTristate.Moderal);
          for (const childDigestAfterstate of (
            //
            currentlyChildParseHead
            .afterSourceToken(tokenDesc)
            // 
            .afterstates
          ) ) {
            return (
              forHavingTheCurrentChildrenAdvanced({
                childDigestAfterstate ,
              })
            ) ;
          }
          const isClosingBrace1 = (
            isClosingBrace(tokenDesc,)
          ) satisfies boolean ;
          const isKnownInterItemSeparator1 = (
            isKnownInterItemSeparator(tokenDesc, )
          ) satisfies boolean ;
          const isInterItemSeparator = (
            // TODO
            isKnownInterItemSeparator1
          ) satisfies boolean ;
          if (isClosingBrace1 || isInterItemSeparator ) {
            return {
              afterstates: [anext(true, { 
                isOpenOrFinalised: (
                  isInterItemSeparator ? ProgressionalTristate.Moderal : ProgressionalTristate.Terminal
                ) ,
                
                // openingBrace, 
                
                currentItemIndex: (
                  currentItemIndex + (
                    isClosingBrace1 ? 0 : 1
                  )
                ) ,
                allParsedChildren: [
                  ...allParsedChildren ,
                ] ,

              } ) ] ,
            } ;
          }
        }
        // TODO
        return {
          afterstates: [] ,
        } ;
      } ;
      const this1: (
        & XStrTokDigestState 
      ) = (
        {
          toDebugString: () => `[## afterTupleLiteralStartingBrace ]` ,
          AdvancedState: BBP.impl.Constructor.getFakeInstance() ,
          
          withSubsequentRangeSourceCodeInfo: (srcFileDesc) => (
            implWithSubsequentRangeSourceCodeInfo(this1, () => this1, {
              ...srcFileDesc ,
            })
          ) ,
          afterSourceToken: (...[tokenDesc,]) => (
            afterSourceTokenImpl(tokenDesc)
          ) ,
   
        } 
      ) ;
      return this1 ;
    }) satisfies ReturnType<typeof atup1> ;
    return anext ;
  } ;
  const afterNumericLiteral: {
    (value: number): XStrTokDigestState ;
  } = /* TODO */ (value) => {
    const this1: (
      & XStrTokDigestState
      & Required<Pick<XStrTokDigestState, (keyof XStrTokDigestState) & `getVa${string}`>>
    ) = (
      {
        toDebugString: () => `[## afterNumericLiteral(${value })]` ,
        AdvancedState: BBP.impl.Constructor.getFakeInstance() ,
        
        withSubsequentRangeSourceCodeInfo: (srcFileDesc) => (
          implWithSubsequentRangeSourceCodeInfo(this1, () => this1, {
            ...srcFileDesc ,
          })
        ) ,
        afterSourceToken: () => {
          // TODO
          return {
            afterstates: [] ,
          } ;
        } ,

        getValue: () => value ,
    
      } 
    ) ;
    return this1 ;
  } ; 
  /* helper */
  function implWithSubsequentRangeSourceCodeInfo<R extends XStrTokDigestState>(...args: [
    receiver: R, 
    mAfterstate: (ctx: {}) => R, 
    options: {} & StrTokDigestState.SubsequentRangeSourceCodeInfo ,
  ]): ReturnType<R["withSubsequentRangeSourceCodeInfo"]> ;
  function implWithSubsequentRangeSourceCodeInfo<R extends XStrTokDigestState>(...[this1, mAfterstateArg, options] : Parameters<typeof implWithSubsequentRangeSourceCodeInfo<R>>) {
    const mAfterstate = (
      mAfterstateArg ? mAfterstateArg({}) : this1 
    ) satisfies XStrTokDigestState ; 
    return {
      afterstates: [mAfterstate] satisfies [{}] , 
    } satisfies (
      StrTokDigestState.ResultAfterReceivingSubsequentRangeSrcCodeInf<( 
        XStrTokDigestState
      )>
    ) ;
  }
  function getClosingBrace(openingBrace: SupportedOpeningBrace): string;
  function getClosingBrace(openingBrace: SupportedOpeningBrace) {
    return (closingBraces1[openingBrace] || BBP.impl.Debug.fail(`unsupported brace`) ) ;
  }
  type SupportedOpeningBrace = keyof typeof closingBraces1 ;
  const closingBraces1 = {
    "<" : ">" ,
    "{" : "}" ,
    "[" : "]" ,
    "(" : ")" ,
  } as const;
  ;
  return ((): (
    & {
      blockLevelExprStart: StrTokDigestState ,
      argLevelExprStart: StrTokDigestState ,
    }
  ) => ({
    blockLevelExprStart: atBlockLevelExprStart ,
    argLevelExprStart: forExprStart ,
  }))() ;
}









































