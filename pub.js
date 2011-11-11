var redis = require("redis")
  pub = redis.createClient();
  pub2 = redis.createClient();


redis.debug_mode = false;
setInterval(function() {
  
  pub.incr("count", function(err, value) {
  pub.publish("a nice channel", "" + value + " published");
  })
}, 100)


setInterval(function() {
  pub2.incr("count2", function(err, value) {
    pub.publish("another one", "" + value + " another published");
  })
}, 50)


// setInterval(function() {
//   pub.quit()
// }, 1000)