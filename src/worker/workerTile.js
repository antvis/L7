export default class WorkerTile {
  constructor(tile) {
    this.id = tile.id;
  }
  parse(data, layerstyle, actor, callback) {
    this.status = 'parsing';
    this.data = data;
    const buckets = {};
    // 根据source
    for (const sourcelayer in layerstyle) {
      for (let i = 0; i < layerstyle[sourcelayer].length; i++) {

      }
    }
    this.status = 'done';
  }
}
