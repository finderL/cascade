var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade.filter" ).addBatch({
    "Passes non-array primitives" : test.create( [1], [1],
                                                 cascade.filter( function(){} )
                                               ),
    "Passes all for 'return true;'" : test.create( [[1,2,3,4,5]], [[1,2,3,4,5]],
                                                   cascade.filter( function(){ return true; } )
                                                 ),
    "Passes none for 'return false;'" : test.create( [[1,2,3,4,5]], [[]],
                                                     cascade.filter( function(){ return false; } )
                                                   ),
    "Passes some for a valid filter function" : test.create( [[1,2,3,4,5,6]], [[2,4,6]],
                                                             cascade.filter( function(i){ return i%2===0; } )
                                                           )
}).export( module );