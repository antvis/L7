import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import 'dumi/theme-default/slots/Features/index.less';
import React from 'react';
import MapHeader from '../../../../maptools/component/Header';
import IFrame from '../../../../maptools/component/IFrame';
const Playground: React.FC = () => {
  return (
    <>
      <Header />
      <MapHeader />
      <IFrame url="../docs/sdk" />
      <Footer />
    </>
  );
};

export default Playground;
