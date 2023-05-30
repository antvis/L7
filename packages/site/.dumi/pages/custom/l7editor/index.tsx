import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import { useSize } from 'ahooks';
import React, { useRef } from 'react';

const L7Editor: React.FC = () => {
  const bodyRef = useRef(document.body);
  const { height: pageHeight = 0 } = useSize(bodyRef) ?? {};
  const header = document.querySelector('head');

  return (
    <div style={{ height: '100vh' }}>
      <Header />
      <iframe
        src="https://l7editor.antv.antgroup.com/"
        height={pageHeight - (header?.clientHeight ?? 0)}
        width="100%"
      />
      <Footer />
    </div>
  );
};

export default L7Editor;
