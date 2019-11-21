import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'antd';
import styles from './Search.module.less';

function initDocSearch(docsearch: any, lang: string) {
  docsearch({
    apiKey: '194b1be7fb1254c787f4e036912af3eb',
    indexName: 'antv',
    inputSelector: `.${styles.input}`,
    algoliaOptions: { facetFilters: [`tags:${lang}`] },
    transformData(hits: Array<{ url: string }>) {
      hits.forEach(hit => {
        /* eslint-disable no-param-reassign */
        hit.url = hit.url.replace('g2.antv.vision', window.location.host);
        hit.url = hit.url.replace('g6.antv.vision', window.location.host);
        hit.url = hit.url.replace('f2.antv.vision', window.location.host);
        hit.url = hit.url.replace('l7.antv.vision', window.location.host);
        hit.url = hit.url.replace('g2plot.antv.vision', window.location.host);
        hit.url = hit.url.replace('graphin.antv.vision', window.location.host);
        hit.url = hit.url.replace('https:', window.location.protocol);
        hit.url = hit.url.replace('#gatsby-focus-wrapper', '');
        /* eslint-enable no-param-reassign */
      });
      return hits;
    },
    debug: false, // Set debug to true if you want to inspect the dropdown
  });
}

const Search = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('docsearch.js').then(({ default: docsearch }) => {
        initDocSearch(docsearch, i18n.language);
      });
    }
  }, []);
  return (
    <label className={styles.search} htmlFor="search">
      <Icon type="search" className={styles.icon} />
      <input className={styles.input} id="search" placeholder={t('搜索…')} />
    </label>
  );
};

export default Search;
