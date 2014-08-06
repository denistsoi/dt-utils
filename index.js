
var $ = {};

$.each = function(arr, fn) {
  if (Array.isArray(arr)) {
    for(var i=0; i< arr.length; i++){
      fn(arr[i],i);
    }
  } else {
    var keys = Object.keys(arr);
    for(var i=0; i< keys.length; i++){
      var key = keys[i];
      fn(arr[key],key);
    }
  }
}

$.map = function(arr, fn){
  var out = []
  

  if (Array.isArray(arr)) {
    for(var i=0; i< arr.length; i++){
      out.push(fn(arr[i],i));
    }
    return out;  
  } else {
    var keys = Object.keys(arr);
    for(var i=0; i< keys.length; i++){
      var key = keys[i];
      out.push(fn(arr[key],key));
    }
    return out;
  }
}

$.filter = function(arr, fn){
  var out = [];

  if (Array.isArray(arr)) {
    for(var i=0; i< arr.length; i++){
      if (fn(arr[i],i )) {
        out.push(arr[i]);
      } 
    }
    return out;  
  } else {
    var keys = Object.keys(arr);
    for(var i=0; i< keys.length; i++){
      var key = keys[i];
      if (fn(arr[key],key)) {
        out.push(arr[key])
      } 
    }
    return out;
  }
}

$.asyncMap = function(arr, fn) {
  var index = 0;
  var out = [];
  var _callback;
  var finished = false;

  if (arr.length == 0){
    finished = true;
  }
  var next = function(result){
    index++;
    out.push(result);
    if (index >= arr.length){
      if (_callback){
        _callback(out);  
      } else {
        finished = true;
      }
    } else {
      fn(arr[index], next);
    }
  }
  if ( !finished ){
    fn(arr[index], next);
  };
  return {then: function(callback){
    _callback = callback;
    if (finished){
      _callback(out);
    }
  }};
}

$.parallel = function(arr, fn){
  var out = [];
  var _callback;
  var finished = false;
  var length = arr.length;

  if (arr.length == 0) {
    finished = true;
  }

  for(var i=0; i<arr.length; i++){
    fn(arr[i], function(result){
      out.push(result);
      length--;
      if (length == 0){
        if (_callback){
          _callback(out);  
        } else {
          finished = true;
        }
      }
    })
  }

  return {then: function(callback){
    _callback = callback;
    if (finished){
      _callback(out);
    }
  }}
}

$.concurrentMap = function(arr, concurrency, fn){
  var out = [];
  var _callback;
  var finished = false;
  var length = Math.min(concurrency, arr.length);
  var complete = 0;
  var queue = [];

  if (arr.length == 0) {
    finished = true;
  }

  function populate(item) {

    queue.push(function(cb) {
      fn(item, function(result) {
        out.push(result);
        
        complete++;
        if (complete >= arr.length) {
          if (_callback){
            _callback(out);  
          } else {
            finished = true;
          }
        } else {
          cb();
        }
      });
    })
  }

  function next() {
    if (queue.length) {
      queue.shift()(next);
    }
  }

  for(var i = 0; i < arr.length; i++) {
    populate(arr[i]);
  }

  for (var j = 0; j < length; j++) {
    next();
  }

  return {then: function(callback){
    _callback = callback;
    if (finished){
      _callback(out);
    }
  }}
}

exports = module.exports = $;