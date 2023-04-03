

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
import { getScuSimpleEntryDesc, } from "./metaUtil";
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
  
  unaryOp : getScuSimpleEntryDesc<{
    //
    receiver: "unknown" ;
    operator: (
      BBP.impl.Constructor.ReturnValueWhenPossible<(
        LxConstructSupportOps<(
          LxConstructSupportOps.CBase
        )>["RepresentativeInstanceOps1"]
      ) > 
    );
  }>({
    helpfile: {
      toString() {
          return `unary operator application.`
      },
    } ,
    initialProperties: {
      receiver: "unknown" ,
      operator: (/* function UUNSAFE */ <R>() => (false as R))() ,
    } ,
  }) ,

} ;
import { getFakeBufferFactoryForOwnerInit, } from "./metaUtil";
export { 
  getFakeBufferFactoryForOwnerInit ,
} ;






