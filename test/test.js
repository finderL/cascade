var assert = require('assert'),
    cascade = require('../index');

var test = module.exports = {
    // generates a macro context
    "context" : function( initialVal, result ){
        var funcs = Array.prototype.slice.call( arguments, 2 );
        return {
            topic : function(){

                cascade.call(
                    {
                        stack : funcs.concat( test.done( this.callback ) ),
                        stackPosition : 0,
                        data : {}
                    },
                    initialVal
                );
            },
            "ok" : function( topic ){
                assert.deepEqual( topic, result );
            }
        };
    },

    "passthrough" : function(){
        arguments[ arguments.length - 1 ].apply(
            this,
            Array.prototype.slice.call( arguments, 0, arguments.length - 1 )
        );
    },

    "increment" : function( by ){
        return function( item, callback ){
            callback( item + by );
        };
    },

    "addData" : function( data ){
        return function( item, next ){
            //callback( item, data );
            for( var prop in data ){
                this.data[prop] = data[prop];
            }
            next( item );
        }
    },

    "returnData" : function( item, next ){
        next( this.data );
    },

    "delay" : function( ms ){
        return function( item, callback ){
            setTimeout( function(){
                callback( item );
            }, ms );
        }
    },

    "randomDelay" : function( min, max ){
        return function( item, callback ){
            setTimeout( function(){
                callback( item );
            }, Math.floor( Math.random() * (max - min) + min ) );
        };
    },

    "log" : function( item, callback ){
        var args = Array.prototype.slice.call( arguments, 0, arguments.length - 1 );
        console.log( "Arguments:", args );

        arguments[ arguments.length - 1 ].apply( this, args );
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