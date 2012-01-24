define( function(){

    /**
     * Allows cascade chain-unfriendly functions to invoke a `next`
     * function that passes the original arguments to the next function
     */
    return function( func ){

        return function(){

            var args = Array.prototype.slice.call( arguments, 0, arguments.length - 1 ),
                next = arguments[ arguments.length - 1 ],
                context = this,
                surrogateNext = function(){
                    // invoke next with the arguments to this surrogate prepended to the list
                    next.apply(
                        context,
                        Array.prototype.slice.call( arguments, 0 ).concat( args )
                    );
                }

            // invoke the function with the surrogate next
            func.apply(
                context,
                args.concat( surrogateNext )
            );

        }
    };
});