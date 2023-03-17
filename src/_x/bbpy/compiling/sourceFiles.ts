

import * as BBP from "_x/bbpy/all" ;








/** 
 * info about the source file URL and full text.
 */
export interface SourceFileInfoHost {
  sourceFileInfo: SourceFileInfo ;
}
/** 
 * info about a file's URL and full text.
 */
export interface SourceFileInfo {
  fullFileContents: string | ArrayBuffer ;
  href: string ;
  mimeType: string ;
}

const acceptedExtsImpl = (
  ({
    bbpya: {
      tipString: `exports` ,
    } ,
    bbpyn: {
      tipString: `dispatches` ,
    } ,
  } as const) satisfies {
    [k in keyof { 
      bbpya: true ; 
      bbpyn: true ; 
    }] : {
      tipString: string ;
    } ;
  }
) ;
export type AcceptedFileNameExt = (
  | keyof (typeof acceptedExtsImpl)
) ;
export const getExtInfo = (
  ((extName) => {
    return acceptedExtsImpl[extName] ;
  }) satisfies ((ext: AcceptedFileNameExt) => object)
) ;
export const getExpectedMimeType: {
  (options : (
    & { ext: AcceptedFileNameExt ; }
  )): string ;
} = ({
  ext ,
}) => {
  switch (ext) {
    case "bbpyn" :
    case "bbpya" :
      return (
        `data:application/x-cbbpy-bbpy`
      ) ;
  }
} ;
















/** 
 * this file is named `scanners` and not `scanner`.
 */
export {} ; // TS-1208
