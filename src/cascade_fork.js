define( ['util_extend', 'util_is', 'cascade_core', 'cascade_context'], function( extend, is, cascade, createContext ){

    /**
     * Forks an incoming list into separate series of callbacks for each item
     */
    return function( array, next ){
        // if `array` is not an array, just invoke the callback
        if( ! is.array( array ) ){ next( array ); return; }

        var context = this,
        // after forking, all of the remaining items
            forkStack = context.stack.splice( context.stackPosition, context.stack.length );
        // iterate through the elements of the array
        for( var i = 0 ; i < array.length ; i++ ){
            (function (element, index) {
                cascade.call(
                    createContext(
                        forkStack,
                        extend({}, context.data, {list_index: index, list_length: array.length })
                    ),
                    element
                );
                /*
                var forkContext = createContext( context.stack,
                                                 extend( {},
                                                         context.data,
                                                         { list_index : index,
                                                           list_length : array.length }
                                                       ),
                                                 context.stackPosition
                                               );

                next.call( forkContext, element );
                 */
            })( array[i], i );
        }
    };
    /*
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
     */
});