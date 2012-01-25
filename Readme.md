# Cascade : a Node.js module for asynchronous callback chains

Cascade aims to simplify the callback chains promoted by Node's event-driven styles by declaring sequences of callbacks; instead of nesting multiple callbacks in various asynchronous functions, a call to `cascade( item, func1, func2 );` will automatically pass `item` to `func1`, then pass the callback result of `func1` to `func2`, and so on.

Compare the following two examples; the first is directly from Node.js (v 0.6.8) documentation, and the second is the same function written with Cascade:

```javascript
/** Node.js Documentation, http://nodejs.org/docs/v0.6.8/api/fs.html#file_System **/
fs.rename('/tmp/hello', '/tmp/world', function (err) {
  if (err) throw err;
  fs.stat('/tmp/world', function (err, stats) {
    if (err) throw err;
    console.log('stats: ' + JSON.stringify(stats));
  });
});
```

```javascript
/** With Cascade.js **/
cascade( '/tmp/hello', '/tmp/world',
         cascade.chain( fs.rename ),  // invoke fs.rename( '/tmp/hello', '/tmp/world', next )
         cascade.raise,               // throw an error if fs.rename calls next with an Error
         cascade.rearrange(2),        // rearrange the arguments to [ '/tmp/world' ] for fs.stat
         fs.stat,                     // invoke fs.stat( '/tmp/world' )
         cascade.raise,               // throw an error if fs.stat calls next with an Error
         function (noerr, stats) {    // log the file stats
             console.log('stats: ' + JSON.stringify(stats));
         }
       );
```

Or an example from the Mongoose ODM:

```javascript
/** Mongoose.js, http://mongoosejs.com/docs/embedded-documents.html **/
BlogPost.findById(myId, function (err, post) {
  if (!err) {
    post.comments[0].remove();
    post.save(function (err) {
      // do something
    });
  }
});
```

```javascript
/** With Cascade.js **/
cascade( myId,
         BlogPost.findById,                // invoke BlogPost.findById( myId, next )
         cascade.raise,                    // throw an error if BlogPost.findById calls next with an Error
         function (noerr, post, next) {    // custom handler for a post
             post.comments[0].remove();
             post.save( next )             // Invert control - pass next to an asynchronous function as a
         },                                //        callback and resume right where the sequence left off
         function (err) {                  // this replaces the handler in the post.save() call
             // do something
         }
       );
```

As asynchronous callbacks become more deeply nested, the advantage of Cascade.js becomes more apparent. Several builtin functions in Cascade also take advantage of the event-driven model of Node.js; `cascade.fork`, `cascade.queue`, and `cascade.join` provide a simple way to manage asynchronous callback sequences. Other functions allow simple manipulations to transform the callout data from one function into the correct arguments for the next. Below is a complete function reference for Cascade.js.

## Documentation

Cascade is invoked via `cascade( value, [value2, ...], callback, [callback2, ...] );`. The values specified in the initializer will be passed as arguments to the first `callback`; subsequent callbacks will be invoked with the arguments called out by the prior callback function.

Terminology:
 - Callback : the function invoked by Cascade
 - Callin / Call in : the arguments passed to the callback function (shortened to `args...`)
 - Callout / Call out : the arguments passed to the callout function

## Methods

==========

**chain**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.chain( function( args..., callback ) )`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: args..., next*
   
Wraps the specified `function` in a Cascade-friendly function. The wrapped function will be invoked with the callin arguments `args...`. 

Calls out: the callouts from the specified `function` prepended to `args...`.

(Note: if the wrapped function does not accept an asynchronous callback as the last parameter, cascade.chain will fail)

> ```javascript
cascade( 2, 3, 4,
         function( val1, val2, val3, next ){
             next( 1 );
         },
         callout );
         // callout receives arguments : 1, 2, 3, 4
```

---

**each**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.each( function( item, index, array ) )`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: args..., next*

Invokes the specified `function` on each callin argument. If the only argument is an array, then the `function` is instead invoked on each element in the array.

Calls out: the callin arguments, unless they were modified by `function`.

> ```javascript
cascade( 'one', 'two', 'three',
         cascade.each( function(s){
             console.log( s );
         }),
         callout
       );
       // console: 
       //          one
       //          two
       //          three
       // callout receives arguments : 'one', 'two', 'three'
```

---

**filter**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.filter( function( item, index, array ) )`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: args..., next*

Invokes the specified `function` on each argument, assembling a new argument list to call out. If the only argument is an array, the `function` is instead applied to that array. Only arguments returning `true` from `function` are inserted into the new argument array.

Calls out: the arguments that returned true from `function`, or a filtered array if the only argument was an array.

> ```javascript
cascade( 1, 2, 3, 4, 5, 6,
         cascade.filter( function(i){
             return ( i % 2 === 0 );  // return 'true' for even numbers
         }),
         callout
       );
       // callout receives arguments : 2, 4, 6
