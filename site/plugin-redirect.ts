import type { IApi } from 'umi';

export default (api: IApi) => {
  api.modifyRoutes((routes) => {
    routes['api-redirect'] = {
      id: 'api-redirect',
      path: '/api',
      absPath: '/api',
      redirect: '/api/scene',
    };
    routes['en-api-redirect'] = {
      id: 'en-api-redirect',
      path: '/en/api',
      absPath: '/en/api',
      redirect: '/en/api/scene',
    };
    return routes;
  });
};
