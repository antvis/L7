import { NotFound } from '@antv/dumi-theme-antv/dist/slots/404';
import { CodeEditor } from '@antv/dumi-theme-antv/dist/slots/CodeEditor';
import { ic } from '@antv/dumi-theme-antv/dist/slots/hooks';
import type { ExampleTopic } from '@antv/dumi-theme-antv/dist/types';
import { useLocale, useSiteData } from 'dumi';
import { noop } from 'lodash-es';
import React, { useState } from 'react';
import SplitPane from 'react-split-pane';
import { CodePreview } from '../CodePreview';
import { CodeHeader } from '../CodePreview/CodeHeader';
import { getDemoInfo } from './utils';

type CodeRunnerProps = {
  isPlayground?: boolean;
  topic: string;
  example: string;
  demo: string;
  exampleTopics: ExampleTopic[];
  size?: number;
  replaceId?: string;
  notFound?: React.Element;
};

/**
 * 代码编辑器 + 代码预览区域
 */
export const CodeRunner: React.FC<CodeRunnerProps> = ({
  exampleTopics,
  topic,
  example,
  demo,
  size,
  replaceId,
  isPlayground,
  notFound = <NotFound />,
}) => {
  const demoInfo = getDemoInfo(exampleTopics, topic, example, demo);

  // 找不到，啥也别干了，404 页面
  if (!demoInfo) return notFound;

  const { title, source, relativePath } = demoInfo;

  const { themeConfig } = useSiteData();
  const { githubUrl, playground } = themeConfig;
  const [error, setError] = useState<Error>();
  const [isFullScreen, setFullscreen] = useState<boolean>(false);
  const locale = useLocale();

  const header = <CodeHeader title={ic(title)} relativePath={relativePath} githubUrl={githubUrl} />;

  const exampleId = `${topic}_${example}_${demo}`;

  return (
    <SplitPane split="vertical" defaultSize={`${(1 - size) * 100}%`} minSize={100}>
      <CodePreview
        exampleId={exampleId}
        error={error}
        header={header}
        isPlayground={isPlayground}
      />
      <CodeEditor
        exampleId={exampleId}
        source={source}
        relativePath={relativePath}
        replaceId={replaceId}
        onError={setError}
        onFullscreen={setFullscreen}
        onDestroy={noop}
        onReady={noop}
        playground={playground}
      />
    </SplitPane>
  );
};
