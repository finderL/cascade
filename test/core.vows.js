var vows = require('vows'),
    assert = require('assert');

var cascade = require('../index'),
    test = require('./test');

vows.describe( 'Cascade' ).addBatch({
    "Callbacks:" : {
        "(one callback)" : test.context( 1, 2,
                                          test.increment(1) ),
        "(many callbacks)" : test.context( 1, 5,
                                           test.increment(1),
                                           test.increment(1),
                                           test.increment(1),
                                           test.increment(1) ),
        "(with async call)" : test.context( 1, 5,
                                            test.increment(1),
                                            test.increment(1),
                                            test.delay(100),
                                            test.increment(1),
                                            test.increment(1)
                                          ),
        "(with multiple arguments)" : {
            topic : function(){

                var fib = function( v1, v2, next ){
                    next( v2, v1 + v2 );
                };
                var done = this.callback;

                cascade(
                    1,
                    function(v, next){ next( v, v ) },
                    fib,
                    fib,
                    fib,
                    function(){
                        done( null, { args : Array.prototype.slice.call( arguments, 0, 2 ) } );
                    }
                );
            },
            "ok" : function( topic ){
                assert.deepEqual( topic, { args : [3, 5] } );
            }
        }
    },

    "Data:" : {
        "(one data, one callback)" : test.context( null, { data : true },
                                                   test.addData( { data : true } ),
                                                   test.returnData
                                                 ),
        "(one data, many callbacks)" : test.context( null, { data : true },
                                                     test.addData( { data : true } ),
                                                     test.delay( 100 ),
                                                     test.returnData
                                                   ),
        "(many data, many callbacks)" : test.context( null, { one : true, two : true },
                                                      test.addData( { one : true } ),
                                                      test.delay( 100 ),
                                                      test.addData( { two : true } ),
                                                      test.delay( 100 ),
                                                      test.returnData
                                                    )
    },

    "Slice:" : {
        "(not an array)" : test.context( 1, 1,
                                         cascade.slice(0) ),
        "(array, length 1, slice(0))" : test.context( [1], [1],
                                                      cascade.slice(0)
                                                    ),
        "(array, length 1, slice(1))" : test.context( [1], [],
                                                      cascade.slice(1)
                                                    ),
        "(array, length 5, slice(0))" : test.context( [1,2,3,4,5], [1,2,3,4,5],
                                                      cascade.slice(0)
                                                    ),
        "(array, length 5, slice(3))" : test.context( [1,2,3,4,5], [4,5],
                                                      cascade.slice(3)
                                                    )
    },

    "Join:" : {
        "(not from a destructured array, primitive)" : test.context( 1, 1,
                                                          cascade.join
                                                        ),
        "(not from a destructured array, array)" : test.context( [ 1 ], [ 1 ],
                                                                 cascade.join
                                                               ),
        "(single item)" : test.context( [ 1 ], [ 1 ],
                                        cascade.fork,
                                        cascade.join
                                      ),
        "(many items)" : test.context( [1, 2], [1, 2],
                                       cascade.fork,
                                       cascade.join
                                     ),
        "(many items, post-aggregate processing)" : test.context( [1,2,3], [2,3,4],
                                                                  cascade.fork,
                                                                  cascade.join,
                                                                  function( arr, cb ){
                                                                      for( var i in arr ){
                                                                          arr[i]++;
                                                                      }
                                                                      cb(arr);
                                                                  }
                                                                )
    },

    "Fork:" : {
        "(single item)" : test.context( [ 1 ], 1,
                                        cascade.fork
                                      ),
        "(many items, no post-process)" : test.context( [1, 2], [1, 2],
                                                        cascade.fork,
                                                        cascade.join
                                                      ),
        "(many items, post-process)" : test.context( [1, 2], [2, 3],
                                                     cascade.fork,
                                                     test.increment(1),
                                                     cascade.join
                                                   )
    },


    "Queue:" : {
        "(not an array)" : test.context( 1, 1,
                                         cascade.queue
                                       ),
        "(array, length 1)" : test.context( [1], 1,
                                            cascade.queue
                                          ),
        "(array, runs all)" : {
            topic : function(){
                var ok = [],
                    calls = 4,
                    done = this.callback,
                    log = function( item, call ){
                        ok[item] = true;
                        call( item );
                    },
                    multicall = function( item, call ){
                        if( --calls === 0 ){
                            done( null, ok );
                        } else {
                            call( item );
                        }
                    };

                cascade(
                    [0,1,2,3],
                    cascade.queue,
                    log,
                    multicall );
            },
            "ok" : function( topic ){
                assert.deepEqual( topic, [true, true, true, true] );
            }
        },
        "(array, length 5, join, ensure order)" : {
            topic : function(){
                var order = [],
                    log = function(i,c){
                        order.push( i );
                        c(i);
                    };

                cascade(
                    [1,2,3,4,5],
                    cascade.queue,
                    //test.randomDelay( 10, 30 ),
                    log,
                    cascade.join,
                    test.addData( {order : order} ),
                    test.returnData,
                    test.done( this.callback )
                );
            },
            "ok" : function(topic){
                assert.deepEqual( topic, {order : [1,2,3,4,5]} );
            }
        },
        "(array, length 5, join, ensure order, random async delay)" : {
            topic : function(){
                var order = [],
                    log = function(i,c){
                        order.push( i );
                        c(i);
                    };

                cascade(
                    [3,2,1,4,5],
                    cascade.queue,
                    test.randomDelay( 1, 100 ),
                    log,
                    cascade.join,
                    test.addData( {order : order} ),
                    test.returnData,
                    test.done( this.callback )
                );
            },
            "ok" : function( topic ){
                assert.deepEqual( topic, { order : [3,2,1,4,5] } );
            }
        }
    },


    "Filter:" : {
        "(not an array)" : test.context( 1, 1,
                                         cascade.filter( function(){} )
                                       ),
        "(pass all)" : test.context( [1,2,3], [1,2,3],
                                     cascade.filter( function(){ return true; } )
                                   ),
        "(pass none)": test.context( [1,2,3], [],
                                     cascade.filter( function(){ return false; } )
                                   ),
        "(pass some)" : test.context( [1,2,3,4,5,6], [2,4,6],
                                      cascade.filter( function(i){ return i % 2 === 0; } )
                                    )
    },

    "Map:" : {
        "(not an array)" : test.context( 1, true,
                                         cascade.map( function(i){ return !!i; } )
                                       ),
        "(array)" : test.context( [1,2,3,4,5,6], ['odd', 'even', 'odd', 'even', 'odd', 'even'],
                                  cascade.map( function(i){ return (i%2===0?'even':'odd'); } )
                                )
    },

    "Each:" : {
        "(not an array, still applies)" : {
            topic : function(){
                var ok = [];

                cascade(
                    1,
                    cascade.each( function( item, index, list ){
                        ok[ item ] = true;
                    } ),
                    test.addData( { ok : ok } ),
                    test.returnData,
                    test.done( this.callback )
                );
            },
            "ok" : function( topic ){
                assert.deepEqual( topic, { ok : [,true] });
            }
        },
        "(applies to all elements)" : {
            topic : function(){
                var ok = [];

                cascade(
                    [1,2,3],
                    cascade.each( function( item, index, list ){
                        ok[ index ] = true;
                    } ),
                    test.addData( { ok : ok } ),
                    test.returnData,
                    test.done( this.callback )
                );
            },
            "ok" : function( topic ){
                assert.deepEqual( topic, { ok : [true, true, true] });
            }
        }
    }


}).export(module);