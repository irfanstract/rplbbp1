
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

;

/** 
 * split the sample into lines, and
 * analyse, 
 * - for every line, the start-and-end pos info(s)
 * - each the actual linebreak char-seqs (eg to check whether CRLF or merely LF)
 * - function to map `pos` to `line:col`
 */
export const analyseLineBreaks = (
  ((...[sourceCode]: [sample: string]) => {
    ;
    /** 
     * all the linebreaking char-seqs
     */
    const sourceCodeLineBrks = (
      (
        sourceCode
        .match(LINEBREAK )
        || []
      ) /* guarantee implements `string[]` */ satisfies (string[] | [])
    ) ;
    /** 
     * {@link sourceCode} split by pattern denoted by RegExp {@link LINEBREAK}
     */
    const sourceCodeLinebroken = (
      sourceCode
      .split(LINEBREAK)
    ) ;
    /** 
     * {@link sourceCodeLineBreakSeq1} minus the `pos` info(s)
     */
    const sourceCodeLineBreakSeq10 = (
      Array.from({
        *[Symbol.iterator](): (
          Generator<(
            | { 
              type: ("line"       ) ; 
              value: (string  ) ; 
              /** "the line number", starting from `1` */
              name: number ; 
            }
            | { 
              type: ("linebreak"  ) ; 
              value: (string  ) ; 
            }
          )>
        ) {
          for (let i=0; i<sourceCodeLinebroken.length; ++i) {
            yield {
              type: "line" ,
              value: sourceCodeLinebroken[i] ?? BBP.Debug.fail() ,
              name: i + 1 ,
            } ;
            if (i < sourceCodeLineBrks.length) {
              yield {
                type: "linebreak" ,
                value: sourceCodeLineBrks[i] ?? BBP.Debug.fail() ,
              } ;
            }
          }
        } ,
      })
    ) ;
    /** 
     * lists all the lines and linebreaks in order, 
     * each with info `value` and `startPos` and `endPos`.
     */
    const sourceCodeLineBreakSeq1 = (
      BBP.impl.Immutable.Seq(sourceCodeLineBreakSeq10)
      .reduce<{
        main: (
          (
            & ((typeof sourceCodeLineBreakSeq10)[number] & {})
            & {
              startPos: number ;
              endPos: number ;
            }
          )[]
        ) ,
        options: { 
          cumulativeEndPos: number ;
        } ,
      }>((prevState, item ) => {
        const itemStartPos = prevState.options.cumulativeEndPos ;
        const itemEndPos   = prevState.options.cumulativeEndPos + item.value.length ;
        return {
          main: [
            ...(prevState.main satisfies object[]) ,
            {
              ...item ,
              startPos: itemStartPos ,
              endPos: itemEndPos ,
            } ,
          ] ,
          options: {
            cumulativeEndPos: itemEndPos ,
          } ,
        } ;
      }, {
        main: [] ,
        options: { cumulativeEndPos: 0 , } ,
      } ).main
    ) ;
    /** 
     * {@link sourceCodeLineBreakSeq1} filtered by `type === "line"`
     * with line-number info (as `name`)
     */
    const sourceCodeLinebroken1 = (
      sourceCodeLineBreakSeq1
      .flatMap((item) => ((
        (item.type === "line") ? [{ ...item }] : []
      ) satisfies ([] | [object])) )
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
        }) satisfies { (): [] | [{}] ; } )())
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







