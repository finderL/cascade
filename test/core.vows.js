var vows = require('vows'),
    assert = require('assert');

var cascade = require('../index'),
    test = require('./test');

vows.describe( 'Cascade (core)' ).addBatch({
    "Accepts a single argument with no callbacks" : test.create( [1], [1] ),
    "Accepts a single argument with multiple callbacks" : test.create( [1], [1],
                                                                       test.passthrough,
                                                                       test.passthrough,
                                                                       test.passthrough
                                                                     ),
    "Accepts multiple arguments with no callbacks" : test.create( [1, 2, 3, 4], [1,2,3,4] ),
    "Accepts multiple arguments with multiple callbacks" : test.create( [1, 2, 3, 4], [1,2,3,4],
                                                                        test.passthrough,
                                                                        test.passthrough,
                                                                        test.passthrough
                                                                      ),
    "Calls all callbacks in sequence (single argument)" : test.create( [1], [8],
                                                                       test.increment(1),
                                                                       test.assertEqual(2),
                                                                       test.increment(4),
                                                                       test.assertEqual(6),
                                                                       test.increment(2),
                                                                       test.assertEqual(8)
                                                                     ),
    "Calls all callbacks in sequence (multiple arguments)" : test.create( [2,5,9], [2,5,9],
                                                                          test.passthrough,
                                                                          test.passthrough
                                                                        ),
    "(async) Completes callback stack through asynchronous functions" : test.context(
        'test', 'test',
        test.delay(100)
    )
}).export(module);