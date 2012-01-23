define( ['util_extend'], function( extend ){

    /**
     * Forks an incoming list into separate series of callbacks for each item
     */
    return function( item, callback, parentData, curCallback, callbackStack ){

        for( var i = 0, len = item.length ; i < len ; i++ ){
            (function( element, index ){

                // create a new callback function
                var forkCallbackCount = curCallback,
                    data = extend( {}, parentData, { list_index : index, list_length : item.length } ),
                    forkCallback = function( forked_item, extraData ){
                        if( forkCallbackCount < callbackStack.length ){
                            callbackStack[ forkCallbackCount++ ]( forked_item,
                                                                  forkCallback,
                                                                  extend( data, extraData ),
                                                                  forkCallbackCount,
                                                                  callbackStack );
                        }
                    };

                // start the new callback series
                forkCallback( element );
            })( item[i], i );
        }
    };
});