var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

var domap = function( item, i ){ return item + i; };
var evenodd = function( item ){ return (item % 2 === 0) ? 'even' : 'odd'; };

vows.describe( "Cascade.map" ).addBatch({
    "Passes non-array primitives (single argument)" : test.create( [1], [1],
                                                                   cascade.map( domap )
                                                                 ),
    "Maps multiple arguments" : test.create( [1,2,3,4], [1,3,5,7],
                                             cascade.map( domap )
                                           ),
    "Maps incoming array" : test.create( [[1,2,3,4]], [['odd', 'even', 'odd', 'even']],
                                         cascade.map( evenodd )
                                       )
}).export( module );