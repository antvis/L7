exports.isCausedBySubstitution = (warning, line, interpolationLines) =>
  interpolationLines.some(({ start, end }) => {
    if (line > start && line < end) {
      // Inner interpolation lines must be
      return true
    } else if (line === start) {
      return ['value-list-max-empty-lines', 'comment-empty-line-before'].indexOf(warning.rule) >= 0
    } else if (line === end) {
      return ['comment-empty-line-before', 'indentation'].indexOf(warning.rule) >= 0
    } else {
      return false
    }
  })

exports.getCorrectColumn = (taggedTemplateLocs, line, column) => {
  let c = column

  // Not consider multiple tagged literals exsit in the same line,
  // so we only add column offset of the first one
  taggedTemplateLocs.some(loc => {
    if (line === loc.start.line) {
      // Start column contains the back quote, so we need inscrese 1
      c += loc.start.column + 1 - loc.wrappedOffset
      return true
    }
    return false
  })

  return c
}
