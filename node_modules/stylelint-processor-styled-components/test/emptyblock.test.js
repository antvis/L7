const stylelint = require('stylelint')
const path = require('path')

const processor = path.join(__dirname, '../src/index.js')
const rules = {
  'block-no-empty': true
}
const code = `import styled from 'styled-components';
const DangerButton = styled(Button)\`\`;
`

describe('empty block', () => {
  let data

  beforeAll(done => {
    stylelint
      .lint({
        code,
        config: {
          processors: [processor],
          rules
        }
      })
      .then(result => {
        data = result
        done()
      })
      .catch(err => {
        data = err
        done()
      })
  })

  it('should have one result', () => {
    expect(data.results.length).toEqual(1)
  })

  it('should not have errored', () => {
    expect(data.errored).toEqual(false)
  })

  it('should not have any warnings', () => {
    expect(data.results[0].warnings.length).toEqual(0)
  })
})
