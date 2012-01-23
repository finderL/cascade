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
                                            test.increment(1) )
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

    "Collect:" : {
        "(not from a destructured array, primitive)" : test.context( 1, 1,
                                                          cascade.collect
                                                        ),
        "(not from a destructured array, array)" : test.context( [ 1 ], [ 1 ],
                                                                 cascade.collect
                                                               ),
        "(single item)" : test.context( [ 1 ], [ 1 ],
                                        cascade.fork,
                                        cascade.collect
                                      ),
        "(many items)" : test.context( [1, 2], [1, 2],
                                       cascade.fork,
                                       cascade.collect
                                     )
    },

    "Fork:" : {
        "(single item)" : test.context( [ 1 ], 1,
                                        cascade.fork,
                                        test.log
                                      ),
        "(many items, no post-process)" : test.context( [1, 2], [1, 2],
                                                        cascade.fork,
                                                        cascade.collect
                                                      ),
        "(many items, post-process)" : test.context( [1, 2], [2, 3],
                                                     cascade.fork,
                                                     test.increment(1),
                                                     cascade.collect
                                                   )
    }
}).export(module);