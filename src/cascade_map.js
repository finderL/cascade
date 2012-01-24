define( ['util_is'], function( is ){

    /**
     * Map translates an incoming array into a different outgoing array
     *
     * Callback function conforms to ECMA-262 15.4.4.9
     *  -- function( itemValue, arrayIndex, originalArray )
     * Note: No value for `thisArg` can be defined
     */
    return function( fn ){

        return function( item, next ){
            // if it's not an array, just pass the transformed value through
            if( is.array( item ) ){

                // otherwise, generate a new array
                var mapped = [];
                for( var i = 0 ; i < item.length ; i++ ){
                    mapped[i] = fn( item[i], i, item );
                }

                // pass this one out
                next( mapped );
            } else {
                next( fn(item, null, null) );
            }
        };

    };
});