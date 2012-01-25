var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade.fork" ).addBatch({
    "Passes non-array primitives" : test.create( [1], [1],
                                                 cascade.fork
                                               ),
    "Passes non-array objects" : test.create( [{ ok : true }], [{ ok : true }],
                                              cascade.fork
                                            ),
    "Separates incoming array into elements" : test.create( [[ 1 ]], [1],
                                                            cascade.fork
                                                          ),
    "(many items, no post-process)" : test.create( [[1, 2]], [[1, 2]],
                                                   cascade.fork,
                                                   cascade.join
                                                 ),
    "(many items, post-process)" : test.create( [[1, 2]], [[2, 3]],
                                                cascade.fork,
                                                test.increment(1),
                                                cascade.join
                                              )
}).export( module );