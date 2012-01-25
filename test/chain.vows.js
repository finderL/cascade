var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade.chain" ).addBatch({
    "Requires a function as an argument" : function(){
        assert.throws( function(){
            cascade( 1,
                     cascade.chain( null )
                   );
        } );
    },
    "Passes existing arguments on to following functions" : test.create(
        [ 1, 2, 3 ], [ 1, 2, 3 ],
        cascade.chain( function(){ arguments[ arguments.length - 1 ](); } )
    ),
    "Shifts wrapped function callout values onto the argument stack" : test.create(
        [3, 4], [1, 2, 3, 4],
        cascade.chain( function( v1, v2, next ){ next( 1, 2 ); } )
    )
}).export( module );