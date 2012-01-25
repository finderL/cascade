var assert = require('assert'),
    cascade = require('../index');

var TestComplete = function(){}
TestComplete.prototype = new Error();
TestComplete.prototype.constructor = TestComplete;

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

    "create" : function( initialArgs, resultArgs ){
        var stack = Array.prototype.slice.call( arguments, 2 );

        // if resultArgs is an array, add a final comparison function
        if( resultArgs instanceof Array ){
            stack.push( test.compareResult( resultArgs ) );
        }

        stack.push( test.complete );

        return function(){
            assert.throws( function(){
                cascade.apply(
                    {
                        stack : stack,
                        stackPosition : 0,
                        data : {}
                    },
                    initialArgs
                );
            }, TestComplete );
        }
    },

    "complete" : function(){
        throw new TestComplete();
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
            arguments[ arguments.length - 1 ].apply(
                this,
                Array.prototype.slice.call( arguments, 0, arguments.length - 1 )
            );
        }
    },

    "returnData" : function( item, next ){
        arguments[ arguments.length - 1 ]( this.data );
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

    "tap" : function( func ){
        return function(){
            var args = Array.prototype.slice.call( arguments, 0, arguments.length - 1 ),
                next = arguments[ arguments.length - 1 ];

            func.apply( this, args );

            next.apply( this, args );
        }
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
    },

    "compareResult" : function( compareTo ){
        return function(){
            assert.deepEqual(
                Array.prototype.slice.call( arguments, 0, arguments.length - 1 ),
                compareTo
            );

            arguments[ arguments.length - 1 ].call(
                this,
                Array.prototype.slice.call( arguments, 0, arguments.length - 1 )
            );
        };
    }
};