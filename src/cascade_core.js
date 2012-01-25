define( ['util_extend', 'util_is', 'cascade_context'], function( extend, is, createContext ){

    var NO_CONTEXT = this;

    function cascade( item ){
        // find where the default arguments end and the stack begins
        for( var i = 1 ; i < arguments.length ; i++ ){
            if( is.func( arguments[i] ) ) { break; }
        }

        // define the callback context and function
        // if a value of "this" is provided, use it
        var context = ( is.validContext( this ) && this !== NO_CONTEXT ? this :
                        createContext( Array.prototype.slice.call( arguments, i ) ) ),
            next = function(){

                // default to this context if no context is provided
                var ctx = ( is.validContext( this ) && this !== NO_CONTEXT ? this : context ),
                // transform arguments into a proper array
                    args = Array.prototype.slice.call( arguments, 0 );

                // if there are still functions in the stack, run them
                if( ctx.stackPosition < ctx.stack.length ){
                    ctx.stack[ ctx.stackPosition++ ].apply(
                        ctx,
                        args.concat( next )
                    );
                }
            };

        // start the callback chain
        next.apply( context,
                    Array.prototype.slice.call( arguments, 0, i )
                  );

    };

    // return the cascade constructor
    return cascade;
});