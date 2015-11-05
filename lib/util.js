var url = require('url');
var http = require('http');
var https = require('https');

function get_json(uri, on_res, on_error) {
    if (on_error == undefined) {
        on_error = function() {};
    }

    try {
        var protocol_name = url.parse(uri).protocol;
        switch (protocol_name) {
            case 'http:':
                var protocol = http;
                break;
            case 'https:':
                var protocol = https;
                break;
            default:
                throw new Error('bad protocol');
        }
        protocol.get(uri, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                try {
                    on_res(JSON.parse(data));
                } catch (err) {
                    on_error(err);
                }
            });
            res.on('error', on_error);
        }).on('error', on_error);
    } catch (err) {
        on_error(err);
    }
}

function listen_url(uri, update_interval, callback) {
    get_json(uri, function(data) {
        callback(data);
        setTimeout(function() {
            listen_url(uri, update_interval, callback);
        }, update_interval);
    }, function(err) {
        setTimeout(function() {
            listen_url(uri, update_interval, callback);
        }, update_interval);
    });
}

exports.listen_url = listen_url;

