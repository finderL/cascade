define( function(){
    /**
     * Collects a destructured list back into an array when all asynchronous calls are done
     */

    var collections = [];

    return function( item, callback, data, callbackPosition, callbackStack ){
        // ensure this item came from a list
        if( !data.hasOwnProperty('list_index') || !data.hasOwnProperty('list_length') ){
            callback( item );
        }

        // find the collection this item is associated with
        var collection;
        for( var i = 0; i < collections.length ; i++ ){
            if( collections[i].stack === callbackStack ){
                collection = collections[ i ];
                break;
            }
        }

        // if this is the first item from the collection
        if( !collection ){
            collection = {
                // this is how the collection can be identified
                stack : callbackStack
                // instantiate a new sparsely-populated array for collecting items
              , items : new Array( data.list_length )
                // track how many more items will come in
              , waiting_on : data.list_length
            };

            collections.push( collection );
        }

        // now have a collection that this item belongs to
        collection.items[ data.list_index ] = item;
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

            // call the callback with the collection
            callback( collection.items );
        }
    };
});