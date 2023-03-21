

import * as BBP from "_x/bbpy/all" ;















import { getKeywordAndIdentMatchSupport, } from "./keywordAndIdentifier";
type KeywIdentParseSupport = (
  ReturnType<typeof getKeywordAndIdentMatchSupport>
) ;
import {
  TerminalBindingNameConstruct ,
  TerminalBindingNameConstructType ,
} from "./keywordAndIdentifier";



;
export namespace PureConstruct {

  export enum CommentTokenType {
    JdStyle = "/* comment" ,
    ShStyle = "# comment" ,
    DisabledCodeSection = "// op()" , 
  }

  export type CommentNode = (
    | { type: CommentTokenType.JdStyle ; }
    | { type: CommentTokenType.ShStyle ; }
    | { type: CommentTokenType.DisabledCodeSection ; }
  ) ;

  export type Identifier = (
    ["" | "$" | "!", ReturnType<KeywIdentParseSupport["nameFromVarOrVerbIdentMatch"]>]
  ) ;
  export type KeyWord = string ;

} ;

import { AddonOps as LxConstructSupportOps, } from "./meta" ;
import { GrammaticalRecursivity, RecursivityEnum, } from "./meta";
// TODO
export const supportedConstructs: (
  | (
    & {
      [k: string] : (
        LxConstructSupportOps<(
          LxConstructSupportOps.CBase
        )>
      ) ;
    }
  )
) = {
  
  unaryOp : (() => {
    /** 
     * to deal with recursion/recursivity,
     * it'd be necessary to make the relevant type(s) symbolic
     * 
     */
    ;
    interface Lca extends LxConstructSupportOps.CBase {
      RepresentativeInstanceOps: BBP.impl.Constructor.ForInvar<NodeDesc> ;
    } ;
    interface NodeDesc extends LxConstructSupportOps.RepresentativeInstanceOpsBase {
      Peer: BBP.impl.Constructor.ForCovar<NodeDesc> ;
      receiver: "unknown" ;
      operator: "unknown" ;
    }
    interface Main extends LxConstructSupportOps<Lca> {
      bufferFactory: (
        LxConstructSupportOps.DedicBufferFactory<this>
      ) ;
    }
    return {
      recursivity: RecursivityEnum.TerminalsOnly ,
      bufferFactory: {
        createBuffer: () => {
          // TODO
          return {
            receiver: "unknown" ,
            operator: "unknown" ,
            Peer: BBP.impl.Constructor.getFakeInstance<(
              & NodeDesc["Peer"]
              & BBP.impl.Constructor.ForInvar<LxConstructSupportOps.SideBufferOpsImpl1>
            )>() ,
            isMutable: true ,
            clear() {
            },
            getFlags() {
              return {
                checked: false ,
              } ;
            }
          } ;
        } ,
        updateBuffer: () => {} ,
      } ,
      stringify: () => {
        // TODO
        return BBP.Debug.fail() ;
      } ,
      Buffer: BBP.impl.Constructor.getFakeInstance() ,
      RepresentativeInstanceOps1: BBP.impl.Constructor.getFakeInstance() ,
      man: {
        toString() {
            return `unary operator application.`
        },
      } ,
    } satisfies Main ;
  } )() ,

} ;






