#!/bin/bash

echo -n "Please enter the new room name: ";
read ROOM_NAME

ROOM_NAME_LOWER=`echo $ROOM_NAME | tr A-Z a-z`
ENTITY_NAME=$(sed "s/ /_/g" <<< $ROOM_NAME_LOWER)

for file in `find . -name climate_* | grep house`
do
	new_file=$(sed "s/house/master_bedroom/g" <<< $file)
	echo "Copying $file to $new_file"
		\cp $file $new_file
	sed -i 's/- House/- '$ROOM_NAME'/g' $new_file
	sed -i 's/house_/'$ENTITY_NAME'_/g' $new_file
	sed -i 's/_house/_'$ENTITY_NAME'/g' $new_file
	sed -i 's/climate.house/climate.'$ENTITY_NAME'/g' $new_file
done