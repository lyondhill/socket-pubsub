io = require 'socket.io'
redis = require 'redis'

module.exports = class Pubsub

  constructor: (@socket_ip, @socket_port, @redis_ip, @redis_port) ->
    @setup()

    # @start()

  setup: () ->
    @db = redis.createClient(@redis_port, @redis_ip)
    @io = io.listen(@socket_port, @socket_ip)
    @assign_handlers()

  assign_handlers: () ->
    @io.sockets.on 'connection', (socket) =>
      @onConnect socket

  onConnect: (socket) ->
    socket.on 'subscribe', (channel) => 
      @onSubscribe channel, socket
    socket.on 'publish', (channel, data) => 
      @publish channel, data
    socket.on 'error', (error) =>
      @onError error
    # socket.on 'close', () =>  
    #   @onDisconnect()

  onSubscribe: (channel, socket) ->
    sub = redis.createClient(@redis_port, @redis_ip)
    sub.on "message", (channel, message) ->
      socket.emit(channel, message)

    sub.on "ready", ->
      sub.subscribe channel
    
    socket.on 'unsubscribe', (channel) => 
      @onUnsubscribe channel, sub
    
    socket.on 'disconnect', () =>
      @onUnsubscribe channel, sub

  onUnsubscribe: (channel, sub) ->
    sub.on 'unsubscribe', (channel, count) =>
      sub.end() if count == 0
    sub.unsubscribe(channel) 

  publish: (channel, data) ->
    @db.publish(channel, data)
