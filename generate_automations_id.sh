#!/bin/bash

if ["$1" = "clean" ]; then
	NEW_IDS=1
else
	NEW_IDS=0
fi

cd /home/ha/.homeassistant/automations/
for FILE in `find ./ -name *.yaml`
	do
	if [ $NEW_IDS -eq 1 ]; then
		sed -i '/^id: /d' $FILE
	fi
	RANDOM_ID=`</dev/urandom tr -dc 0-9 | head -c15`
	if [ "`head -2 $FILE | grep \"id: \"`" = "" ]; then
		sed -i "2 i id: '$RANDOM_ID'" $FILE
	fi
done

cd /home/ha/.homeassistant/

exit 0;