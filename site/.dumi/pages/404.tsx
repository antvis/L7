import SEO from '@antv/dumi-theme-antv/dist/common/SEO';
import React from 'react';
import { NotFound as NotFoundPage } from '../slots/404';
import { Footer } from '../slots/Footer';
import { Header } from '../slots/Header';

/**
 * 404 页面
 */
const NotFound = () => (
  <>
    <SEO title="404: Not found" />
    <Header isHomePage={false} />
    <NotFoundPage />
    <Footer />
  </>
);

export default NotFound;
