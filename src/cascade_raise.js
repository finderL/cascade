define( function(){

    /**
     * Throws an error if the first argument is an Error
     */
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
});