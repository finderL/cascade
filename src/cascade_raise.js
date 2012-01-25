define( ['util_is'], function( is ){

    /**
     * Throws an error if the first argument is an Error
     */
    var defaultHandler = function( err ){
        // default behavior : throw the error
        throw err;
    };

    return function( handler, shiftArgs ){
        // multiple function signatures

        // if handler is a function and shiftArgs is absent
        // or if handler is a function and shiftArgs is a number
        // or if handler is null and shiftArgs is a number
        if( ( arguments.length === 1 && is.func( handler ) ) ||
            ( arguments.length === 2 && is.func( handler ) && is.number( shiftArgs ) ) ||
            ( arguments.length === 2 && handler === null && is.number( shiftArgs ) )
          ){
            // default the handler
            handler = handler || defaultHandler;
            // default the shiftArgs
            shiftArgs = is.number( shiftArgs ) ? shiftArgs : 1;

            // return a handler callback that shifts arguments as appropriate
            return function( err ){
                // if the first argument is an error
                if( is.error( err ) ){
                    // send it to the handler
                    handler.apply( this, Array.prototype.slice.call( arguments ) );
                } else {
                    // otherwise, call the next function with the same arguments, shifted
                    arguments[ arguments.length - 1 ].apply(
                        this,
                        Array.prototype.slice.call( arguments, shiftArgs, arguments.length - 1 )
                    );
                }
            }
        } else {
            // non-invoked callback in cascade chain - watch for errors, continue otherwise
            if( is.error( arguments[0] ) ){
                // default behavior : throw the error
                throw arguments[0];
            } else {
                // continue
                arguments[ arguments.length - 1 ].apply(
                    this,
                    Array.prototype.slice.call( arguments, 1, arguments.length - 1 )
                );
            }
        }
    };
    /*
    return function( err ){
        if( err instanceof Error ){
            // first argument is an error? throw it
            throw err;
        } else {
            // otherwise, invoke next with the arguments (pass through)
            arguments[ arguments.length - 1 ].apply(
                this,
                Array.prototype.slice.call( arguments, 0, arguments.length - 1 )
            );
        }
    };
     */
});