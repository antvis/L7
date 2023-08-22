import type { Cancelable, RequestParameters, ResponseCallback } from './ajax';

export type IProtocolHandler = (
  requestParameters: RequestParameters,
  callback: ResponseCallback<any>,
) => Cancelable;

export interface IConfig {
  REGISTERED_PROTOCOLS: { [x: string]: IProtocolHandler };
}

const SceneConifg: IConfig = {
  REGISTERED_PROTOCOLS: {},
};

export { SceneConifg };
