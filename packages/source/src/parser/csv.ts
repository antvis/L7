import { csvParse } from 'd3-dsv';
import { IJsonData, IParserCfg, IParserData } from '@l7/core';
import json from './json';
export default function csv(data: string, cfg: IParserCfg): IParserData {
  const csvData: IJsonData = csvParse(data);
  return json(csvData, cfg);
}
