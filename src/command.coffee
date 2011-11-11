Pubsub = require './pubsub'
{argv} = require 'optimist'
daemon = require 'daemon'

sport = argv.sp ? argv.sport ? 8080
shost = argv.sh ? argv.shost ? '0.0.0.0'

rport = argv.rp ? argv.rport ? 6379
rhost = argv.rh ? argv.rhost ? '127.0.0.1'

process.title = 'snorkel'

if argv.help
  usage = '''

  Usage: pubsub --host [host] --port [port] --rhost [redishoust] --rport [redisport]

  Options:
    -h | --host [optional]
    -p | --port [optional]

    -d          (daemonize)
    --pid
    --log

  '''
  console.log usage
else
  if argv.d

    logfile = argv.log ? '/dev/null'
    pidfile = argv.pid ? '/var/run/pubsub.pid'

    daemon.daemonize logfile, pidfile, (err, pid) ->
      if err
        console.log "Error starting daemon: #{err}"
      else
        console.log "Daemon started successfully with pid: #{pid}"
        new Pubsub(shost, sport, rhost, rport)
  else
    new Pubsub(shost, sport, rhost, rport)
