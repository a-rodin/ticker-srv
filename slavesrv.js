var io = require('socket.io').listen((process.argv[2] | 0));
var socket = require('socket.io-client').connect('http://localhost:8080');

function publish_ticker(exchange, ticker) {
    io.sockets.emit(exchange, ticker);
}

['mtgox', 'btce', 'bitstamp', 'btce_ltc_usd', 'btce_ltc_btc'].map(function(exchange) {
    socket.on(exchange, function(data) {
        io.sockets.emit(exchange, data);
    });
});

