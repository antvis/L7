import React from 'react';
import classNames from 'classnames';
import { history, FormattedMessage } from 'dumi';
import styles from './NavigatorBanner.module.less';
import { useScrollToTop } from '../hooks';

export interface NavigatorBannerProps {
  post?: {
    slug?: string;
    title?: string;
  } | undefined;
  type: 'prev' | 'next';
}

export const NavigatorBanner: React.FC<NavigatorBannerProps> = ({ post, type }) => {
  if (!post) {
    return <div className={classNames(styles.button, styles.hidden)} />;
  }
  const { slug, title } = post;
  if (!slug || !title) {
    return null;
  }

  function go() {
    history.push(slug as string)
    useScrollToTop()
  }

 
  return (
    <div className={classNames(styles.button, styles[type])} onClick={go}>
      <div className={styles.label}>
        <FormattedMessage id={type === 'prev' ? '上一篇' : '下一篇'} />
      </div>
      <div className={styles.title}>{title}</div>
   </div>
  );
};

