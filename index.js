/**
 * Cascade.js
 *
 * Simplifies the use of asynchronous series of function calls
 */

var requirejs = require('requirejs');

requirejs.config({
    baseUrl : __dirname + '/src',
    nodeRequire : require
});

requirejs(
    ['cascade_core',
     'cascade_fork', 'cascade_slice', 'cascade_queue', 'cascade_join', 'cascade_filter',
     'cascade_map', 'cascade_each', 'cascade_raise' ],
    function( cascade,
              fork, slice, queue, join, filter, map, each, raise ){

        cascade.fork = fork;
        cascade.slice = slice;
        cascade.queue = queue;
        cascade.join = join;
        cascade.filter = filter;
        cascade.map = map;
        cascade.each = each;
        cascade.raise = raise;

        module.exports = cascade;
    }
);