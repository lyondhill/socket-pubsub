var redis = require("redis")
  pub = redis.createClient();
  pub2 = redis.createClient();


redis.debug_mode = false;
pub.set("count", 0)
setInterval(function() {
  
  pub.incr("count", function(err, value) {
  pub.publish("a nice channel", "" + value + " published");
  })
}, 100)

pub2.set('count2', 0)

setInterval(function() {
  pub2.incr("count2", function(err, value) {
    pub.publish("another one", "" + value + " another published");
  })
}, 50)


// setInterval(function() {
//   pub.quit()
// }, 1000)