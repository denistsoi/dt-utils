var should = require('chai').should();

describe('$', function() {

  before(function() {
    this.$  = require('./');
  });

  describe('#each', function(){

    it('should call a function for every element of an array', function() {
      var index = 0;
      var arr = ['a', 'b', 'c'];
      var out = [];
      this.$.each(arr, function(item) {
        arr[index].should.equal(item);
        out.push(item);
        index++;
      });
      index.should.equal(arr.length); // basically, have to run 3 times
      out.should.deep.equal(['a', 'b', 'c']);
    });

    it('should pass index along with the element', function() {
      var out = [];
      this.$.each(['a', 'b', 'c'], function(item, index) {
        out.push(index);
      });
      out.should.deep.equal([0,1,2]);
    });

    it('should iterate over object keys', function() {
      var out = [];
      this.$.each({a: 'a', b: 'b', c: 'c'}, function(value, key) {
        out.push(value);
        out.push(key);
      });

      out.should.deep.equal(['a','a','b','b','c','c']);
    });
  });

  describe('#map', function() {
    it('should call a function (that returns a result) for every element of an array and return an array of values', function() {
      /**
       * Example: 
       *   var out = $.map([1,2,3], function(item){  return item * 2; });
       *   out.should.deep.equal([2,4,6]);
       */
       var arr = ['a', 'b', 'c'];

       var out = this.$.map(arr, function(item) {
          return item + '!';
       });

       arr.should.deep.equal(['a', 'b', 'c']);
       out.should.deep.equal(['a!', 'b!', 'c!']);
    });

    it('should pass index along with the element', function() {
      
      var out = this.$.map(['a', 'b', 'c'], function(item, index) {
        return item + index;
      });

      out.should.deep.equal(['a0','b1','c2']);
    });

    it('should iterate over object keys', function() {
      
      var out = this.$.map({a: 'a', b: 'b', c: 'c'}, function(value, key) {
        return value;
      });

      out.should.deep.equal(['a','b','c']);
    });
  });

  describe('#filter', function() {

    it('should call a function (that returns true or false) for every element of an array and return only element of the array for whom function returned true', function() {
      /**
       * Example:
       *  var even = $.filter([1,2,3], function(item) {
       *    return item % 2 === 0; // modulus
       *  });
       *  even.should.deep.equal([2]);
       */ 
       var odd = this.$.filter([1,2,3,4,5], function(item) {
         return item % 2 === 1;
       });
       odd.should.deep.equal([1,3,5]);
    });

    it('should pass index along with the element', function() {
      
      var oddIndexed = this.$.filter(['a', 'b', 'c'], function(item, index) {
        return index % 2 === 0;
      });

      oddIndexed.should.deep.equal(['a','c']);
    });

    it('should iterate over object keys', function() {
      
      var out = this.$.filter({a: 1, b: 2, c: 3}, function(value, key) {
        return value % 2 === 1;
      });

      out.should.deep.equal([1,3]);
    });    
  });

  describe('#asyncMap', function() {
    it('should asynchroniously call a function for every element of the array', function(done) {
      this.$.asyncMap([1,2,3], function(item, callback) {
        setTimeout(function(){
          callback(item * 2);
        }, 100);
      }).then(function(results) {
        results.should.deep.equal([2,4,6]);
        done();
      });
    });
  });

  describe('#parallel', function() {
    it('should asynchroniously call a function for every element of the array in parallel', function(done) {
      this.$.parallel([1,2,3], function(item, callback) {
        setTimeout(function(){
          callback(item * 2);
        }, 100);
      }).then(function(results) {
        results.should.deep.equal([2,4,6]);
        done();
      });
    });
  });  

  describe('#concurrentMap', function() {
    it('should concurrently call a function for every element of the array in parallel', function(done) {
      this.$.concurrentMap([1,2,3,4,5,6,7,8], 2, function(item, callback) {
        setTimeout(function(){
          callback(item * 2);
        }, 100);
      }).then(function(results) {
        results.should.deep.equal([2,4,6,8,10,12,14,16]);
        done();
      });
    });
  });



  describe('#events', function(){
    it('should add a listener to an event', function(){
      this.handler = function(){
        console.log('Hello');
      };
      this.$.events.on('Hello', this.handler, this);
      this.$.events._listeners.should.be.an('object');
      this.$.events._listeners['Hello'].should.be.an('array');
      this.$.events._listeners['Hello'].should.have.length(1);
      this.$.events._listeners['Hello'][0].callback.should.be.a('function');
      this.$.events._listeners['Hello'][0].ctx.should.be.an('object');
    });

    it('should trigger an event', function(done){
      this.handler2 = function(){
        done();
      };
      this.$.events.on('Goodbye', this.handler2, this);
      this.$.events.emit('Goodbye');
    });

    it('should trigger an event with arguments', function(done){
      this.$.events.on('Greeting', function(greeting){
        greeting.should.equal('Good Afternoon');
        done();
      }, this);
      this.$.events.emit('Greeting', 'Good Afternoon');
    });

    it('should execute callback in context', function(done){
      this.$.events.on('Hail Taxi', function(){
        this.Hail.should.equal(true);
        done();
      }, {Hail: true});
      this.$.events.emit('Hail Taxi');
    });

    it('should remove listener by callback and context', function() {
      this.$.events.off('Hello', this.handler, this);
      this.$.events._listeners['Hello'].should.have.length(0);
    });

    it('should remove listener by callback', function() {
      this.$.events.off('Goodbye', this.handler2);
      this.$.events._listeners['Goodbye'].should.have.length(0);
    });

    it('should remove listeners by name', function() {
      this.$.events.off('Greeting');
      this.$.events._listeners['Greeting'].should.have.length(0);
    });
    it('should remove all listeners', function() {
      this.$.events.off();
      Object.keys(this.$.events._listeners).should.have.length(0);
    });    
  })

  describe('#extend', function(){
    it('should extend an object', function(){
      var obj = { z: 10 };
      this.$.extend(obj, {a: 1, b: 2}, {a: 6, c: 9});
      obj.should.deep.equal({a: 6, b: 2, c: 9, z: 10});
    });
  });
});