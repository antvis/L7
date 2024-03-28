import { Link } from 'dumi';
import 'dumi/theme-default/slots/Logo/index.less';
import React, { type FC } from 'react';

interface logoProps {
  url: string;
  title: string;
  to: string;
}
const Logo: FC<logoProps> = (props: logoProps) => {
  const { url, title, to } = props;
  return (
    <Link className="dumi-default-logo" to={to}>
      <img src={url} alt={title} />

      {title}
    </Link>
  );
};

export default Logo;
