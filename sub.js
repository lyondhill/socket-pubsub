var redis = require("redis")
    sub = redis.createClient(), msg_count = 0,

redis.debug_mode = false;

// Most clients probably don't do much on "subscribe".  This example uses it to coordinate things within one program.
// sub.on("subscribe", function (channel, count) {
//     console.log("sub subscribed to " + channel + ", " + count + " total subscriptions");
//     if (count === 2) {
//     }
// });

// sub.on("unsubscribe", function (channel, count) {
//     console.log("sub unsubscribed from " + channel + ", " + count + " total subscriptions");
//     if (count === 0) {
//         client2.end();
//         sub.end();
//     }
// });

sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
});

sub.on("ready", function () {
    // if you need auth, do it here
    sub.subscribe("a nice channel", "another one");
});