import React from 'react';
import { Link } from 'gatsby';
import classNames from 'classnames';
import shallowequal from 'shallowequal';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.less';

const getDocument = (navs: Nav[], slug = '') =>
  navs.find(doc => doc.slug === slug) || {
    title: {} as { [key: string]: string },
  };

export interface Nav {
  slug: string;
  order: number;
  title: {
    [key: string]: string;
  };
  target?: '_blank';
}

interface NavMenuItemsProps {
  navs: Nav[];
  path: string;
}

const NavMenuItems: React.FC<NavMenuItemsProps> = ({ navs = [], path }) => {
  const { i18n } = useTranslation();
  return (
    <>
      {navs.map((nav: Nav, i) => {
        const href = `/${i18n.language}/${nav.slug}`;
        const className = classNames('header-menu-item-active', {
          [styles.activeItem]:
            path.startsWith(href) ||
            shallowequal(
              path.split('/').slice(0, 4),
              href.split('/').slice(0, 4),
            ),
        });
        return (
          <li key={i} className={className}>
            {nav.target === '_blank' ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {getDocument(navs, nav.slug).title[i18n.language]}
              </a>
            ) : (
              <Link to={href}>
                {getDocument(navs, nav.slug).title[i18n.language]}
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
};

export default NavMenuItems;
