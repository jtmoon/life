# Game of Life
A Game of Life implementation using javascript and canvas.

### Design
**Cells** are considered stateful, but unaware of their environment. They rely on their environment to notify them of changes that may affect them. Cells can update their state when notified.

Cells are responsible for:

1. Maintaining state.
2. Evaluating if they live or die based on the number of live neighbors they have provided by the environment.

Each cell also has their own set of conditions determining how many live neighbors results in life or death. For example, while not currently implemented, a cell could morph and become more resilient to overpopulation.

**Boards** are the environment containing cells. They define the number of cells per row and column within a defined space.

Boards are responsible for:

1. Tracking each cell.
2. Processing a step in time.

Since cells are unaware of their environment, the board is responsible for identifying each cells neighbors, and notifying each cell to update.

**Life** is responsible for rendering. **Boards** and **Cells** are only concerned about tracking the necessary information for understanding state. Rendering is decoupled from this and gets the information it needs to render the based on the current state. **Life** can configure the board and cells as necessary for rendering.

### Libraries
[Require.js](http://requirejs.org/) and [Lodash](https://lodash.com/) are used out of convenience. Both can be removed with minimal refactoring.
