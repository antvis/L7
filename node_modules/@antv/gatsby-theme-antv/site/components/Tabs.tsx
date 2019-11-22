import React from 'react';
import classNames from 'classnames';
import { Link } from 'gatsby';
import { useTranslation } from 'react-i18next';
import styles from './Tabs.module.less';

const Tabs: React.FC<{
  active: 'examples' | 'API' | 'design';
  slug: string;
  showTabs: {
    examples?: boolean;
    API?: boolean;
    design?: boolean;
  };
}> = ({ active, slug, showTabs = {} }) => {
  const { t } = useTranslation();
  if (showTabs.API === false && showTabs.design === false) {
    return <h3 className={styles.title}>{t('演示')}</h3>;
  }
  return (
    <ul className={styles.tabs}>
      <li
        className={classNames({
          [styles.active]: active === 'examples',
          [styles.hidden]: showTabs.examples === false,
        })}
      >
        <Link to={slug}>{t('代码演示')}</Link>
      </li>
      <li
        className={classNames({
          [styles.active]: active === 'API',
          [styles.hidden]: showTabs.API === false,
        })}
      >
        <Link to={`${slug}/API`}>API</Link>
      </li>
      <li
        className={classNames({
          [styles.active]: active === 'design',
          [styles.hidden]: showTabs.design === false,
        })}
      >
        <Link to={`${slug}/design`}>{t('设计指引')}</Link>
      </li>
    </ul>
  );
};

export default Tabs;
