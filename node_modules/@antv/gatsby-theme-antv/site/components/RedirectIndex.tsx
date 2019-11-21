import React from 'react';
import { navigate } from 'gatsby';
import { getUserLangKey } from 'ptz-i18n';
import PageLoading from './PageLoading';

class RedirectIndex extends React.PureComponent {
  constructor(args: any) {
    super(args);

    // Skip build, Browsers only
    if (typeof window !== 'undefined') {
      const langKey = getUserLangKey(['zh', 'en'], 'zh');
      // https://github.com/angeloocana/gatsby-plugin-i18n/issues/52#issuecomment-451590961
      navigate(langKey);
    }
  }

  render() {
    return <PageLoading />;
  }
}

export default RedirectIndex;
