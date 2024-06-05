// @ts-ignore
import { clamp, interpolate } from '../util';
import Point from './point';

/**
 * An `EdgeInset` object represents screen space padding applied to the edges of the viewport.
 * This shifts the apprent center or the vanishing point of the map. This is useful for adding floating UI elements
 * on top of the map and having the vanishing point shift as UI elements resize.
 *
 * @param {number} [top=0]
 * @param {number} [bottom=0]
 * @param {number} [left=0]
 * @param {number} [right=0]
 */
export default class EdgeInsets {
  public top: number;
  public bottom: number;
  public left: number;
  public right: number;

  constructor(top: number = 0, bottom: number = 0, left: number = 0, right: number = 0) {
    if (
      isNaN(top) ||
      top < 0 ||
      isNaN(bottom) ||
      bottom < 0 ||
      isNaN(left) ||
      left < 0 ||
      isNaN(right) ||
      right < 0
    ) {
      throw new Error(
        'Invalid value for edge-insets, top, bottom, left and right must all be numbers',
      );
    }

    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }

  /**
   * Interpolates the inset in-place.
   * This maintains the current inset value for any inset not present in `target`.
   *
   * @param {PaddingOptions} target
   * @param {number} t
   * @returns {EdgeInsets}
   * @memberof EdgeInsets
   */
  public interpolate(
    start: IPaddingOptions | EdgeInsets,
    target: IPaddingOptions,
    t: number,
  ): EdgeInsets {
    if (target.top != null && start.top != null) {
      this.top = interpolate(start.top, target.top, t);
    }
    if (target.bottom != null && start.bottom != null) {
      this.bottom = interpolate(start.bottom, target.bottom, t);
    }
    if (target.left != null && start.left != null) {
      this.left = interpolate(start.left, target.left, t);
    }
    if (target.right != null && start.right != null) {
      this.right = interpolate(start.right, target.right, t);
    }

    return this;
  }

  /**
   * Utility method that computes the new apprent center or vanishing point after applying insets.
   * This is in pixels and with the top left being (0.0) and +y being downwards.
   *
   * @param {number} width
   * @param {number} height
   * @returns {Point}
   * @memberof EdgeInsets
   */
  public getCenter(width: number, height: number): Point {
    // Clamp insets so they never overflow width/height and always calculate a valid center
    const x = clamp((this.left + width - this.right) / 2, 0, width);
    const y = clamp((this.top + height - this.bottom) / 2, 0, height);

    return new Point(x, y);
  }

  public equals(other: IPaddingOptions): boolean {
    return (
      this.top === other.top &&
      this.bottom === other.bottom &&
      this.left === other.left &&
      this.right === other.right
    );
  }

  public clone(): EdgeInsets {
    return new EdgeInsets(this.top, this.bottom, this.left, this.right);
  }

  /**
   * Returns the current sdtate as json, useful when you want to have a
   * read-only representation of the inset.
   *
   * @returns {PaddingOptions}
   * @memberof EdgeInsets
   */
  public toJSON(): IPaddingOptions {
    return {
      top: this.top,
      bottom: this.bottom,
      left: this.left,
      right: this.right,
    };
  }
}

export interface IPaddingOptions {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
}
