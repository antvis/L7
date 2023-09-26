import { PlayCircleOutlined, PushpinOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './Preview.module.less';
import { safeEval } from './utils';

type ClearableDOM = (HTMLElement | SVGElement) & { clear?: any };

function normalizeValue(node) {
  return node instanceof Promise ? node : Promise.resolve(node);
}

function normalizeDOM(node): ClearableDOM {
  if (node instanceof HTMLElement || node instanceof SVGElement) return node;
  const span = document.createElement('span');
  span.textContent = node.toString();
  return span;
}

function sizeOf(dom) {
  if (dom.style.display === 'none') return { width: 0, height: 0 };
  const parseInt10 = (d: string) => (d ? parseInt(d) : 0);
  const style = getComputedStyle(dom);
  const wrapperWidth = dom.clientWidth || parseInt10(style.width);
  const wrapperHeight = dom.clientHeight || parseInt10(style.height);
  return {
    width: wrapperWidth,
    height: wrapperHeight,
  };
}

export type PreviewProps = {
  source: string;
  pin: boolean;
  code: HTMLDivElement;
};

export const Preview: FC<any> = ({ source, code, pin = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const nodeRef = useRef<ClearableDOM>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>(null);
  const [node, setNode] = useState<ClearableDOM>(null);

  async function execute(source) {
    setError(null);
    try {
      const value = safeEval(source);
      if (value instanceof Promise) setLoading(true);
      const rendered = normalizeValue(value);
      const n = await rendered;
      const node = normalizeDOM(n);
      setNode(node);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error(error);
    }
  }

  function onPin() {
    if (code.style.display === 'block' || code.style.display === '') {
      code.style.display = 'none';
    } else {
      code.style.display = 'block';
    }
    updateToolHeight();
  }

  function onRun() {
    execute(source);
  }

  function updateToolHeight() {
    const { height: codeHeight } = sizeOf(code);
    const { height: nodeHeight } = sizeOf(containerRef.current);
    const height = codeHeight + nodeHeight;
    ulRef.current.style.height = height + 'px';
  }

  // 执行代码
  useEffect(() => {
    execute(source);
  }, [source]);

  // 更新 node
  useEffect(() => {
    if (containerRef.current && node) {
      nodeRef.current?.clear?.();
      nodeRef.current = node;
      const oldChild = containerRef.current.children[0];
      if (oldChild) {
        oldChild.replaceWith(node);
      } else {
        containerRef.current.appendChild(node);
      }
      updateToolHeight();
    }
  }, [node]);

  // 销毁的时候调用 DOM 上的 clear 函数
  useEffect(() => {
    return () => nodeRef.current?.clear?.();
  });

  // 是否需要隐藏代码
  useEffect(() => {
    if (pin !== false) return;
    code.style.display = 'none';
  }, [pin]);

  // 暂时和隐藏 toolbar
  useEffect(() => {
    const enter = () => {
      if (ulRef.current) {
        ulRef.current.style.display = 'block';
        code.style.borderBottomLeftRadius = '0px';
        code.style.borderTopLeftRadius = '0px';
        updateToolHeight();
      }
    };
    const leave = () => {
      if (ulRef.current) {
        ulRef.current.style.display = '';
        code.style.borderBottomLeftRadius = '';
        code.style.borderTopLeftRadius = '';
      }
    };
    code.addEventListener('mouseenter', enter);
    code.addEventListener('mouseleave', leave);
    if (containerRef.current) {
      containerRef.current.addEventListener('mouseenter', enter);
      containerRef.current.addEventListener('mouseleave', leave);
    }
    return () => {
      code.removeEventListener('mouseenter', enter);
      code.removeEventListener('mouseleave', leave);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', enter);
        containerRef.current.removeEventListener('mouseleave', leave);
      }
    };
  }, []);

  return (
    <div className={styles.preview}>
      {loading ? (
        <div className={styles.loading}>running...</div>
      ) : (
        <>
          <div ref={containerRef} className={styles.main}>
            {error && <span className={styles.error}>{error.toString()}</span>}
          </div>
          <ul className={styles.ul} ref={ulRef}>
            <li onClick={onPin} className={styles.li}>
              <PushpinOutlined />
            </li>
            <li onClick={onRun} className={styles.li}>
              <PlayCircleOutlined />
            </li>
          </ul>
        </>
      )}
    </div>
  );
};
