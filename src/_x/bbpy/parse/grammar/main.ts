

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
  
  "unaryOp" : (() => {
    interface UnaryOpLcb extends LxConstructSupportOps.CBase {
    } ;
    return {
      recursivity: RecursivityEnum.TerminalsOnly ,
      createBuffer: () => {
        // TODO
        return {
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
      stringify: () => {
        // TODO
        return BBP.Debug.fail() ;
      } ,
      Buffer: BBP.impl.Constructor.getFakeInstance() ,
      InstanceOps: BBP.impl.Constructor.getFakeInstance() ,
      man: {
        toString() {
            return `unary operator application.`
        },
      } ,
    } satisfies (
      LxConstructSupportOps<(
        UnaryOpLcb
      )>
    ) ;
  } )() ,

} ;






