define( function(){
    var toString = Object.prototype.toString,
        hasProperty = Object.prototype.hasOwnProperty;

    return {
        array : function( o ){ return toString.call( o ) === '[object Array]'; },
        string: function( o ){ return toString.call( o ) === '[object String]'; },
        number: function( o ){ return toString.call( o ) === '[object Number]'; },
        object: function( o ){ return toString.call( o ) === '[object Object]'; },
        func  : function( o ){ return toString.call( o ) === '[object Function]';},
        error : function( o ){ return toString.call( o ) === '[object Error]';},
        validContext : function( o ){
            return hasProperty.call( o, 'stack' ) &&
                hasProperty.call( o, 'stackPosition' ) &&
                hasProperty.call( o, 'data' );
        }
    };
});