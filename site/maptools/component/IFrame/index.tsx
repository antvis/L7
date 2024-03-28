import 'dumi/theme-default/slots/Navbar/index.less';
import React, { type FC } from 'react';

function update(iframe) {
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  // 在iphone、ipad等移动浏览器中，为iframe设置width和height样式起不了作用
  // iframe的高宽由其内容决定，故设置iframe中body的宽度来限制iframe高宽
  doc.body.style.width = +'px';
  doc.body.style.padding = '0';
  doc.body.style.margin = '0';
  doc.body.style.border = 'none';

  // 自适应iframe高度，确保没有纵向滚动条
  // iphone、ipad等移动浏览会器忽略width/height自适应高度
  // NOTE: 没有支持Quirks mode

  // 确保scrollHeight是iframe所需的最小高度
  iframe.style.height = 'calc(100vh - 220px)';
  iframe.style.height =
    Math.max(
      // 其他浏览器
      doc.body.scrollHeight,
      // IE7
      doc.documentElement.scrollHeight,
    ) + 'px';
}

const IFrame: FC<{ url: string }> = (props: { url: string }) => {
  function onLoad() {
    const iframe = document.getElementById('iframe');
    // @ts-ignore
    const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
    if (doc.readyState === 'complete') {
      update(iframe);
    }
    update(iframe);
  }

  return (
    <div
      style={{
        marginTop: '40px',
      }}
      className="dumi-default-features"
    >
      <iframe
        onLoad={onLoad}
        id="iframe"
        src={props.url}
        width={'100%'}
        height={'100%'}
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default IFrame;
