define( ['util_is'], function( is ){

    /**
     * Filters an incoming list based on the supplied function
     *
     * Callback function conforms to ECMA-262 15.4.4.20
     *  -- function( itemValue, arrayIndex, originalArray )
     * Note: No value for `thisArg` can be defined
     */
    return function( fn ){

        return function( item, callback ){
            // if it's not an array, there's nothing to filter
            if( ! is.array( item ) ){ callback( item ); }

            // filter the incoming array
            var filtered = [];
            for( var i = 0 ; i < item.length ; i++ ){
                if( !! fn( item[ i ], i, item ) === true ){
                    filtered.push( item[ i ] );
                }
            }

            // carry on with the filtered array
            callback( filtered );
        };
    };
});