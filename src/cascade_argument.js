define( function(){

    /**
     * Calls the `next` function with the specified range of arguments
     */

    return function( from, to ){
        if( arguments.length === 2 ){
            // one argument (+ next), just callback with that argument
            return function(){
                arguments[ arguments.length - 1 ]( arguments[ from ] );
            }
        } else {
            return function(){
                arguments[ arguments.length - 1 ].apply(
                    this,
                    Array.prototype.slice.call( arguments, from, to )
                );
            };
        }
    };
});