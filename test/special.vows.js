var vows = require('vows'),
    assert = require('assert'),
    cascade = require('../index'),
    test = require('./test');

vows.describe( "Cascade special tests" ).addBatch({
    "Node.js filesystem rename/stat sample" : {
        topic : function(){
            var fs = require('fs'),
                oldFilename = './test/__TESTFILE',
                newFilename = './test/__NEW_TESTFILE',
                topicDone = this.callback,
                testFn = function(){
                    cascade( oldFilename, newFilename,
                             cascade.chain( fs.rename ),
                             cascade.raise,
                             cascade.rearrange(2),
                             fs.stat,
                             cascade.raise,
                             function( noerr, stats, next ){
                                 assert.isObject( stats );
                                 next( newFilename );
                             },
                             fs.unlink,
                             test.done( topicDone )
                           );
                };

            // create the file
            fs.writeFileSync( oldFilename, 'test' );
            assert.doesNotThrow( testFn );
        },
        "ok" : function( topic ){ /** test will drop if there's a failure **/ }
    }
}).export( module );