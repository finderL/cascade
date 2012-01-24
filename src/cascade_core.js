define( ['util_extend', 'cascade_context'], function( extend, createContext ){

    var NO_CONTEXT = this;

    function cascade( item ){
        // define the callback context and function
        // if a value of "this" is provided, use it
        var context = ( this !== NO_CONTEXT ? this :
                        createContext( Array.prototype.slice.call( arguments, 1 ) ) ),
            callback = function( async_item, extraData ){

                // default to this context if no context is provided
                var ctx = ( this === NO_CONTEXT ? context : this ),
                // transform arguments into a proper array
                    args = Array.prototype.slice.call( arguments );

                // if there are still functions in the stack, run them
                if( ctx.stackPosition < ctx.stack.length ){
                    ctx.stack[ ctx.stackPosition++ ].apply(
                        ctx,
                        Array.prototype.concat.call( args, callback )
                    );
                }
            };

        // start the callback chain
        callback.call( context, item );

    };

    // return the cascade constructor
    return cascade;
});