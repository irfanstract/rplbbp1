

import * as BBP from "_x/bbpy/all" ;















;

import { AddonOps as LxConstructSupportOps, } from "./meta" ;
import { GrammaticalRecursivity, RecursivityEnum, } from "./meta";

/** 
 * 
 * utility which return rudimentary subclass of {@link LxConstructSupportOps }
 */
const getScuSimpleEntryDesc = (
  <NodeDescUsr extends {}>({
    helpfile: man ,
    initialProperties ,
    implStringify ,
  }: {
    helpfile: LxConstructSupportOps.Help ;
    initialProperties: NodeDescUsr ;
    implStringify ?: {
      (options: (
        & { nodeProperties: NodeDescUsr ; }
      ) ): {
        shortPhr: string ;
      } ;
    } ;
  } ) => {
    /** 
     * to deal with recursion/recursivity,
     * it'd be necessary to make the relevant type(s) symbolic
     * 
     */
    ;
    type NodeDescUsrRemapped = { [k in keyof NodeDescUsr]: NodeDescUsr[k] ; } ;
    // interface NodeDesc extends LxConstructSupportOps.WithRiopPeerNdpTypedefNdp<NodeDesc > {
    //   receiver: "unknown" ;
    //   operator: "unknown" ;
    // }
    // interface NodeDesc extends NodeDescUsr1 {} ;
    type NodeDesc = (
      & LxConstructSupportOps.WithRiopPeerNdpTypedefNdp<NodeDesc >
      & NodeDescUsrRemapped
    ) ;
    interface Main extends LxConstructSupportOps<Lca> {}
    interface Lca extends LxConstructSupportOps.CBase {
      RepresentativeInstanceOps: BBP.impl.Constructor.ForInvar<NodeDesc> ;
    } ;
    interface Main {
      bufferFactory: (
        LxConstructSupportOps.DedicBufferFactory<this>
      ) ;
    }
    return {
      recursivity: RecursivityEnum.TerminalsOnly ,
      bufferFactory: (
        getFakeBufferFactoryForOwnerInit<Main>({
          initialProperties: {
            // receiver: "unknown",
            // operator: "unknown" ,
            ...(initialProperties satisfies NodeDescUsrRemapped) ,
            Peer: BBP.impl.Constructor.getFakeInstance() ,
          } satisfies NodeDesc ,
        })
      ) satisfies Main["bufferFactory"] ,
      stringify: (node) => {
        // TODO
        // return BBP.Debug.fail() ;
        return (
          implStringify?.({
            nodeProperties: node ,
          }).shortPhr
          ?? 
          BBP.impl.Debug.inspect(node)
        ) ;
      } ,
      Buffer: BBP.impl.Constructor.getFakeInstance() ,
      RepresentativeInstanceOps1: BBP.impl.Constructor.getFakeInstance() ,
      man: man ,
    } satisfies Main ;
  } 
) ;
/** 
 * 
 * @deprecated
 */
function getFakeBufferFactoryForOwnerInit<This extends LxConstructSupportOps<any>>(options: (
  & { initialProperties: LxConstructSupportOps.ItsRepresentativeInstanceOps<This, BBP.impl.Constructor.IofwAccessType.W> ; }
) ): (
  LxConstructSupportOps.DedicBufferFactory<This>
) ;
function getFakeBufferFactoryForOwnerInit<This extends LxConstructSupportOps<any>>({
  initialProperties ,
} : (
  & { initialProperties: LxConstructSupportOps.ItsRepresentativeInstanceOps<This, BBP.impl.Constructor.IofwAccessType.W> ; }
) ): (
  LxConstructSupportOps.DedicBufferFactory<This>
) {
  return {
    // TODO
    ...(initialProperties as object) ,

    createBuffer() {
      return BBP.impl.Debug.failTodo() ;
    } ,
    updateBuffer() {
      return BBP.impl.Debug.failTodo() ;
    } ,

  } ;
}
0 && BBP.impl.Debug.failTodo() ;

export {
  getScuSimpleEntryDesc ,
  getFakeBufferFactoryForOwnerInit ,
} ;





















