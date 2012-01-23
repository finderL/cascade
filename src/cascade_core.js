define( ['util_extend'], function( extend ){

    function cascade( item ){
        // define the callback parameters and function
        var callbackStack = Array.prototype.slice.call( arguments, 1 ),
            curCallback = 0,
            data = {},
            callback = function( async_item, extraData ){
                if( curCallback < callbackStack.length ){

                    callbackStack[ curCallback++ ]( async_item,
                                                    callback,
                                                    extend( data, extraData ),
                                                    curCallback,
                                                    callbackStack );
                }
            };

        // start the callback chain
        callback( item );

    };

    // return the cascade constructor
    return cascade;
});