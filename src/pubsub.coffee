io = require 'socket.io'
redis = require 'redis'

module.exports = class Pubsub

  constructor: (@socket_ip, @socket_port, @redis_ip, @redis_port) ->
    console.log 'pubsub constructing'
    @setup()

    # @start()

  setup: () ->
    console.log 'setup'
    # @db = redis.createClient(@redis_port, @redis_ip)
    @io = io.listen(@socket_port, @socket_ip)
    @assign_handlers()

  assign_handlers: () ->
    console.log 'assign handlers'
    @io.sockets.on 'connection', (socket) =>
      console.log 'recieved new connection' 
      @onConnect socket

  onConnect: (socket) ->
    console.log 'on_connect'
    socket.on 'subscribe', (channel) => 
      console.log "subscribe #{channel}"
      @onSubscribe channel, socket
    socket.on 'publish', (channel, data) => 
      console.log "publish #{channel}, #{data}"
      @publish channel, data
    socket.on 'error', (error) =>
      @onError error
    # socket.on 'close', () =>  
    #   @onDisconnect()

  onSubscribe: (channel, socket) ->
    sub = redis.createClient(@redis_port, @redis_ip)
    console.log "onSubscribe "
    sub.on "message", (channel, message) ->
      socket.emit(channel, message)

    sub.on "ready", ->
      sub.subscribe channel
    
    socket.on 'unsubscribe', (channel) => 
      console.log 'on unsubscribe'
      @onUnsubscribe channel, sub
    
    socket.on 'disconnect', () =>
      console.log "on close"
      @onUnsubscribe channel, sub

  onUnsubscribe: (channel, sub) ->
    console.log "unsbuscribe socket"
    sub.on 'unsubscribe', (channel, count) =>
      console.log 'unsubscribe sub'
      sub.end if count == 0
      console.log 'should ahve closed sub'
    sub.unsubscribe() 

  publish: (channel, data) ->
    pub = redis.createClient(@redis_port, @redis_ip)
    pub.publish(channel, data)
    pub.end
    # @db.publish(channel, data)
