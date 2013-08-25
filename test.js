var test = require('tape')

test('each', function(t) {
  var n = 0
  var pool = require('./')({
    init: function() { return { value: n++ } }
  })

  pool.create()
  pool.create()
  pool.create()

  var flagged = []
  pool.each(function(n) {
    flagged.push(n.value)
  })

  t.deepEqual(flagged, [0, 1, 2])
  t.end()
})
