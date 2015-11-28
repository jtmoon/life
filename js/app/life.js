define(['lodash', 'board', 'cell'], function(_, Board, Cell) {

/**
 * Sets the context for the game. Responsible for rendering the game.
 */
function Life(overrides) {

  // Instatiate a board with the provided overrides.
  this.board      = new Board(overrides);

  // Set the interval provided through the overrides or default to 100ms.
  this.interval   = overrides && overrides.interval ? overrides.interval : 100;
  this.intervalID = null;

  // Store the canvas and context for drawing.
  this.canvas     = document.getElementById(this.board.config.id);
  this.context    = this.canvas.getContext('2d');
  this.isInitialized = false;

  // Default configuration.
  this.config     = {
    colors: {
      live: '#D0EAF7',
      dead: '#F7F8F8'
    },
    isRandom: false
  }

  // Update the configuration with the provided overrides.
  if (overrides !== undefined && typeof overrides === 'object') {
    this.config = _.assign(this.config, overrides);
  }

  /**
   * Starts the animation and updates according to the provided interval..
   * @return Void
   */
  this.start = function() {

    // Initialize if necessary.
    if (!this.isInitialized) {
      this.init();
    }

    // Start the interval for the animation. Store the interval ID for being
    // able to stop it later.
    this.intervalID = window.setInterval(function() {

      // Optimize the animation.
      window.requestAnimationFrame(this.step.bind(this));
    }.bind(this), this.interval);
  }

  /**
   * Stop the animation.
   * @return Void
   */
  this.stop = function() {
    window.clearInterval(this.intervalID);
  }

  /**
   * Process a step in time by triggering a step in time on the board and
   * update the rendering.
   * @return Void
   */
  this.step = function() {
    var cells = this.board.tick();
    this.drawCells(cells);
  }

  /**
   * Initialize by calculating the board layout and modify the canvas width
   * and height according to the dimensions of the board.
   * @return Void
   */
  this.init = function() {
    var i, cells, cell, cellMeta;

    this.board.calculateCellLayout();
    this.canvas.width = this.board.width;
    this.canvas.height = this.board.height;
    cells = this.board.populateBoard(this.config.isRandom);

    this.drawCells(cells);
    this.isInitialized = true;
  }

  /**
   * Calculate the board position of the
   * @param Number x
   * @param Number y
   * @return Object
   */
  this.calculateCellsPosition = function(x, y) {
    var position = {};

    position.x = (this.board.config.cellSize + this.board.config.cellMargin) * x;
    position.y = (this.board.config.cellSize + this.board.config.cellMargin) * y;

    return position;
  }

  /**
   * Draw the cells.
   * @param Array cells
   * @return Void
   */
  this.drawCells = function(cells) {
    var i, cells, cell, cellMeta, cellPosition;

    for (i = 0; i < cells.length; i++) {
      cell = cells[i];

      // Get the metadata of the cell containing the x and y position.
      cellMeta = this.board.cellMetasById[cell._id];

      // Get the x and y position for rendering the cell.
      cellPosition = this.calculateCellsPosition(cellMeta.x, cellMeta.y);

      this.context.fillStyle = cell.isAlive ? this.config.colors.live : this.config.colors.dead;
      this.context.fillRect(cellPosition.x, cellPosition.y,
        this.board.config.cellSize, this.board.config.cellSize);
    }
  }
}

return Life;
});
