import { getCategoryId } from '@antv/dumi-theme-antv/dist/pages/Examples/utils';
import { useLocale } from 'dumi';
import React from 'react';
import styles from '../../index.module.less';
import type { ExampleWithTopic, GalleryPageContentProps } from '../../types';
import { DemoCard } from './DemoCard';

/**
 * Examples 首页内容预览组件
 *
 * @param {GalleryPageContentProps} props 相关参数，详见类型定义
 * @returns {React.FC} React.FC
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
export const GalleryPageContent: React.FC<GalleryPageContentProps> = (props) => {
  const { exampleTopics } = props;
  const locale = useLocale();
  const flattenExamples = exampleTopics.reduce((prev, current) => {
    const exampleWithTopic = current.examples.map((item) => {
      return {
        ...item,
        targetTopic: current,
      };
    });

    return prev.concat(exampleWithTopic);
  }, [] as ExampleWithTopic[]);
  return (
    <div className={styles.gallery}>
      <div className={styles.galleryContent}>
        {flattenExamples.map((example, i) => {
          return (
            <div key={i}>
              <h2 id={getCategoryId(example.targetTopic.id, example.id)}>
                {example.title[locale.id]}
              </h2>
              <ul className={styles.galleryList}>
                {example.demos.map((demo) => {
                  return (
                    <li className={styles.galleryCard} key={demo.id} title={demo.title[locale.id]}>
                      <DemoCard
                        demo={demo}
                        topicId={example.targetTopic.id}
                        exampleId={example.id}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
