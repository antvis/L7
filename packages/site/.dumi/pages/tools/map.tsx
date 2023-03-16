import React from 'react';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import Map from '../../../maptools/demo';
import MapHeader from '../../../maptools/component/Header';

const Playground: React.FC = () => {
  return (
    <>
      <Header />
      <MapHeader />
      <Map/>
      <Footer />
    </>
  );
};

export default Playground;