
import * as BBP from "_x/bbpy/all" ;













const {
  LINEBREAK ,
  NON_LINEBREAK_CHAR: NON_LINEBRK_CHAR ,
} = {
  LINEBREAK: (
    /\r?\n/g
  ) ,
  NON_LINEBREAK_CHAR: /./g ,
} ;

type LineOrLinebreakInfo = (
  | { type: ("line"       ) ; value: (string  ) ; }
  | { type: ("linebreak"  ) ; value: (string  ) ; }
) ;

export const analyseLineBreaks = (
  ((...[sourceCode]: [sample: string]) => {
    ;
    const sourceCodeLineBrks = (
      sourceCode
      .match(LINEBREAK )
      || []
    ) ;
    const sourceCodeLinebroken = (
      sourceCode
      .split(LINEBREAK)
    ) ;
    const sourceCodeLineBreakSeq10 = (
      Array.from({
        *[Symbol.iterator](): Generator<LineOrLinebreakInfo> {
          for (let i=0; i<sourceCodeLinebroken.length; ++i) {
            yield {
              type: "line" ,
              value: sourceCodeLinebroken[i]! ,
            } ;
            if (i < sourceCodeLineBrks.length) {
              yield {
                type: "linebreak" ,
                value: sourceCodeLineBrks[i]! ,
              } ;
            }
          }
        } ,
      })
    ) ;
    const sourceCodeLineBreakSeq1 = (
      BBP.impl.Immutable.Seq(sourceCodeLineBreakSeq10)
      .reduce<[
        mainResult: (
          (
            & LineOrLinebreakInfo
            & {
              startPos: number ;
              endPos: number ;
            }
          )[]
        ) ,
        parseState: { 
          lastPos: number ;
        } ,
      ]>(([
        cumulative1 ,
        {
          lastPos ,
        }
      ], item ) => {
        const itemStartPos = lastPos ;
        const itemEndPos = lastPos + item.value.length ;
        return [
          [
            ...cumulative1 ,
            {
              ...item ,
              startPos: itemStartPos ,
              endPos: itemEndPos ,
            } ,
          ] ,
          {
            lastPos: itemEndPos ,
          } ,
        ] ;
      }, [
        [] ,
        { lastPos: 0 , } ,
      ] )
      [0]
    ) ;
    const sourceCodeLinebroken1 = (
      sourceCodeLineBreakSeq1
      .flatMap(({ type, value, ...sp }) => ((
        (type === "line") ? [{ value, ...sp }] : []
      ) satisfies ([] | [object])) )
      .map((p, i) => ({
        ...p ,
        /** "the line number", starting from `1` */
        name: 1 + i ,
      }) )
    ) ;
    /** 
     * sometimes one's only left with `pos`, and yet
     * it were necessary to idenfiy *the line number and column*.
     */
    const getLineAndColNumberForPos = (
      (...[presentlyLetterIndex]: [number]) => (
        sourceCodeLinebroken1
        .flatMap((p) => ((() => {
          if (p.startPos <= presentlyLetterIndex && presentlyLetterIndex <= p.endPos) {
            const localCaretOffset = presentlyLetterIndex - p.startPos ;
            return [{
              ...p,
              localCaretOffset ,
            }] ;
          } else {
            return [] ;
          }
        }) satisfies { (): [] | [{}] })())
        [0]
      )
    ) ;
    return {
      sourceCode ,
      sourceCodeLinebroken ,
      sourceCodeLineBrks ,
      sourceCodeLineBreakSeq1 ,
      sourceCodeLinebroken1 ,
      // lineBreakIndices ,

      getLineAndColNumberForPos ,
      
    } ;
  } )
) ;









// TESTS
;
const testifyLinebreakingCorrectness: {
  (...args: [
    sample: string, 
    options: {
      expectedLineCount?: number ; 
      expectedReconstructedSampleLength?: number ; 
    },
  ]): void ;
} = (
  (s, {
    expectedLineCount = false as const ,
    expectedReconstructedSampleLength = false as const ,
  },) => { 
    const sLbAnalInf = (
      analyseLineBreaks(s)
    ) ;
    if (typeof expectedLineCount === "number") {
      testifyActualLineCount(sLbAnalInf, expectedLineCount) ;
    }
    if (typeof expectedReconstructedSampleLength === "number") {
      testifyActualReconstructedSampleLength(sLbAnalInf, expectedReconstructedSampleLength) ;
    }
  }
) ;
const testifyActualLineCount: (
  AnlTestifyingLambdaByExpectedValue<number>
) = (sLbAnalInf, expectedLineCount) => {
  BBP.impl.Debug.ok((
    expectedLineCount === sLbAnalInf.sourceCodeLinebroken1.length
  ), (
    BBP.impl.Debug.formatErrorMesssageWithInspect(`'actuakLineCount' disagrees`, {
      expectedLineCount ,
      ...sLbAnalInf ,
    })
  ));
} ;
const testifyActualReconstructedSampleLength: (
  AnlTestifyingLambdaByExpectedValue<number>
) = (sLbAnalInf, expectedReconstructedSampleLength) => {
  const actualLSum = (
    sLbAnalInf.sourceCodeLineBreakSeq1
    .reduce<number>((cumulativeLen, { startPos: wStart, endPos: wEnd, }) => {
      const wLen = wEnd - wStart ;
      return (
        cumulativeLen + wLen
      ) ;
    } , 0 )
  ) ;
  BBP.impl.Debug.ok((
    actualLSum === expectedReconstructedSampleLength
  ), (
    BBP.impl.Debug.formatErrorMesssageWithInspect(`'actualLSum' disagrees`, {
      expectedReconstructedSampleLength ,
      actualLSum ,
      ...sLbAnalInf ,
    })
  )) ;
} ;
type AnlTestifyingLambdaByExpectedValue<V> = {
  (...args: [
    ReturnType<typeof analyseLineBreaks> ,
    V,
  ] ): void ;
} ;
import tsNodeHelpString from "_x/samples/tsNodeHelp";
const testify = (): void => {
  testifyLinebreakingCorrectness((
    "Usage: ts-node [options] [ -e script | script.ts ] [arguments]\n \nOptions"
  ), {
    expectedLineCount: 3 ,
  }) ;
  testifyLinebreakingCorrectness((
    "going\r\nto\r\nthe place"
  ), {
    expectedReconstructedSampleLength: 20,
  }) ;
} ;
BBP.impl.Debug.dispatchAsyncUnitTestCallback((): void => (
  testify()
)) ;







