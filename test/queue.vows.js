var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade.queue" ).addBatch({
    "Passes non-array primitives" : test.create( [1], [1],
                                                 cascade.queue
                                               ),
    "Passes non-array objects" : test.create( [{ ok : true }], [{ ok : true }],
                                              cascade.queue
                                            ),
    "Separates incoming array into elements" : test.create( [[ 1 ]], [1],
                                                            cascade.queue
                                                          ),
    "(many items, no post-process)" : test.create( [[1, 2]], [[1, 2]],
                                                   cascade.queue,
                                                   cascade.join
                                                 ),
    "(many items, post-process)" : test.create( [[1, 2]], [[2, 3]],
                                                cascade.queue,
                                                test.increment(1),
                                                cascade.join
                                              ),
    "Runs elements in index order" : test.create( [[1,2,3,4,5]], [{ order : [1,2,3,4,5] }],
                                                  test.addData( { order : [] } ),
                                                  cascade.queue,
                                                  cascade.each( function( i ){
                                                      this.data.list_context.data.order.push( i );
                                                  } ),
                                                  cascade.join,
                                                  test.returnData
                                                ),

    "Runs elements in index order (random async)" : test.context( [3,1,2,4,5], { order : [3,1,2,4,5] },
                                                                 test.addData( { order : [] } ),
                                                                 cascade.queue,
                                                                 test.randomDelay( 10, 100 ),
                                                                 cascade.each( function(i){
                                                                     this.data.list_context.data.order.push(i);
                                                                 }),
                                                                 cascade.join,
                                                                 test.returnData
                                                               )
}).export( module );