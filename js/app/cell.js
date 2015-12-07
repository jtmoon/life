'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['lodash', 'base'], function (_, Base) {

  /**
   * A cell is responsible for:
   * 1) Preserving its own state of alive or dead.
   * 2) Evaluating if it needs to live or die.
   * A cell is isolated and has no awareness of its surroundings.
   * It relies on the board to notify it of changes that affect it.
   */

  var Cell = (function (_Base) {
    _inherits(Cell, _Base);

    _createClass(Cell, null, [{
      key: 'config',
      get: function get() {
        return {
          cellSize: 5,
          cellMargin: 1
        };
      }
    }]);

    function Cell(overrides) {
      _classCallCheck(this, Cell);

      // Default configuration for the cell. `conditions` determines how many
      // living neighbors result in the cell living or dying.

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Cell).call(this));

      _this.config = {
        conditions: {
          alive: {
            2: true,
            3: true
          },
          dead: {
            3: true
          }
        }
      };

      // Update the configuration with the provided overrides.
      if (overrides !== undefined && (typeof overrides === 'undefined' ? 'undefined' : _typeof(overrides)) === 'object') {
        _this.config = _.assign(_this.config, overrides);
      }

      _this._id = Cell.makeID();
      _this.isAlive = false;
      _this.willLive = false;
      return _this;
    }

    /**
     * Change the cell's state to alive.
     * @return Void
     */

    _createClass(Cell, [{
      key: 'revive',
      value: function revive() {
        this.isAlive = true;
        this.willLive = false;
      }

      /**
       * Change the cell's state to dead.
       * @return Void
       */

    }, {
      key: 'kill',
      value: function kill() {
        this.isAlive = false;
        this.willLive = false;
      }

      /**
       * Determine if the cell will live based on the number of
       * living neighbors.
       * @param Number livingNeighbors
       * @return Void
       */

    }, {
      key: 'evaluate',
      value: function evaluate(livingNeighbors) {
        this.willLive = this.isAlive ? this.config.conditions.alive.hasOwnProperty(livingNeighbors) : this.config.conditions.dead.hasOwnProperty(livingNeighbors);
      }

      /**
       * Update the state of the cell.
       * @return Void
       */

    }, {
      key: 'update',
      value: function update() {
        if (this.willLive) {
          this.revive();
        } else {
          this.kill();
        }
      }
    }]);

    return Cell;
  })(Base);

  return Cell;
});