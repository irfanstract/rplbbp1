

import * as BBP from "_x/bbpy/all" ;








import { XPat, } from "_x/bbpy/util/preciseregex/xpat";

;

export type TokenReprContentsPosOps = (
  | (
    | { contents: string ; startPos: number ; endPos: number ; }
  )
) ;

/** 
 * the supported forms of an *identifier*.
 * - `Bar` 
 * - `[Bar]Frobnication` 
 *   (requires `Bar` already visible in scope, and then
 *   defines concat-ed name `BarFrobnic~` )
 * 
 * most languages (including here) treat identifiers as single token, 
 * hence the phrase "terminal"
 * 
 */
export type TerminalBindingNameConstruct = (
  (
    | { type: TerminalBindingNameConstructType.TopLevelName ; value: string ; }
    | { type: TerminalBindingNameConstructType.Qualified2Name ; value1: string ; value2: string ; }
  )
  // & Partial<{ startPos: number ; endPos: number ; }>
) ;
/** 
 * {@link TerminalBindingNameConstruct }
 * 
 */
export enum TerminalBindingNameConstructType {
  TopLevelName   = "top-level-name"   ,
  Qualified2Name = "qualified-2-name" ,
} ;

export const getKeywordAndIdentMatchSupport = () => {
  ;
  const keywordPattern = /(?=[a-z_])[_a-z0-9]+/ ;
  const classIdentPattern = /(?=[A-Z])[_a-zA-Z0-9\$]+/ ;
  type VarOrVerbIdentMatchSupport = {
    varOrVerbIdentPatternBy: {
      (options: (
        & (
          | { forVar: true ; forVerb ?: false ; }
          | { forVar?: false; forVerb: true ; }
        )
      )): RegExp ;
    } ;
    nameFromVarOrVerbIdentMatch: {
      (sample: RegExpMatchArray): TerminalBindingNameConstruct ;
    } ;
  } ;
  const {
    varOrVerbIdentPatternBy ,
    nameFromVarOrVerbIdentMatch ,
  }: VarOrVerbIdentMatchSupport = {
    varOrVerbIdentPatternBy: ({
      forVar = false ,
      forVerb = false ,
    }) => {
      const namePattern = (
        ((): RegExp => {
          let p: RegExp = /(?=[a-zA-Z0-9_])[_a-zA-Z0-9\$]+/ ;
          p = RegExp((/(?:\[\s*(Bar)\s*\])?(Bar)/.source ).replace(/\bBar\b/g, p.source ) ) ;
          // TODO
          if (0) {
            p = RegExp((/(?:\$\{\s*(Bar)\s*\}|(Bar))/.source ).replace(/\bBar\b/g, p.source ) ) ;
          }
          return p ;
        })()
      ) ;
      const prefix = (
        forVar ? "$" : 
        forVerb ? "!" : 
        BBP.Debug.fail()
      ) satisfies string ;
      return (
        RegExp((
          ("\\" + prefix) + namePattern.source
        ))
      ) ;
    } ,
    nameFromVarOrVerbIdentMatch(sample) {
        const parentName = sample[1] || false ;
        const childName = sample[2]!;
        const {
          endPos ,
          startPos ,
        } = {
          startPos: 0 ,
          endPos: sample[0].length ,
        } ;
        if (parentName) {
          return {
            type: TerminalBindingNameConstructType.Qualified2Name, 
            value1: parentName, 
            value2: childName, 
          } ;
        } else {
          return { 
            type: TerminalBindingNameConstructType.TopLevelName, 
            value: childName, 
          } ;
        }
    },
  } ;
  const varIdentPattern  = varOrVerbIdentPatternBy({ forVar : true, }) ;
  const verbIdentPattern = varOrVerbIdentPatternBy({ forVerb: true, }) ;
  BBP.impl.Debug.ok((
    varIdentPattern.source.startsWith("\\$")
  ), BBP.impl.Debug.inspect({ varIdentPattern, }));
  BBP.impl.Debug.ok((
    verbIdentPattern.source.startsWith("\\!")
  ), BBP.impl.Debug.inspect({ verbIdentPattern, }));
  console["log"]({
    varIdentPattern ,
    verbIdentPattern ,
  }) ;
  M: 
  {}
  return {
    keywordPattern ,
    classIdentPattern ,  
    varOrVerbIdentPatternBy ,
    nameFromVarOrVerbIdentMatch ,
    varIdentPattern ,
    verbIdentPattern ,
  } satisfies (
    & { [_: string] : {} ; }
    & VarOrVerbIdentMatchSupport
  ) ;
} ;










