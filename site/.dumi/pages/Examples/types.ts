import type { Demo, Example, ExampleTopic } from '@antv/dumi-theme-antv/dist/types';
import type React from 'react';

export interface AnnouncementProps {
  message: React.ReactNode;
  localStorageId: string;
  bannerId: string;
  style?: React.CSSProperties;
}

export interface GalleryPageContentProps {
  /**
   * 案例主题列表
   */
  exampleTopics: ExampleTopic[];
}

export interface LeftMenuProps {
  /**
   * 案例主题列表
   */
  exampleTopics: ExampleTopic[];
}

export interface ExampleWithTopic extends Example {
  targetTopic: ExampleTopic;
}

export interface DemoCardProps {
  demo: Demo;
  topicId: string;
  exampleId: string;
}

export interface LeftMenuProps {
  /**
   * 案例主题列表
   */
  exampleTopics: ExampleTopic[];
}
