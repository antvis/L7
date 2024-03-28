import { Link, useLocation } from 'dumi';
import 'dumi/theme-default/slots/Navbar/index.less';
import React, { type FC } from 'react';

const Navbar: FC<{ nav: any[] }> = (props: { nav: any[] }) => {
  const { pathname } = useLocation();
  const nav = props.nav;

  return (
    <ul className="dumi-default-navbar">
      {nav.map((item) => (
        <li key={item.link}>
          {/^(\w+:)\/\/|^(mailto|tel):/.test(item.link) ? (
            <a href={item.link} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          ) : (
            <Link
              to={item.link}
              {...(pathname.startsWith(item.activePath || item.link)
                ? { className: 'active' }
                : {})}
            >
              {item.title}
              {/* TODO: 2-level nav */}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Navbar;
