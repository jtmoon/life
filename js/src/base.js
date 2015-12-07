'use strict';

define([], function() {

class Base {
  static makeID() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    let i = 0;

    while (i < 10) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      i++;
    }

    return text;
  }
}

return Base;

});
