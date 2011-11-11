(function() {
  var Pubsub, argv, daemon, logfile, pidfile, rhost, rport, shost, sport, usage, _ref, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
  Pubsub = require('./pubsub');
  argv = require('optimist').argv;
  daemon = require('daemon');
  sport = (_ref = (_ref2 = argv.sp) != null ? _ref2 : argv.sport) != null ? _ref : 8080;
  shost = (_ref3 = (_ref4 = argv.sh) != null ? _ref4 : argv.shost) != null ? _ref3 : '0.0.0.0';
  rport = (_ref5 = (_ref6 = argv.rp) != null ? _ref6 : argv.rport) != null ? _ref5 : 6379;
  rhost = (_ref7 = (_ref8 = argv.rh) != null ? _ref8 : argv.rhost) != null ? _ref7 : '127.0.0.1';
  process.title = 'snorkel';
  if (argv.help) {
    usage = '\nUsage: pubsub --host [host] --port [port] --rhost [redishoust] --rport [redisport]\n\nOptions:\n  -h | --host [optional]\n  -p | --port [optional]\n\n  -d          (daemonize)\n  --pid\n  --log\n';
    console.log(usage);
  } else {
    if (argv.d) {
      logfile = (_ref9 = argv.log) != null ? _ref9 : '/dev/null';
      pidfile = (_ref10 = argv.pid) != null ? _ref10 : '/var/run/pubsub.pid';
      daemon.daemonize(logfile, pidfile, function(err, pid) {
        if (err) {
          return console.log("Error starting daemon: " + err);
        } else {
          console.log("Daemon started successfully with pid: " + pid);
          return new Pubsub(shost, sport, rhost, rport);
        }
      });
    } else {
      new Pubsub(shost, sport, rhost, rport);
    }
  }
}).call(this);
