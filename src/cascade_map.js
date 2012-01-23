define( ['util_is'], function( is ){

    /**
     * Map translates an incoming array into a different outgoing array
     */
    return function( fn ){

        return function( item, callback ){
            // if it's not an array, just pass the transformed value through
            if( ! is.array( item ) ){ callback( fn(item) ); }

            // otherwise, generate a new array
            var mapped = [];
            for( var i = 0 ; i < item.length ; i++ ){
                mapped[i] = fn( item[i], i, item );
            }

            // pass the mapped array out
            callback( mapped );
        };

    };
});