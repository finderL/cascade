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

**chain**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.chain( function( args..., callback ) )`
   
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

----------
**each**&nbsp;&nbsp;&nbsp;&nbsp;`cascade.each( function( item, index, array ) )`

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

**filter** *(function)*

> Invokes the specified `function` on each argument, assembling a new argument list to call out. If the only argument is an array, the `function` is instead applied to that array. Calls out the arguments that returned true from `function`, or a filtered array if the only argument was an array.

**fork**

> Begins a new cascade for each element

<table>
  <tr>
    <th>fork</th>
  </tr>
  <tr>
    <td>Accepts: <code>Array, nextFn</code></td>
  </tr>
  <tr><td>Callout: <code>elementInArray</code></td></tr>
  <tr>
     <td>Begins a new cascade for each element of `Array`. If the remaining cascade has asynchronous functions, all elements will pass through the cascade until the asynchronous functions are reached, at which point execution will defer until all synchronous callbacks have resolved. If the remaining cascade contains no asynchronous functions, `fork` is indistinguishable from `queue`.</td>
  </tr>
</table>