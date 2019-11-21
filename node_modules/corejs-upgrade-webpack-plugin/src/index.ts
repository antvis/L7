import { NormalModuleReplacementPlugin } from 'webpack';
import resolveFrom from 'resolve-from';

const rewriteAndPreservePrefix = (originalRequest: string, newPath: string, newModuleName = 'core-js') => {
  const result = originalRequest.match(/(.*\/)core-js\/.*/);
  const requestPrefix = result ? result[1] : '';

  return `${requestPrefix}${newModuleName}/${newPath}`;
};

const rewriteRenamedModules = (path: string) => {
  if (path === 'web.dom.iterable') {
    return path.replace('web.dom.', 'web.dom-collections.')
  }

  return path;
}

export const rewriteCoreJsRequest = (originalRequest: string, lowerVersion = false) => {
  if (!originalRequest) {
    throw new Error('no originalRequest')
  }
  if (/core-js\/modules\/es(6|7)\.(.*)/.test(originalRequest)) {
    const [,matchedVersion, matchedPath] = originalRequest.match(/core-js\/modules\/es(6|7)\.(.*)/);

    const version = matchedVersion;
    const path = rewriteRenamedModules(matchedPath);

    if (version === '6' || lowerVersion) {
      return rewriteAndPreservePrefix(originalRequest, `modules/es.${path}`);
    }
    if (version === '7') {
      return rewriteAndPreservePrefix(originalRequest, `modules/esnext.${path}`);
    }
  }

  if (/core-js(?:\/library)?\/fn\/(.*)/.test(originalRequest)) {
    const [,matchedPath] = originalRequest.match(/core-js(?:\/library)?\/fn\/(.*)/);

    const path = rewriteRenamedModules(matchedPath);

    return rewriteAndPreservePrefix(originalRequest, `features/${path}`, 'core-js-pure');
  }

  if (/core-js\/es(5|6|7)(.*)/.test(originalRequest)) {
    const [,matchedVersion, matchedPath] = originalRequest.match(/core-js\/es(5|6|7)(.*)?/);

    const version = matchedVersion;
    
    if (version === '5') {
      return null;
    }
    if (version === '6' || lowerVersion) {
      const asAModule = matchedPath.replace('.js', '');
      const path = rewriteRenamedModules(asAModule);

      return rewriteAndPreservePrefix(originalRequest, `es${path}`);
    }
    if (version === '7') {
      return null;
    }
  }

  if (/core-js\/(object)\/(.*)/.test(originalRequest)) {
    const [,matchedPath] = originalRequest.match(/core-js\/(.*)?/);

    const path = rewriteRenamedModules(matchedPath);

    return rewriteAndPreservePrefix(originalRequest, `features/${path}`);
  }

  return originalRequest;
};

export interface Options {
  resolveFrom: string | false;
}

const defaultOptions = {
  resolveFrom: false,
} as Options

export default function CoreJSUpgradeWebpackPlugin(options: Options) {
  options = Object.assign({}, defaultOptions, options || {});
  const resolve = options.resolveFrom ? resolveFrom.bind(null, options.resolveFrom) : require.resolve;
  
  return new NormalModuleReplacementPlugin(/core-js/, resource => {
    const originalRequest = (resource.userRequest || resource.request) as string;
    if (originalRequest.startsWith('./') || originalRequest.startsWith('../')) {
      return;
    }
    if (originalRequest.match(/@babel\/runtime\/core-js/)) {
      return;
    }
    
    try {
      require.resolve(originalRequest);
    } catch (originalError) {
      let error = true;

      // attempt to upgrade the path from core-js v2 to v3
      if (error) {
        try {
          // eslint-disable-next-line no-param-reassign
          resource.request = resolve(rewriteCoreJsRequest(originalRequest));
          error = false;
        } catch (e) {}
      }

      // attempt to downgrade the path from es7 to es6
      if (error) {
        try {
          // eslint-disable-next-line no-param-reassign
          resource.request = resolve(rewriteCoreJsRequest(originalRequest, true));
          error = false;
        } catch (e) {}
      }

      if (error) {
        throw originalError;
      }
    }
  });
};
