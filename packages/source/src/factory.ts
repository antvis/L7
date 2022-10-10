import { IParserData } from './interface';

type ParserFunction = (data: any, cfg?: any) => IParserData;
type transformFunction = (data: IParserData, cfg?: any) => IParserData;
const TRANSFORMS: {
  [type: string]: transformFunction;
} = {};
const PARSERS: {
  [type: string]: ParserFunction;
} = {};
export const getParser = (type: string) => PARSERS[type];
export const registerParser = (
  type: string,
  parserFunction: ParserFunction,
): void => {
  PARSERS[type] = parserFunction;
};
export const getTransform = (type: string) => TRANSFORMS[type];
export const registerTransform = (
  type: string,
  transFunction: transformFunction,
): void => {
  TRANSFORMS[type] = transFunction;
};
