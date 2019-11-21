import React from 'react';
import { Layout } from 'antd';
import styles from './Article.module.less';

const Article: React.FC<any> = props => (
  <Layout.Content className={styles.article}>
    <article {...props} />
  </Layout.Content>
);

export default Article;
