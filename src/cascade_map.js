define( ['util_is'], function( is ){

    /**
     * Map translates an incoming array into a different outgoing array
     *
     * Callback function conforms to ECMA-262 15.4.4.9
     *  -- function( itemValue, arrayIndex, originalArray )
     * Note: No value for `thisArg` can be defined; it always uses the cascade context
     */
    return function( fn ){

        return function( item, next ){
            // if only an array is passed (+ callback), map each item in the array
            if( is.array( item ) && arguments.length === 2 ){

                // otherwise, generate a new array
                var mapped = [];
                for( var i = 0 ; i < item.length ; i++ ){
                    mapped[i] = fn.call( this, item[i], i, item );
                }

                // pass this one out
                next( mapped );
            } else {
                // map each argument and call the next function correctly
                var mapped = [], args = Array.prototype.slice.call( arguments, 0, arguments.length - 1);
                for( var i = 0 ; i < arguments.length - 1 ; i++ ){
                    mapped[i] = fn.call( this, arguments[i], i, args );
                }

                arguments[ arguments.length - 1 ].apply(
                    this,
                    mapped
                );
            }
        };

    };
});