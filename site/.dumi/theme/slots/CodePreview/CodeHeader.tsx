import { EditOutlined } from '@ant-design/icons';
import { Divider, PageHeader, Space, Tooltip } from 'antd';
import { FormattedMessage, useSiteData } from 'dumi';
import React from 'react';
import URI from 'uri-parse';
import GithubButtonBar from '../GithubButtonBar';
import { getBaseRoute } from '../ManualContent/utils';

import styles from './CodeHeader.module.less';

export type CodeHeaderProps = {
  /**
   * 代码的标题
   */
  title: string;
  /**
   * 代码的路径
   */
  relativePath: string;
  /**
   * GitHub 的地址，用于拼接最后 GitHub 编辑地址
   */
  githubUrl: string;
};

/**
 * 组件的 header
 */
export const CodeHeader: React.FC<any> = ({ title, relativePath, githubUrl }) => {
  const { themeConfig } = useSiteData();
  const { relativePath: relative } = themeConfig;
  const baseRoute = getBaseRoute();
  const uri = new URI(location.href);
  const getGithubSourceUrl = ({
    githubUrl,
    relativePath,
    prefix,
  }: {
    githubUrl: string;
    relativePath: string;
    prefix: string;
  }): string => {
    return `${githubUrl}/edit/master/${relative}/examples/${relativePath}`;
  };

  return (
    <PageHeader
      ghost={false}
      title={title}
      // // todo 编辑地址各种各样，需要有单独的配置，暂时关闭！
      subTitle={
        <Tooltip title={<FormattedMessage id="在 GitHub 上编辑" />}>
          <a
            href={getGithubSourceUrl({ githubUrl, relativePath, prefix: 'examples' })}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.editOnGtiHubButton}
          >
            <EditOutlined />
          </a>
        </Tooltip>
      }
      extra={
        <>
          <Space split={<Divider type="vertical" />}></Space>
          <GithubButtonBar />
        </>
      }
    />
  );
};
