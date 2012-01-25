var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade (Data)" ).addBatch({
    "Set/get" : test.create( [null], [{data : true}],
                             test.addData( { data : true } ),
                             test.returnData
                           ),
    "Set/get (multiple)" : test.create( [null], [{ one : true, two : true }],
                                        test.addData( { one : true } ),
                                        test.addData( { two : true } ),
                                        test.returnData
                                      ),
    "Set/get (multiple, across callbacks)" : test.create( [null], [{ one : true, two : true }],
                                                          test.addData( { one : true } ),
                                                          test.passthrough,
                                                          test.addData( { two : true } ),
                                                          test.returnData
                                                        ),
    "Set/get across async callbacks" : test.context( null, {one: true, two: true, three: true },
                                                     test.addData( { one : true } ),
                                                     test.returnData,
                                                     test.delay( 100 ),
                                                     test.addData( { two : true } ),
                                                     test.delay( 100 ),
                                                     test.addData( { three: true } ),
                                                     test.delay( 100 ),
                                                     test.returnData
                                                   )
}).export( module );