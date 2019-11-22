/* global describe, test, expect, afterEach */

const Module = require('./index')

describe('dotenv-defaults', () => {
  describe('root', () => {
    test('should exist', () => {
      expect(Module).toBeDefined()
    })
  })

  describe('config', () => {
    afterEach(() => {
      delete process.env.TEST
      delete process.env.TEST2
    })

    test('should be a function', () => {
      expect(typeof Module.config).toEqual('function')
    })

    test('should by default write to process.env', () => {
      expect(Module.config()).toEqual({
        parsed: {
          TEST: 'hello',
          TEST2: 'whatever'
        }
      })
    })

    test('should support alternative defaults', () => {
      expect(Module.config({
        defaults: '.env.defaults2'
      })).toEqual({
        parsed: {
          TEST: 'hello',
          TEST2: 'whatever2'
        }
      })
    })
  })

  describe('parse', () => {
    test('should exist', () => {
      expect(Module.parse).toBeDefined()
    })

    test('should be a function', () => {
      expect(typeof Module.parse).toEqual('function')
    })

    test('should read variables', () => {
      expect(Module.parse(`TEST=hello`)).toEqual({ TEST: 'hello' })
    })

    test('should include defaults', () => {
      const src = `TEST=hello`
      const defaults = `TEST2=goodbye`
      expect(Module.parse(src, defaults)).toEqual({
        TEST: 'hello',
        TEST2: 'goodbye'
      })
    })

    test('should not override defaults', () => {
      const src = `TEST=hello`
      const defaults = `TEST=goodbye`
      expect(Module.parse(src, defaults)).toEqual({ TEST: 'hello' })
    })
  })
})
