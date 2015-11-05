ticker-srv
==========

Microservice that obtains ticker data from several Bitcoin exchanges and makes it
available via uinfied websocket protocol.

Architecture
------------
It is supposed to run on a multicore server. One instance (tickersrv.js) actually
obtains data and makes it available for websocket clients. Other instances
(which are slavesrv.js, the number of them currently is hardcoded in start.sh 
and equals 3) connect to the local ticker-srv and retranslate it to
websocket clients via several ports available from external internet.

It is supposed that the clients select port by random and use random instance
of slavesrv.

The pinger.js check that the server actually works and is not frozen, and if it doesn't
it restrts the server.

Running
-------

To setup and run the server one have to do following steps:

    npm install -g forever
    npm install
    ./start.sh

