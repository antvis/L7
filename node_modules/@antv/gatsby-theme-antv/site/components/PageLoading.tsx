import React from 'react';
import { Icon } from 'antd';
import styles from './PageLoading.module.less';

const PageLoading = () => (
  <div className={styles.container}>
    <Icon type="loading" className={styles.loading} />
  </div>
);

export default PageLoading;
