define( ['util_extend', 'util_is', 'cascade_context'], function( extend, is, createContext ){

    /**
     * Takes an array `item` and executes the remainder of the callback stack on each element
     * of the array before advancing to the next element in the array
     */
    var NO_CONTEXT = this;

    return function( item, next ){
        if( ! is.array( item ) ){ return next( item ); }

        // need to replace the callback
        var context = this,
            currentContext = this,
            queuePosition = -1,
            originalStackPosition = context.stackPosition;

        // default to starting the queue
        context.stackPosition = context.stack.length;

        var queueCallback = function(){
            var ctx = ( this === NO_CONTEXT ? currentContext : this ),
            // arguments -> array
                args = Array.prototype.slice.call( arguments );

            // if at the end of the stack, reset the counter and move to the next item
            if( ctx.stackPosition >= ctx.stack.length ){
                // move forward in the queue
                queuePosition++;
                // if the queue is complete, just return
                if( queuePosition >= item.length ){ return; }
                // modify the context to prevent list_* overlapping
                currentContext = ctx = createContext(
                    context.stack,
                    extend( {}, context.data, { list_index : queuePosition, list_length : item.length } ),
                    originalStackPosition );

                // set the arguments to the correct value
                args = [ item[ queuePosition ] ];
            }

            if( ctx.stackPosition < ctx.stack.length ){
                // still something left in the stack; run it
                ctx.stack[ ctx.stackPosition++ ].apply(
                    ctx,
                    args.concat( queueCallback )
                );
            }
        };

        return queueCallback( item[ queuePosition ] );
    };

});