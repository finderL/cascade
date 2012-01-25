var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade.slice" ).addBatch({
    "Passes non-array primitives (single argument)" : test.create( [1], [1],
                                                                   cascade.slice(0)
                                                                 ),
    "Passes non-array primitives (with supplied value)" : test.create( [1], [1],
                                                                       cascade.slice(5)
                                                                     ),
    "Passes non-array values (multiple arguments)" : test.create( [1,2,3,4], [1,2,3,4],
                                                                  cascade.slice(0)
                                                                ),
    "Passes non-array values (multiple arguments, supplied value)" : test.create( [1,2,3,4], [1,2,3,4],
                                                                                  cascade.slice(5)
                                                                                ),
    "Slices incoming array (no second parameter)" : test.create( [[1,2,3,4]], [[3,4]],
                                                                 cascade.slice(2)
                                                               ),
    "Slices incoming array (second parameter)" : test.create( [[1,2,3,4]], [[3]],
                                                              cascade.slice(2,3)
                                                            )
}).export( module );