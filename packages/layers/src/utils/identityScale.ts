export default function identity(d: any) {
  let unknown: any;
  let domain: any = [];

  function scale(x: any) {
    return x == null ? unknown : x;
  }

  scale.invert = scale;

  scale.domain = scale.range = (v?: any) => {
    if (v) {
      domain = v;
      return v;
    }

    return domain;
  };

  scale.unknown = (v: any) => {
    if (v) {
      unknown = v;
      return v;
    }

    return unknown;
  };

  scale.copy = () => {
    return identity(d).unknown(unknown);
  };

  return scale;
}
