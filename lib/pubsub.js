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
      this.setup();
    }
    Pubsub.prototype.setup = function() {
      this.db = redis.createClient(this.redis_port, this.redis_ip);
      this.io = io.listen(this.socket_port, this.socket_ip);
      return this.assign_handlers();
    };
    Pubsub.prototype.assign_handlers = function() {
      return this.io.sockets.on('connection', __bind(function(socket) {
        return this.onConnect(socket);
      }, this));
    };
    Pubsub.prototype.onConnect = function(socket) {
      socket.on('subscribe', __bind(function(channel) {
        return this.onSubscribe(channel, socket);
      }, this));
      socket.on('publish', __bind(function(channel, data) {
        return this.publish(channel, data);
      }, this));
      return socket.on('error', __bind(function(error) {
        return this.onError(error);
      }, this));
    };
    Pubsub.prototype.onSubscribe = function(channel, socket) {
      var sub;
      sub = redis.createClient(this.redis_port, this.redis_ip);
      sub.on("message", function(channel, message) {
        return socket.emit(channel, message);
      });
      sub.on("ready", function() {
        return sub.subscribe(channel);
      });
      socket.on('unsubscribe', __bind(function(channel) {
        return this.onUnsubscribe(channel, sub);
      }, this));
      return socket.on('disconnect', __bind(function() {
        return this.onUnsubscribe(channel, sub);
      }, this));
    };
    Pubsub.prototype.onUnsubscribe = function(channel, sub) {
      sub.on('unsubscribe', __bind(function(channel, count) {
        if (count === 0) {
          return sub.end();
        }
      }, this));
      return sub.unsubscribe(channel);
    };
    Pubsub.prototype.publish = function(channel, data) {
      return this.db.publish(channel, data);
    };
    return Pubsub;
  })();
}).call(this);
