define(['lodash', 'cell', 'cellMeta'], function(_, Cell, CellMeta) {

/**
 * The board is responsible for defining the space for the cells. The board
 * will determine the number of cells per row and column, and populate as
 * necessary. The board is also responsible for tracking each cell, and
 * processing a step in time. With each step in time the board notifies
 * each cell of its updated surroundings.
 */
function Board(overrides) {

  // Default configuration.
  this.config = {
    id:               'life'
  };

  // Update the configuration with the default cell configuration.
  this.config = _.assign(this.config, Cell.prototype.config);

  // Update the configuration with the provided overrides.
  if (overrides !== undefined && typeof overrides === 'object') {
    this.config = _.assign(this.config, overrides);
  }

  // A 1-dimensional array containing all the cells on the board.
  this.cells            = [];

  // A map containing a cell's metadata using the cell's id as the key.
  this.cellMetasById    = {};

  /**
   * Find the neighbors of a target cell.
   * @param Cell cell
   * @return Array
   */
  this.getNeighbors = function(cell) {
    var neighbors = [];
    var x, y, yPosition, xPosition, cellMeta, neighborIndex;

    if (!cell || !cell._id) {
      throw 'Target cell instance must be provided as argument.';
    }

    // Get the metadata for the cell. The metadata contains the x and y of
    // the cell.
    cellMeta = this.cellMetasById[cell._id];

    // A cells neighbors is all vertically, horizontally, and
    // diagonally adjacent cells. To find all neighbors we need to
    // iterate the 3x3 area surrounding the target cell. We can
    // accomplish this by starting our iteration one cell less than
    // the target cell, and end one cell beyond.
    for (y = cellMeta.y - 1; y <= cellMeta.y + 1; y++) {

      // If the starting cell is out of bounds then we need to
      // determine which boundary is being violated. We will treat this
      // as an infinite space so the cell will switch to evaluating
      // the cell on the opposite end of the board.

      // If we are within the accepted boundaries then use the position.
      if (y >= 0 && y < this.cellsPerColumn) {
        yPosition = y;
      } else {

        // If we are negative then we have stretched beyond the top boundary.
        // Update the position to be at the bottom boundary. Otherwise, we
        // have stretched beyond the bottom boundary so update the position
        // to be at the top boundary.
        if (y < 0) {
          yPosition = this.cellsPerColumn - 1;
        } else {
          yPosition = 0;
        }
      }

      // Iterate through this row of cells.
      for (x = cellMeta.x - 1; x <= cellMeta.x + 1; x++) {

        // Similar to the y boundary, we need to determine if a
        // boundary is being violated, and respond accordingly.
        if (x >= 0 && x < this.cellsPerRow) {
          xPosition = x;
        } else {
          if (x < 0) {
            xPosition = this.cellsPerRow - 1;
          } else {
            xPosition = 0;
          }
        }

        // We can use the formula we used to determine the x and y in
        // `populateBoard` to solve for the index of the cell based on the
        // cell's x and y. Every y is considered a new row so we multiply
        // y by the number of cells per row and add x to determine the index.
        neighborIndex = (yPosition * this.cellsPerRow) + xPosition;

        // Verify this cell is not the same as the target cell.
        // If it's not the same cell then add it to the array of
        // neighboring cells.
        var neighboringCell = this.cells[neighborIndex];

        if (neighboringCell._id !== cell._id) {
          neighbors.push(neighboringCell);
        }
      }
    }

    return neighbors;
  }

  /**
   * Populate the current board with cells based on the layout of the current
   * board configured through `calculateCellLayout`. If either `cellsPerRow`
   * or `cellsPerColumn` is missing then configure the board through
   * `calculateCellLayout`. By default cells are dead. If `isRandom` is true
   * then randomly determine if a cell is alive. `percentage` is used to
   * determine the probability of a cell being alive, and defaults to 20.
   */
  this.populateBoard = function(isRandom, percentage) {

    // Check to see if we need to configure the board.
    if (!this.hasOwnProperty('cellsPerRow') ||
      !this.hasOwnProperty('cellsPerColumn')) {
      this.calculateCellLayout();
    }

    // Calculate the total number of cells by getting the product of the
    // number of cells per row and column.
    var totalCells = this.cellsPerRow * this.cellsPerColumn;
    var x = 0;
    var y = 0;
    var i, cell, ratio, randomFloat, cellMeta, neighbors, targetCell,
        position;

    // Iterate the total number of cells we need and create a new cell.
    for (i = 0; i < totalCells; i++) {

      // Determine the x and y of the cell by using the formula below.
      // If the current index is greater than 0 then we are beyond the (0,0)
      // position and need to calculate the x and y of the cell. If the index
      // divided by the total number of cells per row has a remainder then
      // we are still on the same row and increment x. If there is no
      // remainder then we have reached the end of the row. Reset x and
      // increment y.
      if (i > 0) {
        if (i % (this.cellsPerRow) !== 0) {
          x++;
        } else {
          y++;
          x = 0;
        }
      }

      // Create a cell using the configuration.
      cell = new Cell(this.config);

      // If `isRandom` is set to true then we need to determine if this cell
      // is a cell that should be alive.
      if (isRandom) {

        // If `percentage` is not provided then default to 20.
        if (!percentage) {
          percentage = 20;
        }

        // Get a float representing the percentage and get a random float
        // using Math.random.
        ratio = percentage / 100;
        randomFloat = Math.random();

        // If the ratio is greater than the random float then revive the cell.
        if (ratio >= randomFloat) {
          cell.revive();
        }
      }

      // Create metadata for the cell to store the cell and its x and y
      // position.
      cellMeta = new CellMeta();
      cellMeta.x = x;
      cellMeta.y = y;

      // Add the cell to the array of cells, and store the metadata using the
      // cell's id.
      this.cells.push(cell);
      this.cellMetasById[cell._id] = cellMeta;
    }

    return this.cells;
  }

  /**
   * Update the provided cells based on their
   * `willLive` flag.
   * @param Array cells
   * @return Void
   */
  this.updateCells = function(cells) {
    var i;

    for(i = 0; i < cells.length; i++) {
      cells[i].update();
    }
  }

  /**
   * Calculate the number of cells per row and column based on
   * the provided width and height. If no value is provided for
   * either width or height then get the value from window.
   */
  this.calculateCellLayout = function(width, height) {

    // Store the width and height values.
    this.width = width ? width : window.innerWidth;
    this.height = height ? height : window.innerHeight;

    // Calculate the number of cells per row and column by dividing
    // the width and height by the size of the configured cell
    // including the cell margin. Use Math.ceil so the board takes
    // up more than the full space instead of less if necessary.
    this.cellsPerRow     = Math.ceil(this.width /
      (this.config.cellSize + this.config.cellMargin));
    this.cellsPerColumn  = Math.ceil(this.height /
      (this.config.cellSize + this.config.cellMargin));
  }

  /**
   * Process a step in time by triaging every cell and
   * changing their state appropriately. Return an array of the
   * cells that were changed so a renderer can identify which
   * cells need to be refreshed.
   * @return Array
   */
  this.tick = function() {
    var cellsToUpdate = [];
    var neighborsById = {};
    var neighbors = [];
    var i, z, targetCell, livingNeighbors;

    // Iterate every cell and evaluate.
    for (i = 0; i < this.cells.length; i++) {
      targetCell = this.cells[i];

      // Get the neighbors of the current cell.
      neighbors = this.getNeighbors(targetCell);
      livingNeighbors = 0;

      // Iterate the neighbors of a cell to determine how many are living.
      for (z = 0; z < neighbors.length; z++) {
        if (neighbors[z].isAlive) {
          livingNeighbors++;
        }
      }

      // Let the cell determine if it will live or not.
      targetCell.evaluate(livingNeighbors);

      // Determine if the cell's state will change. If so, add it to the array
      // of cells to update. Updating the state now will result in cells
      // having a modified value before every cell has been evaluated for
      // this step in time.
      if (targetCell.isAlive !== targetCell.willLive) {
        cellsToUpdate.push(targetCell);
      }
    }

    // Update the cells since the step in time is complete.
    this.updateCells(cellsToUpdate);

    return cellsToUpdate;
  }
}

return Board;
});
