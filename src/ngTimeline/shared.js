'use strict';

Array.prototype.map = function(iteratee) {
  var index = -1,
      length = this.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(this[index], index, this);
  }
  return result;
};


//
//function isPromiseLike(p) {
//  return p && isFunction(p.then);
//}
//
//function yieldWith(value, done) {
//  return { value : value, done : done };
//}
//
//function buildTimelineDriverName(name) {
//  var driver = name ? name.charAt(0).toUpperCase() + name.substr(1)
//                    : 'Noop';
//  return 'ngTimeline' + driver + 'Driver';
//}
