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
     'cascade_map', 'cascade_each', 'cascade_raise', 'cascade_rearrange', 'cascade_chain' ],
    function( cascade,
              fork, slice, queue, join, filter, map, each, raise, rearrange, chain ){

        cascade.fork = fork;
        cascade.slice = slice;
        cascade.queue = queue;
        cascade.join = join;
        cascade.filter = filter;
        cascade.map = map;
        cascade.each = each;
        cascade.raise = raise;
        cascade.rearrange = rearrange;
        cascade.chain = chain;

        module.exports = cascade;
    }
);