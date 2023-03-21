

import * as BBP from "_x/bbpy/all" ;

















/** 
 * until 
 * https://github.com/microsoft/TypeScript/issues/17588 (inability to define inner types) 
 * gets fixed-and-backported,
 * for now we'll need to rely on this solution.
 * 
 */
namespace ClassPseudoConstructor {

  export type ForCovar    <A> = (ForCovarImpl    <A> ) ;
  export type ForContravar<A> = (ForContravarImpl<A> ) ;
  export type ForInvar<A> = (
    // | { 
    //   (...args: [never, "invar", 1, 1, A,]): A ; 
    // }
    // | (ForCovar<A> & ForContravar<A> )
    | ForInvarImpl<A>
  ) ;
  interface ForCovarImpl<out A> {
    (...args: [never, "covar", 5, 3]): A ;
  };
  interface ForContravarImpl<in A> {
    (...args: [never, "contravar", 2, 2, A,]): void ;
  };
  interface ForInvarImpl<A> extends ForCovar<A>, ForContravar<A> {}

  /** 
   * extract `Instance` from the given desc type
   * 
   * @see {@link ReturnType}, {@link Parameters}, {@link ThisParameterType}
   */
  export type InstanceOf<C extends { (...a: any): any ; }> = (
    // HOTPATH
    | (C extends (ForInvarImpl<infer Instance> ) ? Instance : never )
    // REGULAR - INVAR
    | (C extends (ForInvar    <infer Instance> ) ? Instance : never )
    // REGULAR - MONOVAR
    | (C extends (() =>       (infer Instance) ) ? Instance : never )
    | (C extends (ForCovar    <infer Instance> ) ? Instance : never )
    | (C extends (ForContravar<infer Instance> ) ? Instance : never )
  ) ;
  
  export type ForAnyva1<AC extends <A1>(...args: [never, "cova1"]) => unknown> = (
    | AC
  ) ;

  // /**  */
  export const getFakeInstance: { <A extends Function>(): A } = (
    <A extends Function>() => (
      (
        // every 'class' requires 'new'
        class {}
      ) as Function as A
    )
  ) ;

} ;
export { ClassPseudoConstructor as Constructor , } ;

export default ClassPseudoConstructor ;
















