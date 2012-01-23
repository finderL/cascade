define( function(){

    /**
     * Takes an array `item` and executes the remainder of the callback stack on each element
     * of the array before advancing to the next element in the array
     */
    return function( item, callback, data, currentPosition, callbackStack ){

        // current position in the array
        var queuePosition = 0,
        // current position in the callback stack
            queueCallbackPosition = currentPosition,
        // queue item specific data
            queueData = _.extend( {},
                                  data,
                                  { list_index : queuePosition, list_length : item.length } ),
        // the queue-specific callback function
            queueCallback = function( nextItem, extraData ){
                // typical callback execution
                if( queueCallbackPosition < callbackStack.length ){

                    callbackStack[ queueCallbackPosition ]( nextItem,
                                                            queueCallback,
                                                            _.extend( queueData, extraData ),
                                                            queueCallbackPosition++,
                                                            callbackStack );
                    // when the end of the callback stack is reached
                } else if ( queueCallbackPosition >= callbackStack.length ){
                    // move forward in the array `item`
                    queuePosition++;
                    // if this position exists in the item
                    if( queuePosition < item.length ){
                        // reset the counters and restart callback on next element
                        queueCallbackPosition = currentPosition;
                        queueData = _.extend( {},
                                              data,
                                              {
                                                  list_index : queuePosition,
                                                  list_length : item.length
                                              });
                        queueCallback( item[ queuePosition ] );
                    }
                }
            };

        // start the queue
        queueCallback( item[ queuePosition ], queueData );

    };

});