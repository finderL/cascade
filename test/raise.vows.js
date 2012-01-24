var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade.raise" ).addBatch({
    "No error (one argument)" : function(){
        assert.doesNotThrow( function(){
            cascade( 5,
                     cascade.raise,
                     test.increment(1),
                     cascade.raise
                   );
        });
    },
    "No error (multiple arguments)" : function(){
        assert.doesNotThrow( function(){
            cascade( null,
                     function( v, next ){ next( 1, 2 ); },
                     cascade.raise,
                     function( v1, v2, next ){
                         assert.equal( v1, 1 );
                         assert.equal( v2, 2 );
                     }
                   );
        } );
    },
    "Error" : function(){
        assert.throws( function(){
            cascade( null,
                     function( v, next ){
                         next( Error("This should be thrown") );
                     },
                     cascade.raise
                   );
        });
    },
    "Error (halts propagation)" : function(){
        assert.throws( function(){
            cascade( null,
                     function( v, next ){
                         next( Error("This should be thrown") );
                     },
                     cascade.raise,
                     function( v, next ){
                         assert.fail("Should not have reached this point");
                     }
                   );
        });
    }
}).export( module );
