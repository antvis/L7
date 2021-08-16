import regl from 'l7regl';
import 'reflect-metadata';
import ReglFramebuffer from '../ReglFramebuffer';
import ReglModel from '../ReglModel';
import ReglTexture2D from '../ReglTexture2D';
import createContext from './utils/create-context';

describe('uniforms in ReglModel', () => {
  let gl;
  let reGL: regl.Regl;

  beforeEach(() => {
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
        u_3: false,
        u_4: new Float32Array([1, 2, 3]),
      },
    });

    // @ts-ignore
    expect(model.uniforms.u_1).toEqual(1);
    // @ts-ignore
    expect(model.uniforms.u_2).toEqual([1, 2]);
    // @ts-ignore
    expect(model.uniforms.u_3).toEqual(false);
    // @ts-ignore
    expect(model.uniforms.u_4).toEqual(new Float32Array([1, 2, 3]));
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
        // @ts-ignore
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

    // @ts-ignore
    expect(model.uniforms['u_Struct[0].a']).toEqual(1);
    // @ts-ignore
    expect(model.uniforms['u_Struct[0].b']).toEqual([1, 2]);
    // @ts-ignore
    expect(model.uniforms['u_Struct[1].a']).toEqual(2);
    // @ts-ignore
    expect(model.uniforms['u_Struct[1].b']).toEqual([3, 4]);

    // 测试结构体嵌套的场景
    const model2 = new ReglModel(reGL, {
      vs: 'void main() {gl_Position = vec4(0.);}',
      fs: 'void main() {gl_FragColor = vec4(0.);}',
      attributes: {},
      // @ts-ignore
      uniforms: {
        // @ts-ignore
        u_Struct: {
          a: 1,
          b: [1, 2],
          c: {
            d: 2,
            e: [3, 4],
          },
          f: false,
          g: [
            {
              h: 3,
              i: [
                {
                  j: 4,
                },
              ],
            },
          ],
          k: new ReglTexture2D(reGL, {
            width: 1,
            height: 1,
          }),
          l: new ReglFramebuffer(reGL, {
            width: 1,
            height: 1,
          }),
          m: null,
        },
      },
    });

    // @ts-ignore
    expect(model2.uniforms['u_Struct.a']).toEqual(1);
    // @ts-ignore
    expect(model2.uniforms['u_Struct.b']).toEqual([1, 2]);
    // @ts-ignore
    expect(model2.uniforms['u_Struct.c.d']).toEqual(2);
    // @ts-ignore
    expect(model2.uniforms['u_Struct.c.e']).toEqual([3, 4]);
    // @ts-ignore
    expect(model2.uniforms['u_Struct.f']).toEqual(false);
    // @ts-ignore
    expect(model2.uniforms['u_Struct.g[0].h']).toEqual(3);
    // @ts-ignore
    expect(model2.uniforms['u_Struct.g[0].i[0].j']).toEqual(4);
    // @ts-ignore
    expect(model2.uniforms['u_Struct.k'] instanceof ReglTexture2D).toBeTruthy();
    // @ts-ignore
    expect(
      // @ts-ignore
      model2.uniforms['u_Struct.l'] instanceof ReglFramebuffer,
    ).toBeTruthy();
    // @ts-ignore
    expect(model2.uniforms['u_Struct.m']).toBeNull();
  });

  it('should update uniforms correctly', () => {
    const model = new ReglModel(reGL, {
      vs: 'void main() {gl_Position = vec4(0.);}',
      fs: 'void main() {gl_FragColor = vec4(0.);}',
      attributes: {},
      // @ts-ignore
      uniforms: {
        u_1: 1,
        u_2: [1, 2],
        u_3: false,
        u_4: {
          a: 1,
          b: 2,
        },
        // @ts-ignore
        u_5: [
          {
            c: 1,
          },
          {
            c: 2,
          },
          {
            c: 3,
          },
        ],
      },
    });

    model.addUniforms({
      u_1: 2,
      u_2: [3, 4],
      u_3: true,
      u_4: {
        a: 2,
      },
      // @ts-ignore
      u_5: [
        // @ts-ignore
        {
          c: 100, // 只修改第一个
        },
      ],
      'u_5[2].c': 200, // 直接修改结构体属性
    });

    // @ts-ignore
    expect(model.uniforms.u_1).toEqual(2);
    // @ts-ignore
    expect(model.uniforms.u_2).toEqual([3, 4]);
    // @ts-ignore
    expect(model.uniforms.u_3).toBeTruthy();
    // @ts-ignore
    expect(model.uniforms['u_4.a']).toEqual(2);
    // @ts-ignore
    expect(model.uniforms['u_4.b']).toEqual(2);
    // @ts-ignore
    expect(model.uniforms['u_5[0].c']).toEqual(100);
    // @ts-ignore
    expect(model.uniforms['u_5[1].c']).toEqual(2);
    // @ts-ignore
    expect(model.uniforms['u_5[2].c']).toEqual(200);
  });
});
