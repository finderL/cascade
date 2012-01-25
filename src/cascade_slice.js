define( ['util_is'], function( is ){

    /**
     * Takes an incoming array `item` and slices it according to the parameters, then passes the
     * result to the next callback
     */
    return function(){
        // clone & store args
        var params = Array.prototype.slice.call( arguments );

        // return the cascade function
        return function( item, next ){

            if( is.array( item ) ){
                // if it's an array, apply array slice
                next( Array.prototype.slice.apply( item, params ) );
            } else if( is.string( item ) ){
                // if it's a string, apply string slice
                next( String.prototype.slice.apply( item, params ) );
            } else {
                // not a slice-able item; pass everything
                arguments[ arguments.length - 1 ].apply(
                    this,
                    Array.prototype.slice.call( arguments, 0, arguments.length - 1 )
                );
            }
        };
    };

});