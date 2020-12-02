#!/bin/bash

cd automations/
for FILE in `find ./ -name *.yaml`
	do
	if [ "`head -2 $FILE | grep \"id: \"`" = "" ]; then
		RANDOM_ID=`</dev/urandom tr -dc 0-9 | head -c13`
		sed -i "2 i id: '$RANDOM_ID'" $FILE
	fi
done

cd ..

exit 0;