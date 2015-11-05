var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:8080');
var exec = require('child_process').exec;

var exchanges = [ 'mtgox', 'btce', 'bitstamp' ];
var exchanges_updates = {};

function listen_exchange(exchange) {
    socket.on(exchange, function (data) {
        exchanges_updates[exchange] = Date.now();
    });
}

function check_update() {
    var max_update_interval = 0;
    var now = Date.now();
    exchanges.map(function(e) {
        if (now - exchanges_updates[e] > max_update_interval) {
            max_update_interval = now - exchanges_updates[e];
        }
    });

    if (max_update_interval > 90000) {
        console.log('restarting ....');
        exec('./start.sh', function(){});
    }
}

exchanges.map(listen_exchange);
exchanges.map(function(e) {
    exchanges_updates[e] = Date.now();
});
setInterval(check_update, 10000);

