import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import React from 'react';
import DataTab from '../../../maptools/component/DataTab';
import Features  from '../../../maptools/component/Features';
import MapHeader from '../../../maptools/component/Header';
import Hero from '../../../maptools/component/Hero';
import  WhoAreUsing from '../../../maptools/component/WhoAreUsing';

const Playground: React.FC = () => {
  return (
    <>
      <Header />
      <MapHeader />
      <Hero />
      <Features />
      <DataTab />
      <WhoAreUsing />
      <Footer />
    </>
  );
};

export default Playground;
