
const TRANSFORMS = {};
const PARSERS = {};
export const getParser = type => PARSERS[type];
export const registerParser = (type, parserFunction) => {
  PARSERS[type] = parserFunction;
};
export const getTransform = type => TRANSFORMS[type];
export const registerTransform = (type, transFunction) => {
  TRANSFORMS[type] = transFunction;
};
