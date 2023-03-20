



import * as BBP from "_x/bbpy/all" ;














/** 
 * @see {@link AddonOps}
 */
interface AddonOps<C extends AddonOps.CBase> {
  
  /**  */
  man: AddonOps.Help ;

  Buffer     : (
    BBP.impl.Constructor.ForInvar<(
      | (
        & BBP.impl.Constructor.InstanceOf<this["InstanceOps"] > 
        & { clear(): void ; }
        & { getFlags(): NodeFlags ; }
      )
    )>
  ) ;
  InstanceOps: C["InstanceOps"    ] ;

  createBuffer() : BBP.impl.Constructor.InstanceOf<this["Buffer"] > ;
  updateBuffer(...args: [
    BBP.impl.Constructor.InstanceOf<this["Buffer"]> , 
    BBP.impl.Constructor.InstanceOf<this["InstanceOps"]> , 
    {} ? , 
  ] ): void ;

  recursivity: GrammaticalRecursivity ;

  stringify(...args: [
    subject: BBP.impl.Constructor.InstanceOf<this["Buffer"]>, 
    options ?: {} ,
  ]): string ;

}
namespace AddonOps {
  
  export type Subject<C extends CBase> = AddonOps<C>;
  ;

  /** 
   * the (`type`s-only) interface which the type-argument `C` shall `implements`.
   */
  export interface CBase {
    InstanceOps: BBP.impl.Constructor.ForCovar<{}> ;
  }

  export type ItsBuffer<C extends Subject<any>> = BBP.impl.Constructor.InstanceOf<C["Buffer"]> ;

  export type Help = (
    | {
      toString(): string ;
    }
  ) ;

} ;

export { AddonOps as AddonOps , } ;

interface NodeFlags {
  preCompiled ?: boolean ;
  checked: boolean ;
} 

// interface Recursivity 
export type GrammaticalRecursivity = RecursivityEnum ;
export enum RecursivityEnum {
  /** 
   * 
   * @deprecated
   */
  None = 0 ,
  /** 
   * only terminal constructs like 
   * *identifier*, *keyword*, *operator*, *deliiter*, etc
   * 
   */
  TerminalsOnly ,
  /** 
   * 
   */
  FullRecursivity ,
}





