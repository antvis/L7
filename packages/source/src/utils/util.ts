interface IDataItem {
  [key: string]: any;
}
export function getColumn(data: IDataItem[], columnName: string) {
  return data.map((item: IDataItem) => {
    return item[columnName] * 1;
  });
}
