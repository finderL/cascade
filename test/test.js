var assert = require('assert'),
    cascade = require('../index');

var test = module.exports = {
    // generates a macro context
    "context" : function( initialVal, result ){
        var funcs = Array.prototype.slice.call( arguments, 2 );
        return {
            topic : function(){

                cascade.apply( {},
                               [initialVal]
                                   .concat( funcs )
                                   .concat( test.done( this.callback ) )
                             );
            },
            "ok" : function( topic ){
                assert.deepEqual( topic, result );
            }
        };
    },

    "increment" : function( by ){
        return function( item, callback ){
            callback( item + by );
        };
    },

    "addData" : function( data ){
        return function( item, callback ){
            callback( item, data );
        }
    },

    "returnData" : function( item, callback, data ){
        callback( data );
    },

    "delay" : function( ms ){
        return function( item, callback ){
            setTimeout( function(){
                callback( item );
            }, ms );
        }
    },

    "log" : function( item, callback ){
        console.log( "Arguments:", item );

        callback( item );
    },

    "done" : function( cb ){
        return function( item, callback ){
            cb( null, item );
        }
    },

    /**
     * Asynchronous-compatible assertion
     */
    "assertEqual" : function( value ){
        return function( item, callback ){
            assert.equal( item, value );

            callback( item );
        }
    },

    "assertDeepEqual" : function( obj ){
        return function( item, callback ){
            assert.deepEqual( item, obj );

            callback( item );
        }
    }
};