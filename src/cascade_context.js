define( ['util_is'], function( is ){

    /**
     * Creates a Cascade context object
     */
    return function( stack, data /** optional **/, position /** optional **/ ){
        return {
            stack : stack
          , data : ( is.object( data ) ? data : {} )
          , stackPosition : ( is.number( position ) ? position : 0 )
        };
    };
});