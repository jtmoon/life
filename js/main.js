'use strict';

requirejs.config({
  baseUrl: 'js/app',
  paths: {
    lodash: [
      '../lib/lodash.custom.min'
    ]
  }
})

requirejs(
['life'],
function(Life) {

  // Instantiate the game.
  var overrides =  {
    isRandom: true
  }
  var life = new Life(overrides);

  // Start the game.
  window.requestAnimationFrame(function() {
    life.start();
  }.bind(life));

  window.life = life;
}
)
