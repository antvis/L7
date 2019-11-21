import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Product from './Product';
import { getProducts } from './getProducts';
import styles from './Product.module.less';

interface ProductsProps {
  show: boolean;
  rootDomain: string;
  language?: 'zh' | 'en';
  className?: string;
}

const Products: React.FC<ProductsProps> = ({
  show,
  rootDomain = '',
  language,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const data = getProducts({
    t,
    language: language || i18n.language,
    rootDomain,
  });
  return (
    <>
      <div
        className={classNames(styles.products, className, {
          [styles.show]: !!show,
        })}
      >
        <div className={styles.container}>
          <h3>{t('基础产品')}</h3>
          <ul>
            {data
              .filter(item => item.category === 'basic')
              .map(product => (
                <Product
                  key={product.title}
                  name={product.title}
                  slogan={product.slogan || ''}
                  description={product.description}
                  url={(product.links || [])[0].url}
                  icon={product.icon as string}
                  links={product.links}
                  language={language || i18n.language}
                />
              ))}
          </ul>
          <h3>{t('拓展产品')}</h3>
          <ul>
            {data
              .filter(item => item.category === 'extension')
              .map(product => (
                <Product
                  key={product.title}
                  name={product.title}
                  slogan={product.slogan || ''}
                  description={product.description}
                  url={(product.links || [])[0].url}
                  icon={product.icon as string}
                  links={product.links}
                  language={language || i18n.language}
                />
              ))}
          </ul>
          <h3>{t('周边生态')}</h3>
          <ul>
            {data
              .filter(item => item.category === 'ecology')
              .map(product => (
                <Product
                  key={product.title}
                  name={product.title}
                  slogan={product.slogan || ''}
                  description={product.description}
                  url={(product.links || [])[0].url}
                  icon={product.icon as string}
                  language={language || i18n.language}
                />
              ))}
          </ul>
        </div>
      </div>
      <div className={styles.mask} />
    </>
  );
};

export default Products;
