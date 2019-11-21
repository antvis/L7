import React from 'react';
import classNames from 'classnames';
import styles from './FeatureCard.module.less';

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <img
          className={classNames(styles.icon, 'feature-logo')}
          src={icon}
          alt="advantage"
        />
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
