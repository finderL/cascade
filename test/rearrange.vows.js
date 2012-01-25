var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade.rearrange" ).addBatch({
    "Passes no arguments when no arguments supplied" : test.create(
        [ 1, 2, 3 ], [],
        cascade.rearrange()
    ),
    "Passes rearranged arguments correctly" : test.create(
        [ 1, 2, 3, 4 ], [ 3, 1, 4, 2 ],
        cascade.rearrange( 2, 0, 3, 1 )
    )
}).export( module );