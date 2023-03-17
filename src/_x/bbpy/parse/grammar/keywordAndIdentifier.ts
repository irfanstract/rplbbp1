

import * as BBP from "_x/bbpy/all" ;








;

const getKeywordAndIdentMatchSupport = () => {
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
      (sample: RegExpMatchArray): (
        | { type: "top-level-name" ; value: string ; }
        | { type: "qualified-2-name" ; value1: string ; value2: string ; }
      ) ;
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
      const namePattern = /(?=[a-zA-Z0-9_])[_a-zA-Z0-9\$]+/ ;
      const prefix = (
        forVar ? "$" : "!"
      ) satisfies string ;
      return (
        RegExp((
          prefix + `(?:\\[(${namePattern })\\])?(${namePattern })`
        ))
      ) ;
    } ,
    nameFromVarOrVerbIdentMatch(sample) {
        const parentName = sample[1] || false ;
        const childName = sample[2]!;
        if (parentName) {
          return { type: "qualified-2-name", value1: parentName, value2: childName, } ;
        } else {
          return { type: "top-level-name", value: childName, } ;
        }
    },
  } ;
  const varIdentPattern  = varOrVerbIdentPatternBy({ forVar : true, }) ;
  const verbIdentPattern = varOrVerbIdentPatternBy({ forVerb: true, }) ;
  BBP.impl.Debug.ok((
    varIdentPattern.source.startsWith("$")
  ), BBP.impl.Debug.inspect({ varIdentPattern, }));
  BBP.impl.Debug.ok((
    verbIdentPattern.source.startsWith("!")
  ), BBP.impl.Debug.inspect({ verbIdentPattern, }));
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

export {
  getKeywordAndIdentMatchSupport as getKeywordAndIdentMatchSupport ,
} ;









