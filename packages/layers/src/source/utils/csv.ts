/**
 * CSV 解析工具
 * 用于替代 d3-dsv 的 csvParse 函数
 */

/**
 * 解析 CSV 字符串为对象数组
 * 第一行作为列名（表头）
 * @param csvString CSV 格式字符串
 * @returns 解析后的对象数组
 */
export function csvParse(csvString: string): Record<string, string>[] {
  const lines = parseCSVLines(csvString);

  if (lines.length === 0) {
    return [];
  }

  // 第一行作为表头
  const headers = lines[0];
  const result: Record<string, string>[] = [];

  // 从第二行开始解析数据
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i];
    if (values.length === 0) {
      continue;
    }

    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = j < values.length ? values[j] : '';
      row[header] = value;
    }
    result.push(row);
  }

  return result;
}

/**
 * 解析 CSV 行，处理引号和逗号
 */
function parseCSVLines(csvString: string): string[][] {
  const result: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;
  let i = 0;

  // 处理不同的换行符
  const normalizedInput = csvString.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  while (i < normalizedInput.length) {
    const char = normalizedInput[i];
    const nextChar = normalizedInput[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // 转义的引号
          currentCell += '"';
          i += 2;
          continue;
        } else {
          // 引号结束
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentCell += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        if (currentRow.some((cell) => cell !== '')) {
          result.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
        i++;
        continue;
      } else {
        currentCell += char;
        i++;
        continue;
      }
    }
  }

  // 处理最后一行
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell !== '')) {
      result.push(currentRow);
    }
  }

  return result;
}
