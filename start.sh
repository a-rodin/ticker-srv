#!/bin/bash --login

cd `dirname $0`

PINGER_ID=`forever list | grep pinger | awk '{print $3}'`
forever stop tickersrv.js
forever start -l /dev/null -o /dev/null -e /dev/null -a tickersrv.js $i

forever stop slavesrv.js
for ((i = 8081; i <= 8084; ++i)); do
    forever start -l /dev/null -o /dev/null -e /dev/null -a slavesrv.js $i
done
forever start -l /dev/null -o /dev/null -e /dev/null -a pinger.js
forever stop $PINGER_ID

