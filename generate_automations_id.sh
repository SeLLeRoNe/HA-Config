#!/bin/bash

cd /home/ha/.homeassistant/automations/
for FILE in `find ./ -name *.yaml`
	do
#	sed -i '/^id: /d' $new_file
	if [ "`head -2 $FILE | grep \"id: \"`" = "" ]; then
		RANDOM_ID=`</dev/urandom tr -dc 0-9 | head -c15`
		sed -i "2 i id: '$RANDOM_ID'" $FILE
	fi
done

cd /home/ha/.homeassistant/

exit 0;