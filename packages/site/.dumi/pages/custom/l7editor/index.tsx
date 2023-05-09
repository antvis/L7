import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import React from 'react';
const L7Editor: React.FC = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Header />
      <iframe
        src="https://l7editor.antv.antgroup.com/"
        height="650"
        width="100%"
      />
      <Footer />
    </div>
  );
};

export default L7Editor;
