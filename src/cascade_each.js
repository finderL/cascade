define( ['util_is'], function( is ){

    /**
     * Applies a function to each element of an array `item`
     *
     * Callback function conforms to ECMA-262 15.4.4.18
     *  -- function( itemValue, arrayIndex, originalArray )
     * Note: No value for `thisArg` can be defined
     */
    return function( fn ){

        return function( item, next ){
            if( is.array( item ) ){
                // look through, apply function, then call back
                for( var i = 0 ; i < item.length ; i++ ){
                    fn( item[ i ], i, item );
                }
            } else {
                // not an array, then apply the function to the item directly
                fn( item, null, null );
            }
            // finally, call out the original, unmodified item
            next( item );
        };
    };
});