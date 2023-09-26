import React from 'react';
import { useLocale } from 'dumi';
import { ExampleWithTopic, GalleryPageContentProps } from '../../types';
import { DemoCard } from './DemoCard';
import { getCategoryId } from '@antv/dumi-theme-antv/dist/pages/Examples/utils';
import styles from '../../index.module.less';

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

  // TODO: 公告功能待后续补充
  // /** 获取上新的 demo. 直接用英文 title 作为 id */
  // const demosOnTheNew = useMemo((): Array<NewDemo> => {
  //   const result: NewDemo[] = [];
  //   each(allDemosInCategory, (categoryDemos, category) => {
  //     const newDemos = filter(categoryDemos, (d) => d.new);
  //     // 大于4个新增 demo 或全部新增，则直接使用 category 作为代替
  //     if (
  //       size(newDemos) > 6 ||
  //       (size(newDemos) && size(newDemos) === size(categoryDemos))
  //     ) {
  //       result.push({
  //         title: category,
  //         id: getDemoCategory(newDemos[0], 'en'),
  //         category,
  //       });
  //     } else {
  //       each(newDemos, (demo) =>
  //         result.push({
  //           title: demo.title[locale.id],
  //           id: demo.title.en,
  //           category: getDemoCategory(demo),
  //         }),
  //       );
  //     }
  //   });
  //   return result;
  // }, [allDemosInCategory, allDemos, locale.id]);


  const flattenExamples = exampleTopics.reduce((prev, current) => {
    const exampleWithTopic = current.examples.map(item => {
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
              <h2 id={getCategoryId(example.targetTopic.id, example.id)}>{example.title[locale.id]}</h2>
              <ul className={styles.galleryList}>
                {example.demos.map((demo) => {
                  return (
                    <li
                      className={styles.galleryCard}
                      key={demo.id}
                      title={demo.title[locale.id]}>
                      <DemoCard demo={demo} topicId={example.targetTopic.id} exampleId={example.id} />
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
