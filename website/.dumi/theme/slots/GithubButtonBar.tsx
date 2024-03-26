import { Button } from 'antd';
import React from 'react';
import GitHubButton from 'react-github-btn';
const HeartSvg = () => (
  <img
    width={16}
    style={{ margin: '5px' }}
    src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*iDSwRorar_QAAAAAAAAAAAAADmJ7AQ/original"
    alt="react 组件库"
  />
);
const GitHubButtonBar: React.FC<any> = ({ readingTime }) => {
  return (
    <div style={{ float: 'right', display: 'flex', gap: '10px' }}>
      <GitHubButton
        href="https://github.com/antvis/L7/issues/new"
        data-icon="octicon-issue-opened"
        data-size="large"
        data-show-count="true"
        aria-label="Issue antvis/l7 on GitHub"
      >
        反馈问题
      </GitHubButton>
      <GitHubButton
        href="https://github.com/antvis/l7"
        data-icon="octicon-star"
        data-size="large"
        data-show-count="true"
        aria-label="Star antvis/l7 on GitHub"
      >
        关注项目
      </GitHubButton>
      <Button
        icon={<HeartSvg />}
        style={{ fontWeight: 600, height: '30px', padding: '1px 6px' }}
        target="blank"
        href="https://larkmap.antv.antgroup.com/components/lark-map"
      >
        React 组件库
      </Button>
    </div>
  );
};

export default GitHubButtonBar;
