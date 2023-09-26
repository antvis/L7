import { useSiteData } from 'dumi';
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  description?: string;
  lang?: string;
  meta?: any[];
  title?: string;
  titleSuffix?: string;
}

export const SEO: React.FC<SEOProps> = ({
  description,
  lang = '',
  meta = [],
  title,
  titleSuffix,
}) => {
  const { themeConfig } = useSiteData()
  const { title: defaultTitle, defaultDescription } = themeConfig

  const metaDescription = description || defaultDescription;

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={`%s | ${titleSuffix || defaultTitle}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content:
            'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `twitter:image`,
          content:
            'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        },
      ].concat(meta)}
    />
  );
};

SEO.defaultProps = {
  lang: `zh`,
  meta: [],
  description: ``,
};
