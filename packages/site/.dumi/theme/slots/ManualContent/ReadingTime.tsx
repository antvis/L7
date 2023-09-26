import React from 'react';
import { Tag } from 'antd';
import { FormattedMessage } from 'dumi';

const ReadingTime: React.FC<any> = ({ readingTime }) => {
  return (
    <Tag>
      <FormattedMessage id="阅读时间约" /> { Math.ceil(readingTime / 60000) }  <FormattedMessage id="分钟" />
    </Tag>
  );
};

export default ReadingTime;
