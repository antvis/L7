import { ILayer } from '@antv/l7-core';
import { SourceTile } from '@antv/l7-utils';
export default class Tile {
  public x: number;
  public y: number;
  public z: number;
  protected parent:ILayer;
  protected sourceTile: SourceTile;
  constructor(sourceTile: SourceTile,parent: ILayer) {
    this.parent = parent;
    this.sourceTile =sourceTile;
    this.x = sourceTile.x;
    this.y = sourceTile.y;
    this.z = sourceTile.z
    this.initTileLayer()
    
  }

  protected initTileLayer() {
    console.log(this.sourceTile);

  }

}
