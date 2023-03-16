import React from 'react';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import MapHeader from '../../../maptools/component/Header';
import Hero from '../../../maptools/component/Hero';
import Features  from '../../../maptools/component/Features';
import DataTab from '../../../maptools/component/DataTab';
import  WhoAreUsing from '../../../maptools/component/WhoAreUsing';


const Playground: React.FC = () => {
  return (
    <>
      <Header />
      <MapHeader />
      <Hero />
      <Features/>
      <DataTab/>
      <WhoAreUsing/>
      <Footer />
    </>
  );
};

export default Playground;