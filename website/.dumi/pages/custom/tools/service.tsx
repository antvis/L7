import React from 'react';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import 'dumi/theme-default/slots/Features/index.less';
import MapHeader from '../../../../maptools/component/Header';
import IFrame from '../../../../maptools/component/IFrame';
const Playground: React.FC = () => {
  return (
    <>
      <Header />
      <MapHeader />    
      <IFrame url='../docs/service' />
      <Footer />
    </>
  );
};

export default Playground;