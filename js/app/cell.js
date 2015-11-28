define(['lodash'], function(_) {

/**
 * A cell is responsible for:
 * 1) Preserving its own state of alive or dead.
 * 2) Evaluating if it needs to live or die.
 * A cell is isolated and has no awareness of its surroundings.
 * It relies on the board to notify it of changes that affect it.
 */
function Cell(overrides) {

  /**
   * Generate a random 10 character string.
   * @return String
   */
  function makeID() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i=0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  this._id = makeID();
  this.isAlive = false;
  this.willLive = false;
  this.neighbors = [];

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

  /**
   * Change the cell's state to alive.
   * @return Void
   */
  this.revive = function() {
    this.isAlive = true;
    this.willLive = false;
  }

  /**
   * Change the cell's state to dead.
   * @return Void
   */
  this.kill = function() {
    this.isAlive = false;
    this.willLive = false;
  }

  /**
   * Determine if the cell will live based on the number of
   * living neighbors.
   * @param Number livingNeighbors
   * @return Void
   */
  this.evaluate = function(livingNeighbors) {
    this.willLive = this.isAlive ?
        this.config.conditions.alive.hasOwnProperty(livingNeighbors) :
        this.config.conditions.dead.hasOwnProperty(livingNeighbors);
  }

  /**
   * Update the state of the cell.
   * @return Void
   */
  this.update = function() {
    if (this.willLive) {
      this.revive();
    } else {
      this.kill();
    }
  }
}

// Default configuration for a cell.
Cell.prototype.config = {
  cellSize: 5,
  cellMargin:  1,
};

return Cell;
});
