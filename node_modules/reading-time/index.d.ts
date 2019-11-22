declare module 'reading-time' {
  interface IOptions {
    wordBound?: () => boolean;
    wordsPerMinute?: number;
  }

  interface IReadTimeResults {
    text: string;
    time: number;
    words: number;
    minutes: number;
  }

  function readingTime(text: string, options?: IOptions): IReadTimeResults;

  namespace readingTime {}

  export = readingTime;
}
