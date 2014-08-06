# dt-utils

### Installation
    $ npm install dt-utils

### Usage
    var $ = require('dt-utils');
    $.each([1,2,3], function(item, index){
      console.log(item, index); // [1,0]; [2,1]; [3,2];
    });

### API

#### #each

This should call a function for every element of an array.

##### Example:
    
    var out = [];
    $.each(['a', 'b', 'c'], function(item, index) {
      out.push(index);
    });
    console.log(out); logs as [0,1,2]

#### #map

This should call a function (that returns a result) for every element of an array (or object) and return an array of values.

##### Example:
    
    // map an array
    $.map(['a', 'b', 'c'], function(item){
      return item;  // returns ['a','b','c']
    });
    
    // map an object
    $.map({a: 'a', b: 'b', c: 'c'}, function(value, key) {
      return value; //returns ['a', 'b', 'c']
    });


#### #filter

This should call a function (that returns true or false) for every element of an array and return only element of the array for whom function returned true.

##### Example:
    $.filter([1,2,3,4,5], function(item) {
      return item % 2 === 1; //returns [1,3,5]
    });

#### #asyncMap

This should asynchroniously call a function for every element of the array

##### Example:
    $.asyncMap([1,2,3,4,5,6], function(item, callback){
      callback(item);
    });

#### #parallel

This should asynchroniously call a function for every element of the array in parallel.

##### Example:
    $.parallel([1,2,3,4,5,6], function(item, callback){
      callback(item);
    });

#### #concurrentMap

This should concurrently call a function for every element of the array in parallel.

##### Example:
    $.concurrentMap([1,2,3,4,5,6], 2, function(item, callback){
      callback(item);
    });

### License
MIT

