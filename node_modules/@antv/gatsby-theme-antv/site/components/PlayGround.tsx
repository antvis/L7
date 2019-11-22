/* eslint no-underscore-dangle: 0 */
import React, { useRef, useEffect, useState } from 'react';
import { UnControlled as CodeMirrorEditor } from 'react-codemirror2';
import { Editor } from 'codemirror';
import { useMedia } from 'react-use';
import classNames from 'classnames';
import path from 'path';
import { Typography, Icon, Tooltip, Result } from 'antd';
import debounce from 'lodash/debounce';
import { getParameters } from 'codesandbox/lib/api/define';
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from 'react-i18next';
import { transform } from '@babel/standalone';

import SplitPane from 'react-split-pane';
import styles from './PlayGround.module.less';

const { Paragraph } = Typography;

export interface PlayGroundProps {
  source: string;
  babeledSource: string;
  absolutePath?: string;
  relativePath?: string;
  screenshot?: string;
  recommended?: boolean;
  filename: string;
  title?: string;
  location?: Location;
  playground?: {
    container?: string;
    playgroundDidMount?: string;
    playgroundWillUnmount?: string;
  };
}

const execute = debounce(
  (
    code: string,
    node: HTMLDivElement,
    exampleContainer: string | undefined,
  ) => {
    const script = document.createElement('script');
    script.innerHTML = `
      try {
        ${code}
      } catch(e) {
        if (window.__reportErrorInPlayGround) {
          window.__reportErrorInPlayGround(e);
        }
      }
    `;
    // eslint-disable-next-line no-param-reassign
    node.innerHTML = exampleContainer || '<div id="container" />';
    node!.appendChild(script);
  },
  300,
);

