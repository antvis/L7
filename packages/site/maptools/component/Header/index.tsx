import Logo from '../Logo';
import Navbar from '../Navi';

import 'dumi/theme-default/slots/Header/index.less';

const nav = [
  // {title: '首页', order: 0, link: '../tools', activePath: '/tools'},
  {
    title: '地图下载',
    order: 1,
    link: '../tools/map',
    activePath: '/tools/map',
  },
  {
    title: '数据 SDK',
    order: 2,
    link: '../tools/sdk',
    activePath: '/tools/sdk',
  },
  {
    title: '数据服务',
    order: 3,
    link: '../tools/service',
    activePath: '/tools/service',
  },
  // { title: '应用', order: 3, link: '../tools/app', activePath: '/tools/app' },
];

const data = {
  nav,
  url: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uQbXRLw_Q2UAAAAAAAAAAAAADmJ7AQ/original',
  to: '/tools',
  title: 'GISDATA',
};

const Header = () => {
  return (
    <div className="dumi-default-header">
      <div className="dumi-default-header-content" style={{ height: '60px' }}>
        <section className="dumi-default-header-left">
          <Logo {...data} />
        </section>
        <section className="dumi-default-header-right">
          <Navbar nav={data.nav} />
        </section>
      </div>
    </div>
  );
};

export default Header;
