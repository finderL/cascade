define( ['util_is'], function( is ){

    /**
     * Applies a function to each element of an array `item`
     *
     * Callback function conforms to ECMA-262 15.4.4.18
     *  -- function( itemValue, arrayIndex, originalArray )
     * Note: No value for `thisArg` can be defined; it always uses the cascade context
     */
    return function( fn ){

        return function(){
            // determine the list
            var list = ( arguments.length === 2 && is.array( arguments[0] ) ? arguments[0] :
                         Array.prototype.slice.call( arguments, 0, arguments.length - 1 ) );

            // iterate & call
            for( var i = 0 ; i < list.length ; i++ ){
                fn.call( this, list[ i ], i, list );
            }

            // next
            arguments[ arguments.length - 1 ].apply(
                this,
                Array.prototype.slice.call( arguments, 0, arguments.length - 1 )
            );
        };
    };
});