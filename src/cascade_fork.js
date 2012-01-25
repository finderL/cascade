define( ['util_extend', 'util_is', 'cascade_core', 'cascade_context'], function( extend, is, cascade, createContext ){

    /**
     * Forks an incoming list into separate series of callbacks for each item
     */
    return function( array, next ){
        // if `array` is not an array, just invoke the callback
        if( ! is.array( array ) ){ next( array ); return; }

        var context = this,
        // after forking, all of the remaining items
            forkStack = context.stack.splice( context.stackPosition, context.stack.length ),
        // reusable variable for data
            data;
        // iterate through the elements of the array
        for( var i = 0 ; i < array.length ; i++ ){
            // preserve referential integrity to list context
            data = extend( {}, context.data, { list_index : i,
                                               list_length : array.length } );
            data.list_context = context;

            cascade.call(
                createContext(
                    forkStack,
                    data
                ),
                array[ i ]
            );
        }
    };
});