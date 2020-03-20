import { Feature, FeatureCollection } from '@turf/helpers';
import DrawSource from '../source';

export interface IDrawOption {
  data: FeatureCollection;
}

export default abstract class DrawFeature {
  private source: DrawSource;
  constructor(options: IDrawOption) {
    const { data } = options;
    this.source = new DrawSource(data);
  }

  protected onDragStart() {
    throw new Error('not imp');
  }

  protected onDragging() {
    throw new Error('not imp');
  }

  protected onDragEnd() {
    throw new Error('not imp');
  }

  protected onClick() {
    throw new Error('not imp');
  }
}
