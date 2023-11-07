



const load = (options: any) => {
  const { tk = 'b15e548080c79819617367d3f6095c69' } = options;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${tk}`;
    const parentNode = document.body || document.head;
    parentNode.appendChild(script);
  });
};

const reset = () => {
  // @ts-ignore
};

export default { load, reset };
