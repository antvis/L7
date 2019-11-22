import React from 'react';
import { Tag } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const ReadingTime: React.FC<any> = ({ readingTime }) => {
  const { i18n } = useTranslation();
  if (!readingTime.time) {
    return <Tag>{readingTime.text}</Tag>;
  }
  return (
    <Tag>
      {i18n.language === 'zh'
        ? moment(readingTime.time).format('阅读时间约 M 分钟')
        : readingTime.text}
    </Tag>
  );
};

export default ReadingTime;
