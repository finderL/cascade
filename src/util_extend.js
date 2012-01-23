define( function(){

    var toString = Object.prototype.toString,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        isArray = function( a ){ return toString.call( a ) === '[object Array]'; },
        isObject = function( o ){ return toString.call( o ) === '[object Object]'; };

    return function extend( target ){
        // local vars
        var copy;
        // loop through the rest of the arguments
        for( var i = 1, srcLen = arguments.length ; i < srcLen ; i++ ){
            // copy over all the properties from that object onto the target
            for( var prop in arguments[ i ] ){
                // ignore prototype properties
                if( ! hasOwnProperty.call( arguments[ i ], prop ) ){ continue; }

                copy = arguments[ i ][ prop ];

                // ignore circular references
                if( copy === target ){ continue; }
                // ignore undefined values
                else if( copy === undefined ){ continue; }

                // deep copy arrays and objects
                if( isArray( copy ) ){
                    target[ prop ] = extend( isArray( target[ prop ] ) ? target[ prop ] : [], copy );
                } else if( isObject( copy ) ){
                    target[ prop ] = extend( isObject( target[ prop ] ) ? target[ prop ] : {}, copy);
                } else {
                    target[ prop ] = copy;
                }
            }
        }

        return target;
    };
});