export function formatUniformsOption2Std140(uniformsOption: { [key: string]: any }) {
  let std140_str = '';
  Object.keys(uniformsOption).forEach((key) => {
    const value = uniformsOption[key];
    if (Array.isArray(value)) {
      std140_str += `vec${value.length} ${key};\n`;
    } else {
      std140_str += `flot ${key};\n`;
    }
  });
  return std140_str;
}

export function MultipleOfFourNumber(num: number) {
  return Math.max(Math.ceil(num / 4) * 4, 4);
}
