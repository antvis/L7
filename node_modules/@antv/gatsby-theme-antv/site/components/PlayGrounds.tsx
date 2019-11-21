import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import PlayGround, { PlayGroundProps } from './PlayGround';
import styles from './PlayGrounds.module.less';

interface PlayGroundsProps {
  examples: PlayGroundProps[];
  location: Location;
  playground?: {
    container?: string;
    playgroundDidMount?: string;
    playgroundWillUnmount?: string;
  };
}

const PlayGrounds: React.FC<PlayGroundsProps> = ({
  examples = [],
  location,
  playground,
}) => {
  const { i18n } = useTranslation();
  const defaultExample =
    examples.find(
      item => `#${item.filename.split('.')[0]}` === location.hash,
    ) || examples[0];
  const [currentExample, updateCurrentExample] = useState(defaultExample);

  const [hasHorizontalScrollbar, updateHasHorizontalScrollbar] = useState(
    false,
  );
  const [scrollPostion, updateScrollPostion] = useState('left');
  const playgroundScrollDiv = useRef<HTMLUListElement>(null);

  const calcScrollPostion = (node: HTMLElement) => {
    if (node.scrollLeft < 2) {
      updateScrollPostion('left');
    } else if (node.scrollLeft + node.clientWidth >= node.scrollWidth - 2) {
      updateScrollPostion('right');
    } else {
      updateScrollPostion('middle');
    }
  };

  const onScroll = (e: any) => {
    if (!e || !e.target) {
      return;
    }
    calcScrollPostion(e.target);
  };

  const onResize = useCallback(() => {
    if (playgroundScrollDiv && playgroundScrollDiv.current) {
      const div = playgroundScrollDiv!.current!;
      updateHasHorizontalScrollbar(div.scrollWidth > div.clientWidth);
      calcScrollPostion(div);
    }
  }, [playgroundScrollDiv]);

  useEffect(() => {
    onResize();
  }, [examples]);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.shadowWrapper, {
          [styles.leftInnerShadow]:
            (scrollPostion === 'right' || scrollPostion === 'middle') &&
            hasHorizontalScrollbar,
          [styles.rightInnerShadow]:
            (scrollPostion === 'left' || scrollPostion === 'middle') &&
            hasHorizontalScrollbar,
        })}
      >
        <ul
          className={styles.cards}
          ref={playgroundScrollDiv}
          onScroll={onScroll}
        >
          {examples.map(example => {
            const title =
              typeof example.title === 'object'
                ? example.title[i18n.language]
                : example.title;
            return (
              <Tooltip title={title || ''} key={example.relativePath}>
                <li
                  onClick={() => {
                    window.history.pushState(
                      {},
                      '',
                      `#${example.filename.split('.')[0]}`,
                    );
                    updateCurrentExample(example);
                  }}
                  className={classNames(styles.card, {
                    [styles.current]:
                      example.relativePath === currentExample.relativePath,
                  })}
                >
                  <img
                    src={
                      example.screenshot ||
                      'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/screenshot-placeholder-b8e70.png'
                    }
                    alt={title || example.relativePath}
                  />
                </li>
              </Tooltip>
            );
          })}
        </ul>
      </div>
      <PlayGround
        key={currentExample.relativePath}
        relativePath={currentExample.relativePath}
        source={currentExample.source}
        babeledSource={currentExample.babeledSource}
        filename={currentExample.filename}
        playground={playground}
        location={location}
      />
    </div>
  );
};

export default PlayGrounds;
