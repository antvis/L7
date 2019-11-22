import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import source from '../common.json';

const i18n = i18next.createInstance();
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    initImmediate: false,
    resources: {
      en: {
        translation: { ...source },
      },
    },
    fallbackLng: 'zh',
    keySeparator: false,
    react: {
      useSuspense: false,
    },
  });

export default function withProvider<T>(
  Element: React.ComponentType<T>,
): React.ComponentType<T> {
  return function withProviderInner(props) {
    return (
      <I18nextProvider i18n={i18n}>
        <Element {...props} />
      </I18nextProvider>
    );
  };
}
