var LinkedList = require('circular-list')
var Node = LinkedList.Node

module.exports = Pool

function noop(){}
function defaultInit() {
  return {}
}

function Pool(opts) {
  if (!(this instanceof Pool)) {
    return new Pool(opts)
  }

  opts = opts || {}
  this.reserve = new LinkedList
  this.list = new LinkedList

  this.key = opts.key || '__pool_node__'
  this.disable = opts.disable || noop
  this.enable = opts.enable || noop
  this.init = opts.init || defaultInit
  this.minimumSize = opts.minimumSize || 0;
  this.capacity = opts.capacity || Number.MAX_VALUE;
  
  if(this.capacity < this.minimumSize) {
    throw new Error('Cannot create pool if capacity is less than the initial size'); 
  }
  
  this.initPool(opts.initSize || 0);
}

Pool.prototype.initPool = function(initialSize) {
  for(var i = 0; i < initialSize; i++) {
    var object = this.init()
    var node = new Node(object)
    object[this.key] = node
    this.reserve.append(object[this.key])
  }
}

Pool.prototype.create = function() {
  if (this.reserve.first === null) {
    if (this.size() === this.capacity) {
      return null;
    }
    var object = this.init()
    var node = new Node(object)
    object[this.key] = node
  } else {
    var node = this.reserve.first
    var object = node.data
    this.reserve.remove(node)
  }

  this.enable(object)
  this.list.append(node)
  this.ensureSize();

  return object
}

Pool.prototype.remove = function(entity) {
  this.disable(entity)
  this.list.remove(entity[this.key])
  this.reserve.append(entity[this.key])
  this.ensureSize();
  return this
}

Pool.prototype.ensureSize = function () {
  var diff = this.minimumSize - this.reserve.length;
  if (diff > 0 && this.size() < this.capacity) {
    this.initPool(1);
  }
}

Pool.prototype.size = function() {
  return this.reserve.length + this.list.length 
}

Pool.prototype.each = function(cb) {
  var p = this.list.first
  var n = this.list.length

  while (n--) {
    cb(p.data)
    p = p.next
  }
}

Pool.prototype.clean = function() {
  this.reserve.length = 0
  this.reserve.first = null
  this.reserve.last = null
}

var pool = Pool(function init() {
  return { active: false }
}, {
  key: '__pool_node__',
  enable: function(entity) {
    entity.active = true
  },
  disable: function(entity) {
    entity.active = false
  }
})
