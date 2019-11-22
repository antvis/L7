import { useContext } from 'react';
import { getI18n, getHasUsedI18nextProvider, I18nContext } from './context';
export function useSSR(initialI18nStore, initialLanguage) {
  var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var i18nFromProps = props.i18n;
  var ReactI18nContext = useContext(I18nContext);

  var _ref = getHasUsedI18nextProvider() ? ReactI18nContext || {} : {},
      i18nFromContext = _ref.i18n;

  var i18n = i18nFromProps || i18nFromContext || getI18n(); // opt out if is a cloned instance, eg. created by i18next-express-middleware on request
  // -> do not set initial stuff on server side

  if (i18n.options && i18n.options.isClone) return; // nextjs / SSR: getting data from next.js or other ssr stack

  if (initialI18nStore && !i18n.initializedStoreOnce) {
    i18n.services.resourceStore.data = initialI18nStore;
    i18n.initializedStoreOnce = true;
  }

  if (initialLanguage && !i18n.initializedLanguageOnce) {
    i18n.changeLanguage(initialLanguage);
    i18n.initializedLanguageOnce = true;
  }
}