```

---

**fork**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.fork`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: Array, next*

Begins a new cascade for each element of `Array`. If the remaining cascade has asynchronous functions, all elements will pass through the cascade until the asynchronous functions are reached, at which point execution will defer until all synchronous callbacks have resolved. If the remaining cascade contains no asynchronous functions, `fork` is indistinguishable from `queue`.

Calls out: each element of `Array` individually

> ```javascript
cascade( [ 'file1', 'file2', 'file3' ],
		 cascade.fork,
		 fs.stat,
		 function( err, stat ){
		     console.log( stat );
		 }
	   );
	   // console:
	   //          [[ stats from first fs.stat to finish ]]
	   //          [[ stats from second fs.stat to finish ]]
	   //		   [[ stats from third fs.stat to finish ]]
	   // (not necessarily in order file1, file2, file3)
```

---

**join**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.join`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: value, next*

Reassembles a destructured array (via `cascade.fork` or `cascade.queue`) using values called out from the previous callback. All elements from a destructured array are required to complete before `cascade.join` calls out. The reassembled array is composed of the callin `value` at the original position in the array.

Calls out: the reassembled array composed of callout values from the prior callback function, only after all elements are received

(Note: Only one value can be passed to cascade.join; multiple arguments will cause the cascade to fail)
(Note: All elements are required to complete; failure to do so will halt the cascade at the `cascade.join` call)

> ```javascript
cascade( [ 'file1', 'file2', 'file3' ],
		 cascade.fork,
		 fs.stat,
		 cascade.rearrange( 1 ),       // move the second callout argument `stat` to the first position
		 cascade.join,
		 callout
	   );
	   // callout receives arguments : [[ stats for file1 ]], [[ stats for file2 ]], [[ stats for file3 ]]
```

---

**map**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.map( function( item, index, array ) )`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: args..., next*

Invokes the specified `function` on each argument, assembling a new argument list to call out. The newly assembled argument list is composed of the return values from `function` for each element of the original argument list. If the only argument is an array, the `function` is instead applied to that array.

Calls out: the return values from `function` applied to each argument, or the mapped array if the only argument was an array.

> ```javascript
cascade( 1, 2, 3, 4, 5, 6,
         cascade.map( function(i){
             return ( i % 2 === 0 ? 'even' : 'odd' );
         }),
         callout
       );
       // callout receives arguments : 'odd', 'even', 'odd', 'even', 'odd', 'even'
```

---

**queue**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.queue`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: Array, next*

Serializes the `Array` cascade by invoking the full callback sequence on each element before proceeding to the next element of `Array`. Whereas `cascade.fork` parallelizes calls by giving precedence to returning asynchronous functions on a "first come, first served" basis, `cascade.queue` enforces completion on each element in the queue before proceeding to the next element.

> ```javascript
cascade( [ 400, 300, 200, 100 ],
		 cascade.queue,
		 function( ms, next ){
		     setTimeout( function(){
			     console.log( ms );
				 next( ms );          // cascade.queue requires callouts to continue execution
			 }, ms );
	     }
       );
	   // console:
	   //          400
	   // 		   300
	   // 		   200
	   // 		   100
	   // Compare to cascade.fork : the first returning call would be 100, not 400, and would
	   // have resulted in a reversed console output.
```

---

**raise**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.raise`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: args..., next*

Raises an error if the first argument is an `Error` object; otherwise, calls out all arguments.

Calls out: all callin arguments

> ```javascript
cascade( 'error message',
		 function( m, next ){
		     next( Error(m) );
	     },
		 cascade.raise        // throws Error: "error message"
	   );

cascade( 'error message',
		 function( m, next ){
		     setTimeout( function(){
			     next( Error(m) );
		     }, 100 );
		 },
		 cascade.raise( errorHandler ) // async error functions require a tailored handler,
		 							   // since thrown errors are outside the current context
```

---

**rearrange**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.rearrange( i, j, k, ... )`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: args..., next*

Rearranges callin arguments into a different arrangement of callout arguments. Callin values (`i`, `j`, `k`, etc.) represent indices in the callin argument list to replace at that position.

Calls out: arguments as defined by the index parameters

> ```javascript
cascade( 1, 2, 3, 4, 5,
		 cascade.rearrange( 3, 1, 2 ),  // pluck the [3], [1], and [2] indices from callin arguments
		 callout
	   );
	   // callout receives arguments : 4, 2, 3
```

---

**slice**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.slice( start, [end] )`&nbsp;&nbsp;&nbsp;&nbsp;*Accepts: args..., next*

Slices the callin arguments using the specified start and end positions. If the only argument is an array, the slice is applied to that array instead.

Calls out: the sliced callin arguments, or the sliced array argument if the only argument was an array.

> ```javascript
cascade( 1, 2, 3, 4, 5,
		 cascade.slice( 2, 3 ),
		 callout
	   );
	   // callout receives arguments : 3, 4
```
