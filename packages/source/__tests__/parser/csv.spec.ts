import csv from '../../src/parser/csv';
import { csvParse } from '../../src/utils/csv';
import csvData from '../data/csv';

describe('csvParse', () => {
  it('should parse basic CSV', () => {
    const data = 'name,age\nAlice,30\nBob,25';
    const result = csvParse(data);
    expect(result.length).toEqual(2);
    expect(result[0].name).toEqual('Alice');
    expect(result[0].age).toEqual('30');
    expect(result[1].name).toEqual('Bob');
    expect(result[1].age).toEqual('25');
  });

  it('should handle quoted values', () => {
    const data = 'name,description\n"Smith, John","A, B, C"\nAlice,"Hello ""World""';
    const result = csvParse(data);
    expect(result.length).toEqual(2);
    expect(result[0].name).toEqual('Smith, John');
    expect(result[0].description).toEqual('A, B, C');
    expect(result[1].description).toEqual('Hello "World"');
  });

  it('should handle empty values', () => {
    const data = 'a,b,c\n1,,3\n,2,';
    const result = csvParse(data);
    expect(result.length).toEqual(2);
    expect(result[0].a).toEqual('1');
    expect(result[0].b).toEqual('');
    expect(result[0].c).toEqual('3');
    expect(result[1].a).toEqual('');
    expect(result[1].b).toEqual('2');
    expect(result[1].c).toEqual('');
  });

  it('should handle CRLF line endings', () => {
    const data = 'name,value\r\nAlice,1\r\nBob,2';
    const result = csvParse(data);
    expect(result.length).toEqual(2);
    expect(result[0].name).toEqual('Alice');
    expect(result[1].name).toEqual('Bob');
  });

  it('should handle extra whitespace', () => {
    const data = 'name, value\nAlice , 30 ';
    const result = csvParse(data);
    expect(result[0].name).toEqual('Alice');
    // 列名也会被 trim
    expect(result[0].value).toEqual('30');
  });

  it('should return empty array for empty input', () => {
    expect(csvParse('')).toEqual([]);
    expect(csvParse('   ')).toEqual([]);
  });

  it('should handle header only', () => {
    const data = 'a,b,c';
    const result = csvParse(data);
    expect(result.length).toEqual(0);
  });

  it('should handle rows with fewer columns than header', () => {
    const data = 'a,b,c\n1,2';
    const result = csvParse(data);
    expect(result.length).toEqual(1);
    expect(result[0].a).toEqual('1');
    expect(result[0].b).toEqual('2');
    expect(result[0].c).toEqual('');
  });
});

describe('parser.csv', () => {
  it('parser json x, y ', () => {
    const result = csv(csvData, {
      type: 'json',
      x: 'lng',
      y: 'lat',
    });
    expect(result.dataArray.length).toEqual(21);
  });
});
