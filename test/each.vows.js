var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade.each" ).addBatch({
    "Applies to non-array argument (single argument)" : function(){
        var ok = [false];

        cascade( 0,
                 cascade.each( function(i){ ok[i] = true; } )
                     );

        assert.isTrue( ok[0] );
    },
    "Applies to non-array arguments (multiple arguments)" : function(){
        var ok = [false, false, false, false, false];

        cascade( 0, 1, 2, 3, 4,
                 cascade.each( function(i){ ok[i] = true; } )
                     );

        assert.deepEqual( ok, [true, true, true, true, true] );
    },
    "Applies to array argument (single argument)" : function(){
               var ok = [false, false, false, false, false];

        cascade( [0, 1, 2, 3, 4],
                 cascade.each( function(i){ ok[i] = true; } )
                     );

        assert.deepEqual( ok, [true, true, true, true, true] );
    }
}).export( module );