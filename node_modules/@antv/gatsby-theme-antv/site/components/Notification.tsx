import React from 'react';
import { Link } from 'gatsby';
import styles from './Notification.module.less';

export interface NotificationProps {
  index?: number;
  type: string;
  title: string;
  date: string;
  link: string;
}

const numberImages = [
  'https://gw.alipayobjects.com/zos/antfincdn/IqREAm36K7/1.png',
  'https://gw.alipayobjects.com/zos/antfincdn/3fG1Iqjfnz/2.png',
];

const Notification: React.FC<NotificationProps> = ({
  index = 0,
  type,
  title,
  date,
  link = '',
}) => {
  const children = (
    <div className={styles.container}>
      <img
        className={styles.number}
        src={numberImages[index]}
        alt={index.toString()}
      />
      <div className={styles.content}>
        <p className={styles.description}>
          {type} ‧ {title}
        </p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
  if (link.startsWith('http')) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.notification}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={link} className={styles.notification}>
      {children}
    </Link>
  );
};

export default Notification;
