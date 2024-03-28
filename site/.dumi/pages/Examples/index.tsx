import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { ThemeAntVContext } from '@antv/dumi-theme-antv/dist/context';
import { Article } from '@antv/dumi-theme-antv/dist/pages/Examples/components/Article';
import { ExampleTopicMenu } from '@antv/dumi-theme-antv/dist/pages/Examples/components/ExampleTopicMenu';
import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import NavigatorBanner from '@antv/dumi-theme-antv/dist/slots/Header/Products/NavigatorBanner';
import { SEO } from '@antv/dumi-theme-antv/dist/slots/SEO';
import { usePrevAndNext } from '@antv/dumi-theme-antv/dist/slots/hooks';
import type { ExampleTopic } from '@antv/dumi-theme-antv/dist/types';
import { Layout as AntLayout, BackTop } from 'antd';
import { useLocale } from 'dumi';
import { cloneDeep, throttle } from 'lodash-es';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryPageContent } from './components/GalleryPageContent';
import SelectBar from './components/SelectExampleBar';
import styles from './index.module.less';

/**
 * Examples 页面
 *
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const Example = () => {
  const nav = useNavigate();
  const locale = useLocale();
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const exampleTopics: ExampleTopic[] = metaData.meta.exampleTopics;
  const [exampleTopicsState, setExampleTopicsState] = useState<ExampleTopic[]>(exampleTopics);
  const [prev, next] = usePrevAndNext();

  const filterExampleTopics = (filterInfo) => {
    let result = cloneDeep(exampleTopics);
    if (filterInfo.types.length !== 0) {
      result = result.filter((item) => {
        return filterInfo.types.includes(item.title.en);
      });
    }
    if (filterInfo.search !== '') {
      result = result.map((item) => {
        return {
          ...item,
          examples: item.examples
            .map((example) => {
              return {
                ...example,
                demos: example.demos.filter((demo) => {
                  const title = demo.title[locale.id] || demo.title;
                  return title.toLowerCase().includes(filterInfo.search.toLowerCase());
                }),
              };
            })
            .filter((example) => {
              return example.demos.length !== 0;
            }),
        };
      });
    }
    return result;
  };

  const onFilterChange = (search: string, types: string[]) => {
    setExampleTopicsState(
      filterExampleTopics({
        search,
        types,
      }),
    );
  };

  const title = {
    zh: '所有图表',
    en: 'Gallery',
  };
  // 为 zh 做兜底
  useEffect(() => {
    const p = window.location.pathname;
    if (p.includes('/zh/')) {
      nav(p.replace('/zh/', '/'));
    }
  }, []);
  return (
    <>
      <SEO title={title[locale.id]} />
      <Header isHomePage={false} />
      <AntLayout hasSider className={styles.layout}>
        <ExampleTopicMenu exampleTopics={exampleTopics} />
        <Article className={styles.markdown}>
          <div className={styles.main} style={{ width: '100%' }}>
            <SelectBar
              exampleTopics={exampleTopics}
              onFilterChange={throttle(onFilterChange, 200)}
            />
            <GalleryPageContent exampleTopics={exampleTopicsState} />
            <div>
              <NavigatorBanner type="prev" post={prev} />
              <NavigatorBanner type="next" post={next} />
            </div>
            <BackTop style={{ right: 32 }}>
              <div className={styles.backTop}>
                <VerticalAlignTopOutlined />
              </div>
            </BackTop>
          </div>
        </Article>
      </AntLayout>
      <Footer isDynamicFooter={true} />
    </>
  );
};

export default Example;
