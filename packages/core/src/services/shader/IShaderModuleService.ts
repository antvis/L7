import type { IUniform } from '../renderer/IUniform';

export type ShaderInjectType =
  | 'vs:#decl'
  | 'vs:#main-start'
  | 'vs:#main-end'
  | 'fs:#decl'
  | 'fs:#main-start'
  | 'fs:#main-end';

export type ShaderInject = Partial<Record<ShaderInjectType, string>>;

export type ShaderDefine = string | number | boolean;

/**
 * 提供 ShaderModule 管理服务
 */

export interface IModuleParams {
  vs: string;
  fs: string;
  uniforms?: {
    [key: string]: IUniform;
  };
  /** Code injections */
  inject?: ShaderInject;
  /** Defines to be injected */
  defines?: Record<string, ShaderDefine>;
}

export interface IShaderModuleService {
  registerModule(moduleName: string, moduleParams: IModuleParams): void;
  getModule(moduleName: string): IModuleParams;

  /**
   * 注册 L7 内置 shader module
   */
  registerBuiltinModules(): void;
  destroy(): void;
}
