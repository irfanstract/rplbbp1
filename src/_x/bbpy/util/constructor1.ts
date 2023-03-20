











namespace ClassPseudoConstructor {

  export type ForCovar<out A> = (
    | { (...args: [never, "covar", 5, 3]): A ; }
  ) ;
  export type ForContravar<in A> = (
    | { (...args: [never, "contravar", 2, 2, A,]): void ; }
  ) ;
  export type ForInvar<A> = (
    // | { 
    //   (...args: [never, "invar", 1, 1, A,]): A ; 
    // }
    | (ForCovar<A> & ForContravar<A> )
  ) ;

  /** 
   * extract `Instance` from the given desc type
   * 
   * @see {@link ReturnType}, {@link Parameters}, {@link ThisParameterType}
   */
  export type InstanceOf<C extends { (...a: any): any ; }> = (
    | (C extends (() =>       (infer Instance) ) ? Instance : never )
    | (C extends (ForCovar    <infer Instance> ) ? Instance : never )
    | (C extends (ForContravar<infer Instance> ) ? Instance : never )
    | (C extends (ForInvar    <infer Instance> ) ? Instance : never )
  ) ;

  export const getFakeInstance: { <A extends Function>(): A } = (
    <A extends Function>() => ((() => { abstract class Fakecons {} return Fakecons ; } )() as Function as A)
  ) ;

} ;
export { ClassPseudoConstructor as XPseudoConstructor1 , } ;
















