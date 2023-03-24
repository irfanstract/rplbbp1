

import * as BBP from "_x/bbpy/all" ;

















/** 
 * until 
 * https://github.com/microsoft/TypeScript/issues/17588 (inability to define inner types) 
 * gets fixed-and-backported,
 * for now we'll need to rely on this solution.
 * 
 */
namespace ClassPseudoConstructor {

  /** 
   * by definition,
   * `ForInvar<A>` will be usable whenever 
   * the CC needed to be `ForCovar<BU> (where A extends BU)` or 
   * it needed to be `ForContravar<BL>` (where BL extends A) .
   * 
   */
  export type ForInvar<A> = (
    (
      // | { 
      //   (...args: [never, "invar", 1, 1, A,]): A ; 
      // }
      // | (ForCovar<A> & ForContravar<A> )
      | ForInvarImpl<A>
    ) & { __c ?: unknown ; }
  ) ;
  export type ForCovar    <A> = (ForCovarImpl    <A> ) ;
  export type ForContravar<A> = (ForContravarImpl<A> ) ;

  interface ForInvarImpl<A> extends ForCovar<A>, ForContravar<A> {}
  interface ForCovarImpl<out A> {
    (...args: [never, "covar", 5, 3]): A ;
  };
  interface ForContravarImpl<in A> {
    (...args: [never, "contravar", 2, 2, A,]): void ;
  };

  /** 
   * extract `Instance` from the given desc type
   * 
   * the naming of this type-def does not distinguish whether for read-pos or for write-pos.
   * indeed, 
   * normally, in languages with opaque-types support, 
   * variance will generally result in the resulting-type being.effectively "a type-parameter", so
   * there'd be no need to provide separate type-def(s) for the R and W pos(es).
   * as a workaround
   * the implementation will use an ad-hoc indexed-access type where `keyType` is a union type.
   * 
   * note:
   * this type-def was misbehaving (ie always evaluating as on a read-position), so 
   * we decided to add extra (required) type-param {@link accessMode}
   * 
   * @see {@link ReturnType}, {@link Parameters}, {@link ThisParameterType}
   */
  /*  */
  // TODO
  export type InstanceOf<C extends { (...a: any): any ; }, accessMode extends IofwAccessType> = (
    // // REGULAR - INVAR
    // | (C extends (ForInvar    <infer Instance> ) ? Instance : any )
    // // REGULAR - MONOVAR
    // | (C extends (() =>       (infer Instance) ) ? Instance : any )
    // | (C extends (ForCovar    <infer Instance> ) ? Instance : any )
    // | (C extends (ForContravar<infer Instance> ) ? Instance : any )
    | (
      /** 
       * when the `indexType` of an Indexed Access Type is `K1 | K2`, and
       * (as a surprising additional requiremen(s)) 
       * at-least one of `C` `K1` `K2` is generic,
       * the actual value 
       * will be (on read/RHS) `C[K1] | C[K2]` or (on write/LHS) `C[K1] & C[K2]`.
       * 
       */
      // TODO
      // {
      //   p: ConformanteWhenPossible<C> ;
      //   r: ReturnValueWhenPossible<C> ;
      // }["p" | "r"]
      // ReturnType<{
      //   main<K extends "p" | "r", L extends K, Cl extends {
      //       p: ConformanteWhenPossible<C> ;
      //       r: ReturnValueWhenPossible<C> ;
      //   }, K1 extends keyof Cl>(): Cl[K1] ;
      // }["main"]>
      (
        accessMode extends IofwAccessType.W ? ConformanteWhenPossible<C> :
        accessMode extends IofwAccessType.R ? ReturnValueWhenPossible<C> :
        { __never: never ; }
      )
    )
  ) ;
  export enum IofwAccessType {
    R = "r" ,
    W = "w" ,
  } ;
  const IONEVER = Symbol() ;
  /** 
   * extract `Instance` from the given desc type
   */
  export type ReturnValueWhenPossible<C extends { (...a: any): any ; }> = (
    & (C extends (() =>     (infer Instance) ) ? Instance : unknown )
    & (C extends (ForCovar  <infer Instance> ) ? Instance : unknown )
  ) ;
  /** 
   * extract `Instance` from the given desc type
   */
  export type ConformanteWhenPossible<C extends { (...a: any): any ; }> = (
    | (C extends { (...args: [(infer Instance), ...unknown[]]): unknown } ? Instance : never )
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
















