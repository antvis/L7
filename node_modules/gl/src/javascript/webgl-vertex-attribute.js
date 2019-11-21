const { gl } = require('./native-gl')

class WebGLVertexAttribute {
  constructor (ctx, idx) {
    this._ctx = ctx
    this._idx = idx
    this._isPointer = false
    this._pointerBuffer = null
    this._pointerOffset = 0
    this._pointerSize = 0
    this._pointerStride = 0
    this._pointerType = gl.FLOAT
    this._pointerNormal = false
    this._divisor = 0
    this._inputSize = 4
    this._inputStride = 0
    this._data = new Float32Array([0, 0, 0, 1])
  }
}

module.exports = { WebGLVertexAttribute }
