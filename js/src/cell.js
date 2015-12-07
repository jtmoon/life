'use strict';

define(['lodash', 'base'], function(_, Base) {

/**
 * A cell is responsible for:
 * 1) Preserving its own state of alive or dead.
 * 2) Evaluating if it needs to live or die.
 * A cell is isolated and has no awareness of its surroundings.
 * It relies on the board to notify it of changes that affect it.
 */
class Cell extends Base {
  static get config() {
    return {
      cellSize: 5,
      cellMargin:  1,
    }
  }

  constructor(overrides) {
    super();

    // Default configuration for the cell. `conditions` determines how many
    // living neighbors result in the cell living or dying.
    this.config = {
      conditions: {
        alive: {
          2: true,
          3: true
        },
        dead: {
          3: true
        }
      }
    }

    // Update the configuration with the provided overrides.
    if (overrides !== undefined && typeof overrides === 'object') {
      this.config = _.assign(this.config, overrides);
    }

    this._id = Cell.makeID();
    this.isAlive = false;
    this.willLive = false;
  }

  /**
   * Change the cell's state to alive.
   * @return Void
   */
  revive() {
    this.isAlive = true;
    this.willLive = false;
  }

  /**
   * Change the cell's state to dead.
   * @return Void
   */
  kill() {
    this.isAlive = false;
    this.willLive = false;
  }

  /**
   * Determine if the cell will live based on the number of
   * living neighbors.
   * @param Number livingNeighbors
   * @return Void
   */
  evaluate(livingNeighbors) {
    this.willLive = this.isAlive ?
        this.config.conditions.alive.hasOwnProperty(livingNeighbors) :
        this.config.conditions.dead.hasOwnProperty(livingNeighbors);
  }

  /**
   * Update the state of the cell.
   * @return Void
   */
  update() {
    if (this.willLive) {
      this.revive();
    } else {
      this.kill();
    }
  }
}

return Cell;
});
