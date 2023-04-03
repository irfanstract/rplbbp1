

import * as BBP from "_x/bbpy/all" ;











/** 
 * 
 * @see {@link StrTokDigestState }
 */
interface StrTokDigestState {}
interface StrTokDigestState {
  
  AdvancedState: BBP.impl.Constructor.ForCovar<StrTokDigestState > ;

}
namespace StrTokDigestState { 
  
  /** 
   * the bare minimum ops 
   * necessitated for every return-dict of the deriving methods
   * 
   */
  export interface ResultAfterYyy1<This extends StrTokDigestState> { 
    afterstates: BBP.impl.Constructor.ReturnValueWhenPossible<This["AdvancedState"] >[] ;
  }

}
interface StrTokDigestState {
  
  /** 
   * 
   */
  getValue?(): string | boolean | number | object ;

  /** 
   * this would have been `toString` from `Object.prototype` instead, but
   * there appears to be the issue in `tsc` being improper in dealing with such method names.
   * 
   */
  toDebugString(): string ;
  
}
interface StrTokDigestState {
  
  withSubsequentRangeSourceCodeInfo(desc: (
    StrTokDigestState.SubsequentRangeSourceCodeInfo
  )): StrTokDigestState.ResultAfterReceivingSubsequentRangeSrcCodeInf<this> ;

}
namespace StrTokDigestState { 
  
  export interface SubsequentRangeSourceCodeInfo {
    sourceFileUrl: string ;
  }

  export type ResultAfterReceivingSubsequentRangeSrcCodeInf<This extends StrTokDigestState> = (
    ResultAfterReceivingSubsequentRangeSrcCodeInf1<This>
  ) ;
  interface ResultAfterReceivingSubsequentRangeSrcCodeInf1<This extends StrTokDigestState> extends ResultAfterYyy1<This> { 
    afterstates: [BBP.impl.Constructor.ReturnValueWhenPossible<This["AdvancedState"] >] ;
  }
  
}
interface StrTokDigestState {
  
  afterSourceToken(desc: (
    StrTokDigestState.SourceCodeTokenInfo
  ) ): StrTokDigestState.ResultAfterSourceToken<this> ;

}
namespace StrTokDigestState {
  
  export interface SourceCodeTokenInfo {
    content: string ;
  }

  export type ResultAfterSourceToken<This extends StrTokDigestState> = (
    ResultAfterSourceToken1<This>
  );
  interface ResultAfterSourceToken1<This extends StrTokDigestState> extends ResultAfterYyy1<This> { 
    afterstates: BBP.impl.Constructor.ReturnValueWhenPossible<This["AdvancedState"] >[] ;
  }
  
}










export { StrTokDigestState, } ;














