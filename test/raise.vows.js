var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

function calloutError(){
    arguments[ arguments.length - 1 ].apply(
        this,
        [ new EvalError() ].concat( Array.prototype.slice.call( arguments, 0, arguments.length - 1 ) )
    );
};
function handleError( err ){
    throw err;
};

vows.describe( "Cascade.raise" ).addBatch({
    "As a Cascade callback" : {
        "No error (one argument)" : function(){
            assert.doesNotThrow( function(){
                cascade( 5,
                         //cascade.raise,
                         //test.increment(1),
                         cascade.raise
                       );
            });
        },
        "No error (multiple arguments)" : function(){
            assert.doesNotThrow( function(){
                cascade( null,
                         function( v, next ){ next( v, 1, 2 ); },
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
            }, Error);
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
            }, Error);
        }
    },
    "As a Cascade callback generator" : {
        "Single argument, error handler defined (error)" : function(){
            assert.throws( function(){
                cascade( null,
                         calloutError,
                         cascade.raise( handleError )
                       );
            }, EvalError );
        },
        "Single argument, error handler defined (no error)" : function(){
            assert.doesNotThrow( function(){
                cascade( 1, 2, 3, 4,
                         cascade.raise( handleError ),
                         test.compareResult( [2, 3, 4] )
                       );
            });
        },
        "Two arguments, error handler defined, shiftArgs = 0 (error)" : function(){
            assert.throws( function(){
                cascade( 1, 2, 3, 4,
                         calloutError,
                         cascade.raise( handleError, 0 )
                       );
            }, EvalError );
        },
        "Two arguments, error handler defined, shiftArgs = 0 (no error)" : function(){
            assert.doesNotThrow( function(){
                cascade( 1, 2, 3, 4,
                         test.passthrough,
                         cascade.raise( handleError, 0 ),
                         test.compareResult( [1, 2, 3, 4] )
                       );
            }, EvalError );
        },
        "Two arguments, error handler defined, shiftArgs = 2 (error)" : function(){
            assert.throws( function(){
                cascade( 1, 2, 3, 4,
                         calloutError,
                         cascade.raise( handleError, 2 )
                       );
            }, EvalError );
        },
        "Two arguments, error handler defined, shiftArgs = 2 (no error)" : function(){
            assert.doesNotThrow( function(){
                cascade( 1, 2, 3, 4,
                         test.passthrough,
                         cascade.raise( handleError, 2 ),
                         test.compareResult( [3, 4] )
                       );
            }, EvalError );
        },
    }
}).export( module );