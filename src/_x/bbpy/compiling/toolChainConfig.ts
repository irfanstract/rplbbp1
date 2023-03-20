

import * as BBP from "_x/bbpy/all" ;












export interface CompilerChainConfig extends CompilerChainConfigI {}
interface CompilerChainConfigI {

  /** 
   * signal a failure in the compiling chain, as given
   */
  xFail: {
    <R>(...args: Parameters<typeof BBP.impl.Debug.formatErrorMesssageWithInspect>): R ;
  } ;

}
interface CompilerChainConfigI {

  /** 
   * obtain an {@link XSourceFileInfo } for 
   * an (ad-hoc) (frozen) source-file with given full-text
   */
  getUnnamedSourceFileInfo : {
    (options: {
      sourceCode: string ;
      fileNameExt: (Required<Parameters<typeof BBP.getExpectedMimeType>>[0] & {} )["ext"] ;
    }) : XSourceFileInfo ;
  } ;

}

interface XSourceFileInfo extends BBP.SourceFileInfo {
  fullFileContents: string ;
}

/** 
 * 
 * @deprecated WORK iN PROGRESS
 */
export function getDefaultCcConfig(): CompilerChainConfig ;
export function getDefaultCcConfig(): CompilerChainConfig {
  return {

    xFail: (...args) => (
      BBP.impl.Debug.fail((
        BBP.impl.Debug.formatErrorMesssageWithInspect(...args)
      ))
    ) ,

    getUnnamedSourceFileInfo: (
      (({
        sourceCode ,
        fileNameExt ,
      }) => {
        ;
        const mimeType = (
          BBP.getExpectedMimeType({
            ext: fileNameExt, 
          })
        ) ;
        const sourceFileInfDict = {
          fullFileContents: sourceCode ,
          mimeType: mimeType ,
          href: "data:" + mimeType + "," + sourceCode ,
        } satisfies XSourceFileInfo ;
        ;
        return (
          sourceFileInfDict
        ) ;
      }) satisfies (CompilerChainConfig["getUnnamedSourceFileInfo"] & {} )
    ) ,

  } ;
} ;











