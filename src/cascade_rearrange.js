define( function(){

    /**
     * Calls the `next` function with the specified arguments juxtaposed into the positions
     */

    return function(){
        var args = Array.prototype.slice.call( arguments );

        return function(){
            // juxtapose argument indices to the correct location
            var outArgs = new Array( args.length );
            for( var i = 0 ; i < outArgs.length ; i++ ){
                outArgs[ i ] = arguments[ args[i] ];
            }

            // call out with the newly generated argument list
            arguments[ arguments.length - 1 ].apply(
                this,
                outArgs
            );
        };
    };
});