const PlayGround: React.FC<PlayGroundProps> = ({
  source,
  babeledSource,
  relativePath = '',
  playground = {},
  location,
}) => {
  const { t } = useTranslation();
  const fullscreenNode = useRef<HTMLDivElement>(null);
  const playgroundNode = useRef<HTMLDivElement>(null);
  const cmInstance = useRef<Editor>();
  const [isFullScreen, updateIsFullScreen] = useState(false);
  const [error, setError] = useState<Error | null>();
  const [compiledCode, updateCompiledCode] = useState(babeledSource);
  const [currentSourceCode, updateCurrentSourceCode] = useState(source);

  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__reportErrorInPlayGround = (e: Error) => {
      console.error(e); // eslint-disable-line no-console
      setError(e);
    };
  }

  const toggleFullscreen = () => {
    updateIsFullScreen(!isFullScreen);
    if (fullscreenNode.current) {
      if (!isFullScreen && !document.fullscreenElement) {
        fullscreenNode.current.requestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const executeCode = () => {
    if (!compiledCode || !playgroundNode || !playgroundNode.current) {
      return;
    }
    execute(compiledCode, playgroundNode.current, playground.container);
  };

  useEffect(() => {
    executeCode();
  }, [compiledCode, error]);

  useEffect(() => {
    if (playground.playgroundDidMount) {
      // eslint-disable-next-line no-new-func
      new Function(playground.playgroundDidMount)();
    }
    return () => {
      if (playground.playgroundWillUnmount) {
        // eslint-disable-next-line no-new-func
        new Function(playground.playgroundWillUnmount)();
      }
    };
  }, []);

  // 统一增加对 insert-css 的使用注释
  const replacedSource = source.replace(
    /^insertCss\(/gm,
    `// 我们用 insert-css 演示引入自定义样式
// 推荐将样式添加到自己的样式文件中
// 若拷贝官方代码，别忘了 npm install insert-css
insertCss(`,
  );

  const editor = (
    <CodeMirrorEditor
      value={replacedSource}
      options={{
        mode: 'jsx',
        theme: 'mdn-like',
        tabSize: 2,
        // @ts-ignore
        styleActiveLine: true, // 当前行背景高亮
        matchBrackets: true, // 括号匹配
        autoCloseBrackets: true,
        autofocus: false,
        matchTags: {
          bothTags: true,
        },
      }}
      cursor={{
        line: -1,
        ch: -1,
      }}
      onChange={(_: any, __: any, value: string) => {
        updateCurrentSourceCode(value);
        try {
          const { code } = transform(value, {
            filename: relativePath,
            presets: ['react', 'typescript', 'es2015', 'stage-3'],
            plugins: ['transform-modules-umd'],
          });
          updateCompiledCode(code);
        } catch (e) {
          console.error(e); // eslint-disable-line no-console
          setError(e);
          return;
        }
        setError(null);
      }}
      editorDidMount={instance => {
        cmInstance.current = instance;
      }}
    />
  );

  const fileExtension =
    relativePath.split('.')[relativePath.split('.').length - 1] || 'js';

  const requireMatches =
    currentSourceCode.match(/require\(['"](.*)['"]\)/g) || [];
  const importMatches = currentSourceCode.match(/from\s+['"](.*)['"]/g) || [];
  const deps: {
    [key: string]: 'latest';
  } = {};
  [...requireMatches, ...importMatches].forEach((match: string) => {
    const requireMatch = match.match(/require\(['"](.*)['"]\)/);
    if (requireMatch && requireMatch[1]) {
      deps[requireMatch[1]] = 'latest';
    }
    const importMatch = match.match(/from\s+['"](.*)['"]/);
    if (importMatch && importMatch[1]) {
      deps[importMatch[1]] = 'latest';
    }
  });

  const files = {
    'package.json': {
      content: {
        main: `index.${fileExtension}`,
        dependencies: deps,
      },
    },
    [`index.${fileExtension}`]: {
      content: currentSourceCode,
    },
    'index.html': {
      content: playground.container || '<div id="container" />',
    },
  } as {
    [key: string]: any;
  };

  const dataFileMatch = currentSourceCode.match(/fetch\('(.*)'\)/);
  if (
    dataFileMatch &&
    dataFileMatch.length > 0 &&
    !dataFileMatch[1].startsWith('http')
  ) {
    const [filename] = dataFileMatch[1].split('/').slice(-1);
    files[`index.${fileExtension}`].content = currentSourceCode.replace(
      dataFileMatch[1],
      path.join(
        location!.origin || '',
        location!.pathname || '',
        `../data/${filename}`,
      ),
    );
  }

  const isWide = useMedia('(min-width: 767.99px)', true);

  return (
    <div className={styles.playground} ref={fullscreenNode}>
      <SplitPane
        split={isWide ? 'vertical' : 'horizontal'}
        defaultSize="66%"
        minSize={100}
      >
        <div
          className={classNames(
            styles.preview,
            `playground-${relativePath.split('/').join('-')}`,
          )}
        >
          {error ? (
            <Result
              status="error"
              title={t('演示代码报错，请检查')}
              subTitle={<pre>{error && error.message}</pre>}
            />
          ) : (
            <div
              ref={playgroundNode}
              className={styles.exampleContainerWrapper}
            />
          )}
        </div>
        <div className={styles.editor}>
          <div className={styles.toolbar}>
            <Tooltip title={t('在 CodeSandbox 中打开')}>
              <form
                action="https://codesandbox.io/api/v1/sandboxes/define"
                method="POST"
                target="_blank"
              >
                <input
                  type="hidden"
                  name="parameters"
                  value={getParameters({ files })}
                />
                <button type="submit" className={styles.codesandbox}>
                  <Icon type="code-sandbox" style={{ marginLeft: 12 }} />
                </button>
              </form>
            </Tooltip>
            <Paragraph copyable={{ text: currentSourceCode }} />
            <Tooltip title={isFullScreen ? t('离开全屏') : t('进入全屏')}>
              <Icon
                type={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                onClick={toggleFullscreen}
                style={{ marginLeft: 12 }}
              />
            </Tooltip>
            <Tooltip title={t('执行代码')}>
              <Icon
                type="play-circle"
                onClick={executeCode}
                style={{ marginLeft: 12 }}
              />
            </Tooltip>
          </div>
          <div className={styles.codemirror}>{editor}</div>
        </div>
      </SplitPane>
    </div>
  );
};

class ErrorHandlerPlayGround extends React.Component<
  PlayGroundProps & WithTranslation,
  { error?: Error }
> {
  state = {
    error: undefined,
  };

  static getDerivedStateFromError(error: Error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { error };
  }

  render() {
    const { t } = this.props;
    const { error } = this.state;
    if (error) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <Result
          status="error"
          title={t('演示代码报错，请检查')}
          subTitle={<pre>{error && (error as any).message}</pre>}
        />
      );
    }
    return <PlayGround {...this.props} />;
  }
}

export default withTranslation()(ErrorHandlerPlayGround);
