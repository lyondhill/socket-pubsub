(function() {
  var Pubsub, io, redis;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  io = require('socket.io');
  redis = require('redis');
  module.exports = Pubsub = (function() {
    function Pubsub(socket_ip, socket_port, redis_ip, redis_port) {
      this.socket_ip = socket_ip;
      this.socket_port = socket_port;
      this.redis_ip = redis_ip;
      this.redis_port = redis_port;
      console.log('pubsub constructing');
      this.setup();
    }
    Pubsub.prototype.setup = function() {
      console.log('setup');
      this.io = io.listen(this.socket_port, this.socket_ip);
      return this.assign_handlers();
    };
    Pubsub.prototype.assign_handlers = function() {
      console.log('assign handlers');
      return this.io.sockets.on('connection', __bind(function(socket) {
        console.log('recieved new connection');
        return this.onConnect(socket);
      }, this));
    };
    Pubsub.prototype.onConnect = function(socket) {
      console.log('on_connect');
      socket.on('subscribe', __bind(function(channel) {
        console.log("subscribe " + channel);
        return this.onSubscribe(channel, socket);
      }, this));
      socket.on('publish', __bind(function(channel, data) {
        console.log("publish " + channel + ", " + data);
        return this.publish(channel, data);
      }, this));
      return socket.on('error', __bind(function(error) {
        return this.onError(error);
      }, this));
    };
    Pubsub.prototype.onSubscribe = function(channel, socket) {
      var sub;
      sub = redis.createClient(this.redis_port, this.redis_ip);
      console.log("onSubscribe ");
      sub.on("message", function(channel, message) {
        return socket.emit(channel, message);
      });
      sub.on("ready", function() {
        return sub.subscribe(channel);
      });
      socket.on('unsubscribe', __bind(function(channel) {
        console.log('on unsubscribe');
        return this.onUnsubscribe(channel, sub);
      }, this));
      return socket.on('disconnect', __bind(function() {
        console.log("on close");
        return this.onUnsubscribe(channel, sub);
      }, this));
    };
    Pubsub.prototype.onUnsubscribe = function(channel, sub) {
      console.log("unsbuscribe socket");
      sub.on('unsubscribe', __bind(function(channel, count) {
        console.log('unsubscribe sub');
        if (count === 0) {
          sub.end;
        }
        return console.log('should ahve closed sub');
      }, this));
      return sub.unsubscribe();
    };
    Pubsub.prototype.publish = function(channel, data) {
      var pub;
      pub = redis.createClient(this.redis_port, this.redis_ip);
      pub.publish(channel, data);
      return pub.end;
    };
    return Pubsub;
  })();
}).call(this);
