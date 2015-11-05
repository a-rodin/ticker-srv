var io = require('socket.io').listen(8080);
var gox = require('goxstream');
var goxticker = gox.createStream();
var util = require('./lib/util');

var colors = require('colors');

UPDATE_INTERVAL = 2500;

io.set('log level', 0);

function publish_ticker(exchange, ticker) {
    io.sockets.emit(exchange, ticker);
}

util.listen_url('https://btc-e.com/api/3/ticker/btc_usd-ltc_usd-ltc_btc', UPDATE_INTERVAL, function(data) {
    publish_ticker('btce', {
        buy: parseFloat(data.btc_usd.buy),
        sell: parseFloat(data.btc_usd.sell),
        last: parseFloat(data.btc_usd.last)
    });
    publish_ticker('btce_ltc_usd', {
        buy: parseFloat(data.ltc_usd.buy),
        sell: parseFloat(data.ltc_usd.sell),
        last: parseFloat(data.ltc_usd.last)
    });
    publish_ticker('btce_ltc_btc', {
        buy: parseFloat(data.ltc_btc.buy),
        sell: parseFloat(data.ltc_btc.sell),
        last: parseFloat(data.ltc_btc.last)
    });
});

util.listen_url('https://www.bitstamp.net/api/ticker/', 6 * UPDATE_INTERVAL, function(data) {
    publish_ticker('bitstamp', {
        buy: parseFloat(data.ask),
        sell: parseFloat(data.bid),
        last: parseFloat(data.last)
    });
});

goxticker.on('data', function(data) {
    try {
        var obj = JSON.parse(data);
        publish_ticker('mtgox', {
            buy: parseFloat(obj.ticker.buy.value),
            last: parseFloat(obj.ticker.last.value),
            sell: parseFloat(obj.ticker.sell.value)
        });
    } catch (err) {
    }
});

