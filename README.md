# object-pool #

A generic object pool which you can use for reducing object allocations when
you're creating and removing lots of objects in quick succession. Or just to
recycle objects, which is handy in cases such as game development.

## Installation ##

``` javascript
npm install object-pool
```

## Usage ##

### `pool = require('object-pool')([options])` ###

Creates a new object pool, taking the following arguments:

* `init`: a factory method which should return a freshly created object.
* `initSize`: a number to specify the initial size of reserved objects in the pool
* `enable`: called on an object when it's added to the pool.
* `disable`: called on an object when it's being removed from the pool.
* `key`: this module stores a reference to each node on each object. Use
  this option to change the key it uses. Defaults to `__pool_node__`.

### `pool.create()` ###

Returns a fresh object from the pool. If there aren't any objects left in the
reserve, this will call `init` to create a new object and then `enable` on
the object to get it set up. Otherwise, this will retrieve an object from the
reserve and just call `enable` on it.

### `pool.remove(object)` ###

Removes an object from the pool, adding it to a reserve list to use later and
calling `disable` on it.

### `pool.clean()` ###

Empties the "reserve" list of leftover objects.
