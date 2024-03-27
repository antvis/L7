import { map } from 'lodash-es';
import type { Demo, ExampleTopic } from '../../types';

/**
 * 将数据结构转化成 map，便于后续检索的速度
 * @param exampleTopics
 * @returns
 */
export function getExampleTopicMap(exampleTopics: ExampleTopic[]) {
  const exampleTopicMap = new Map<string, Demo>();

  map(exampleTopics, (topic) => {
    map(topic.examples, (example) => {
      map(example.demos, (demo) => {
        exampleTopicMap.set(`${topic.id}-${example.id}-${demo.id}`, {
          ...demo,
          relativePath: `${topic.id}/${example.id}/demo/${demo.filename}`,
          targetExample: example,
          targetTopic: topic,
        });
      });
    });
  });

  return exampleTopicMap;
}

/**
 * 从 Context 信息中，获取到 Example 相关的信息，用于页面渲染
 */
export function getDemoInfo(
  exampleTopics: ExampleTopic[],
  topic: string,
  example: string,
  demo: string,
) {
  const m = getExampleTopicMap(exampleTopics);

  return m.get(`${topic}-${example}-${demo}`);
}
