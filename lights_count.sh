#!/bin/bash

HA_PATH=/usr/share/hassio/homeassistant

for file in `ls $HA_PATH/entities/sensors/*_lights_count.yaml | xargs -n 1 basename | grep -v house | grep -v garage`
	do
	ROOM_CODE=${file#"%$HA_PATH"}
	ROOM_CODE=${file#"%/entities/sensors/"}
	ROOM_CODE=${file%"_lights_count.yaml"}
	ROOM_NAME=$(sed "s/_/ /g" <<< $ROOM_CODE)
	ROOM_NAME=$(sed -e "s/\b\(.\)/\u\1/g"<<< $ROOM_NAME)
	\cp $HA_PATH/room_lights_count.yaml $HA_PATH/entities/sensors/$file
	sed -i "s/ROOM_NAME/$ROOM_NAME/g" $HA_PATH/entities/sensors/$file
	sed -i "s/ROOM_CODE/$ROOM_CODE/g" $HA_PATH/entities/sensors/$file
done
