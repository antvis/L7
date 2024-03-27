import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import React from 'react';
import MapHeader from '../../../../maptools/component/Header';
import Map from '../../../../maptools/demo';

const Playground: React.FC = () => {
  return (
    <>
      <Header />
      <MapHeader />
      <Map />
      <Footer />
    </>
  );
};

export default Playground;
