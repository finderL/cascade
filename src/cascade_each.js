define( ['util_is'], function( is ){

    /**
     * Applies a function to each element of an array `item`
     */
    return function( fn ){

        return function( item, callback ){
            if( ! is.array( item ) ){
                // not an array, then apply the function to the item directly
                fn( item, null, null );
            } else {
                // look through, apply function, then call back
                for( var i = 0 ; i < item.length ; i++ ){
                    fn( item[ i ], i, item );
                }
            }
            // finally, call out the original, unmodified item
            callback( item );
        };
    };
});