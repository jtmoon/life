'use strict';

define([], function() {

/**
 * Metadata containing the x and y position of a cell.
 */
class CellMeta {
  constructor() {
    this._x = 0;
    this._y = 0;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }
}

return CellMeta;
});
