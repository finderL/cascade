var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade.join" ).addBatch({
    "(non-destructured)" : {
        "Passes primitives" : test.create( [ 1 ], [ 1 ],
                                           cascade.join ),
        "Passes objects" : test.create( [ { test: true } ], [ { test : true } ],
                                        cascade.join ),
        "Passes arrays" : test.create( [[1,2,3]], [[1,2,3]],
                                       cascade.join ),
    },
    "(destructured, fork)" : {
        "Reconstructs array (single item)" : test.create( [[1]], [[1]],
                                                          cascade.fork,
                                                          cascade.join ),
        "Reconstructs array (multiple items)" : test.create( [[1,2,3]], [[1,2,3]],
                                                             cascade.fork,
                                                             cascade.join ),
        "Pre-join processing" : test.create( [[1,2,3]], [[2,3,4]],
                                             cascade.fork,
                                             test.increment(1),
                                             cascade.join ),
        "Pre- and post- join processing" : test.create( [[1,2,3]], [[3,4,5]],
                                                        cascade.fork,
                                                        test.increment(1),
                                                        cascade.join,
                                                        function( arr, next ){
                                                            for( var i in arr ){
                                                                arr[i]++;
                                                            }
                                                            next( arr );
                                                        }
                                                      )
    },
    "(destructured, queue)" : {
        "Reconstructs array (single item)" : test.create( [[1]], [[1]],
                                                          cascade.queue,
                                                          cascade.join ),
        "Reconstructs array (multiple items)" : test.create( [[1,2,3]], [[1,2,3]],
                                                             cascade.queue,
                                                             cascade.join ),
        "Pre-join processing" : test.create( [[1,2,3]], [[2,3,4]],
                                             cascade.queue,
                                             test.increment(1),
                                             cascade.join ),
        "Pre- and post- join processing" : test.create( [[1,2,3]], [[3,4,5]],
                                                        cascade.queue,
                                                        test.increment(1),
                                                        cascade.join,
                                                        function( arr, next ){
                                                            for( var i in arr ){
                                                                arr[i]++;
                                                            }
                                                            next( arr );
                                                        }
                                                      )
    }
}).export( module );