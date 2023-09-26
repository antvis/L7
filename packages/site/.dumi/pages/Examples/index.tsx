import React from 'react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackTop, Layout as AntLayout } from 'antd';
import { useLocale } from 'dumi';
import { SEO } from '@antv/dumi-theme-antv/dist/slots/SEO';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import NavigatorBanner from '@antv/dumi-theme-antv/dist/slots/Header/Products/NavigatorBanner';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { Article } from '@antv/dumi-theme-antv/dist/pages/Examples/components/Article';
import { ExampleTopicMenu } from '@antv/dumi-theme-antv/dist/pages/Examples/components/ExampleTopicMenu';
import { GalleryPageContent } from './components/GalleryPageContent';
import { usePrevAndNext } from '@antv/dumi-theme-antv/dist/slots/hooks';
import { ThemeAntVContext } from '@antv/dumi-theme-antv/dist/context';
import { ExampleTopic } from '@antv/dumi-theme-antv/dist/types';
import styles from './index.module.less';


/**
 * Examples 页面
 *
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const Example = () => {
  const nav = useNavigate()
  const locale = useLocale()
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const exampleTopics: ExampleTopic[] = metaData.meta.exampleTopics;
  const [prev, next] = usePrevAndNext();

  const title = {
    zh: '所有图表',
    en: "Gallery"

  }
  // 为 zh 做兜底
  useEffect(() => {
    const p = window.location.pathname
    if (p.includes('/zh/')) {
      nav(p.replace('/zh/','/'))
  }
  },[])
  return (
    <>
      <SEO title={title[locale.id]} />
      <Header isHomePage={false} />
      <AntLayout
        hasSider
        className={styles.layout}>
        <ExampleTopicMenu exampleTopics={exampleTopics} />
        <Article className={styles.markdown}>
          <div className={styles.main} style={{ width: '100%' }}>
            <GalleryPageContent exampleTopics={exampleTopics} />
            <div>
              <NavigatorBanner type='prev' post={prev} />
              <NavigatorBanner type='next' post={next} />
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
