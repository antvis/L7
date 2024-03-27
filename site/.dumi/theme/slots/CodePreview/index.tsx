import { Result } from 'antd';
import { FormattedMessage } from 'dumi';
import React from 'react';

import styles from './index.module.less';

export type CodePreviewProps = {
  /**
   * 在文档中预览
   */
  isPlayground: boolean;
  /**
   * id
   */
  exampleId: string;
  /**
   * 预览页面头部组件，用于显示 demo 名称，一些操作栏等
   */
  header?: React.ReactElement;
  /**
   * 需要展示的错误信息
   */
  error: any;
};

function getErrorMessage(e): string {
  return (e.reason ? e.reason : e.message ? e.message : e).toString();
}

/**
 * DEMO 预览页面的预览，主要包含有：
 * 1. 一些 header 菜单
 * 2. 错误预览
 */
export const CodePreview: React.FC<CodePreviewProps> = ({
  isPlayground,
  exampleId,
  header,
  error,
}) => {
  return (
    <div className={styles.preview}>
      {isPlayground ? null : <div className={styles.header}>{header}</div>}
      <div className={styles.content}>
        <div
          id={`playgroundScriptContainer_${exampleId}`}
          className={styles.playgroundScriptContainer}
        >
          {/** 这里是 DEMO 运行需要的 dom 容器  */}
          {/** 这里是 script 标签运行的环境  */}
        </div>
        {error ? (
          <Result
            className={styles.result}
            status="error"
            title={<FormattedMessage id="演示代码报错，请检查" />}
            subTitle={<pre>{getErrorMessage(error)}</pre>}
          />
        ) : null}
      </div>
    </div>
  );
};
