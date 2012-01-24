define( ['cascade_core', 'cascade_context'], function( cascade, createContext ){
    /**
     * Collects a destructured list back into an array when all asynchronous calls are done
     */

    var collections = [];

    return function( item, next ){
        // ensure this item came from a list; if not, just skip
        if( ! this.data.hasOwnProperty('list_index') || ! this.data.hasOwnProperty('list_length') ){
            return next( item );
        }

        // find the collection this item is associated with
        var collection;
        for( var i = 0 ; i < collections.length ; i++ ){
            if( collections[i].stack === this.stack ){
                collection = collections[i];
            }
        }

        // if no collection can be found, this item is the first; process appropriately
        if( !collection ){
            collection = {
                // identify the stack
                stack : this.stack
                // instantiate a sparsely-populated array for collecting items
              , items : new Array( this.data.list_length )
                // remaining items
              , waiting_on : this.data.list_length
                // the remaining stack to execute
              , resumeStack : this.stack.splice( this.stackPosition, this.stack.length - this.stackPosition + 1 )
            };

            collections.push( collection );
        }

        // the item has reached the end of it's callback stack; call the callback once more
        // in case there is any cleanup in the callback for stack-completion
        next( item );

        // now have a collection that this item belongs to
        collection.items[ this.data.list_index ] = item;
        collection.waiting_on--;

        // if we've collected all items, continue
        if( collection.waiting_on === 0 ){
            // remove this collection
            for( i = 0 ; i < collections.length ; i++ ){
                if( collections[i] === collection ){
                    collections.splice(i, 1);
                    break;
                }
            }

            // start a new cascade
            cascade.call(
                createContext( collection.resumeStack ),
                collection.items
            );
        }
    };
});