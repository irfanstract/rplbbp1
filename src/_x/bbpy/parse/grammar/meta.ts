



import * as BBP from "_x/bbpy/all" ;














/** 
 * @see {@link AddonOps}
 */
interface AddonOps<C extends AddonOps.CBase> {
  
}
namespace AddonOps {
  
  export type Subject<C extends CBase> = AddonOps<C>;
  ;

  /** 
   * the (`type`s-only) interface which the type-argument `C` shall `implements`.
   */
  export interface CBase {
  }

}

interface AddonOps<C extends AddonOps.CBase> {
  
  /**  */
  man: AddonOps.Help ;
  
}
namespace AddonOps {
  
  export type Help = (
    | {
      toString(): string ;
    }
  ) ;

}

interface AddonOps<C extends AddonOps.CBase> {
  
  /* https://github.com/microsoft/TypeScript/issues/17588 */
  RepresentativeInstanceOps1: C["RepresentativeInstanceOps"    ] ;

  recursivity: GrammaticalRecursivity ;

  stringify(...args: [
    subject: AddonOps.ItsRepresentativeInstanceOps<this, BBP.impl.Constructor.IofwAccessType.W >, 
    options ?: {} ,
  ]): string ;

}
namespace AddonOps {
  
  export interface CBase {

    /** 
     * instance-specific domain properties
     * 
     */
    /* https://github.com/microsoft/TypeScript/issues/17588 */
    RepresentativeInstanceOps: (
      BBP.impl.Constructor.ForCovar<(
        RepresentativeInstanceOpsBase
      )>
    ) ;
    
  }

  /** 
   * ad-hoc base-class which {@link CBase.RepresentativeInstanceOps} shall `implements` .
   * specialising the `class` `Peer` 
   * will be essential to define the actual type for the resulting Node(s).
   * 
   */
  export interface RepresentativeInstanceOpsBase {
    /** 
     * some Node(s) can have parent(s), and
     * some can have children ;
     * they all need one common base-class
     * 
     */
    Peer: BBP.impl.Constructor.ForCovar<{}> ,
  }

  /** 
   * subclassing {@link RepresentativeInstanceOpsBase} quickly.
   * 
   */
  export interface WithRiopPeerNdpTypedefNdp<NodeDesc extends WithRiopPeerNdpTypedefNdp<NodeDesc>> extends RepresentativeInstanceOpsBase {}
  export interface WithRiopPeerNdpTypedefNdp<NodeDesc extends WithRiopPeerNdpTypedefNdp<NodeDesc>> {
    Peer: BBP.impl.Constructor.ForCovar<NodeDesc> ;
  }

  /** 
   * reflective
   * 
   */
  export type ItsRepresentativeInstanceOps<This extends Subject<any>, mode extends (
    BBP.impl.Constructor.IofwAccessType
  )> = (
    BBP.impl.Constructor.InstanceOf<This["RepresentativeInstanceOps1"], mode>
  ) ;

}

interface AddonOps<C extends AddonOps.CBase> {
  
  /* https://github.com/microsoft/TypeScript/issues/17588 */
  Buffer     : (
    // 'Invariant' caused type-mismatches
    BBP.impl.Constructor.ForCovar<(
      AddonOps.ItsBufferOpsBase<this, (
        BBP.impl.Constructor.IofwAccessType
      )>
    )>
  ) ;

  /** 
   * this object shall define 
   * methods to create-and-update the mutable repr-ive buffer.
   * 
   * rather than spreading the methods out here, 
   * we folded this, necessary for flexibility .
   * 
   */
  bufferFactory: AddonOps.DedicBufferFactory<this> ;

}
namespace AddonOps {
  
  /** bare minimum for the `type` {@link AddonOps.Buffer} */
  export type ItsBufferOpsBase<This extends Subject<any>, mode extends BBP.impl.Constructor.IofwAccessType> = (
    | (
      & ItsRepresentativeInstanceOps<This, mode >
      & SideBufferOpsImpl1
    )
  ) ;
  /** 
   * this `type` is ad-hoc for the definition of {@link ItsBufferOpsBase}.
   * we made this `export`ed to prepare for possible needs, otherwise
   * we'd leave this *private*.
   * 
   * @deprecated 
   */
  export interface SideBufferOpsImpl1 extends SideBufferOpsImpl1C {}
  interface SideBufferOpsImpl1C {}
  interface SideBufferOpsImpl1C extends AddonOps.RepresentativeInstanceOpsBase {
    /** 
     * some Node(s) can have parent(s), and some can have children ;
     * all they need to share interface
     * 
     */
    Peer: BBP.impl.Constructor.ForCovar<SideBufferOpsImpl1C> ;
  }
  interface SideBufferOpsImpl1C {
    isMutable: true ;
    clear(): void ;
    getFlags(): NodeFlags ;
  } ;
  export type DedicBufferFactory<This extends Subject<any>> = (
    & {
      createBuffer() : (
        // BBP.impl.Constructor.InstanceOf<This["Buffer"] >
        ItsBuffer<This, BBP.impl.Constructor.IofwAccessType.R>
      ) ;
      updateBuffer(...args: [
        // BBP.impl.Constructor.InstanceOf<This["Buffer"]> , 
        ItsBuffer<This, BBP.impl.Constructor.IofwAccessType.W> ,
        // BBP.impl.Constructor.InstanceOf<This["RepresentativeInstanceOps1"]> , 
        ItsRepresentativeInstanceOps<This, BBP.impl.Constructor.IofwAccessType.W >,
        {} ? , 
      ] ): void ;
    }
  ) ;
  
  /** 
   * reflective
   * 
   */
  export type ItsBuffer<This extends Subject<any>, mode extends (
    BBP.impl.Constructor.IofwAccessType
  )> = (
    BBP.impl.Constructor.InstanceOf<This["Buffer"], mode>
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





