import Logo from '../Logo';
import Navbar from '../Navi';

import 'dumi/theme-default/slots/Header/index.less';

const nav = [
  // {title: '首页', order: 0, link: '../tools', activePath: '/tools'},
  {
    title: '中国地图',
    order: 1,
    link: '../custom/tools/map',
    activePath: '/custom/tools/map',
  },
  {
    title: '世界地图',
    order: 1,
    link: '../custom/tools/worldmap',
    activePath: '/custom/tools/worldmap',
  },
  {
    title: '数据 SDK',
    order: 2,
    link: '../custom/tools/sdk',
    activePath: '/custom/tools/sdk',
  },
  {
    title: '数据服务',
    order: 3,
    link: '../custom/tools/service',
    activePath: '/custom/tools/service',
  },
  // { title: '应用', order: 3, link: '../tools/app', activePath: '/tools/app' },
];

const data = {
  nav,
  url: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uQbXRLw_Q2UAAAAAAAAAAAAADmJ7AQ/original',
  to: '/custom/tools',
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
