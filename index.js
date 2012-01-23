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
     'cascade_fork', 'cascade_slice', 'cascade_queue', 'cascade_collect', 'cascade_filter'],
    function( cascade,
              fork, slice, queue, collect, filter ){

        cascade.fork = fork;
        cascade.slice = slice;
        cascade.queue = queue;
        cascade.collect = collect;
        cascade.filter = filter;

        module.exports = cascade;
    }
);