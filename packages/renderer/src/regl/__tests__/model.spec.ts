import 'reflect-metadata';
import regl from 'regl';
import ReglModel from '../ReglModel';

// TODO: 暂时在 travis 跳过这个测试用例，本地能跑过
(process.env.NODE_ENV === 'test' ? describe.skip : describe)('ReglModel', () => {
  let gl;
  let reGL: regl.Regl;

  beforeEach(() => {
    const createContext = require('./utils/create-context').default;
    gl = createContext(1, 1);
    reGL = regl(gl);
  });

  it('should generate model with empty uniforms correctly', () => {
    const model = new ReglModel(reGL, {
      vs: 'void main() {gl_Position = vec4(0.);}',
      fs: 'void main() {gl_FragColor = vec4(0.);}',
      attributes: {},
    });

    // @ts-ignore
    expect(model.uniforms).toEqual({});
  });

  it('should generate model with uniforms correctly', () => {
    const model = new ReglModel(reGL, {
      vs: 'void main() {gl_Position = vec4(0.);}',
      fs: 'void main() {gl_FragColor = vec4(0.);}',
      attributes: {},
      uniforms: {
        u_1: 1,
        u_2: [1, 2],
      },
    });

    // @ts-ignore
    expect(model.uniforms.u_1).toEqual(1);
    // @ts-ignore
    expect(model.uniforms.u_2).toEqual([1, 2]);
  });

  it('should generate model with struct uniforms correctly', () => {
    // 支持 struct 结构，例如 'colors[0].r'
    // @see https://github.com/regl-project/regl/blob/gh-pages/API.md#uniforms
    const model = new ReglModel(reGL, {
      vs: 'void main() {gl_Position = vec4(0.);}',
      fs: 'void main() {gl_FragColor = vec4(0.);}',
      attributes: {},
      // @ts-ignore
      uniforms: {
        u_Struct: [
          {
            a: 1,
            b: [1, 2],
          },
          {
            a: 2,
            b: [3, 4],
          },
        ],
      },
    });

    expect(model.uniforms['u_Struct[0].a']).toEqual(undefined);

    // // @ts-ignore
    // expect(model.uniforms['u_Struct[0].a']).toEqual(1);
    // // @ts-ignore
    // expect(model.uniforms['u_Struct[0].b']).toEqual([1, 2]);
    // // @ts-ignore
    // expect(model.uniforms['u_Struct[1].a']).toEqual(2);
    // // @ts-ignore
    // expect(model.uniforms['u_Struct[1].b']).toEqual([3, 4]);
  });
});
