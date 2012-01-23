define( ['util_is'], function( is ){

    /**
     * Takes an incoming array `item` and slices it according to the parameters, then passes the
     * result to the next callback
     */
    return function(){
        // clone & store args
        var args = Array.prototype.slice.call( arguments );

        // return the cascade function
        return function( item, callback ){

            if( is.array( item ) ){
                // if it's an array, apply array slice
                callback( Array.prototype.slice.apply( item, args ) );
            } else if( is.string( item ) ){
                // if it's a string, apply string slice
                callback( String.prototype.slice.apply( item, args ) );
            } else {
                // not a slice-able item
                callback( item );
            }
        };
    };

});