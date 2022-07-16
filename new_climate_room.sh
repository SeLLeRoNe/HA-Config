#!/bin/bash

OLD_PWD=$PWD
HA_PATH=/usr/share/hassio/homeassistant
GITHUB_HA_PATH=/root/HA-Config
ALL=0
ID=

if [ "$1" = "" ]; then
	echo -n "Please enter the new room name: ";
	read ROOM_NAME
elif [ "$2" = "" ]; then
	if [ "$1" != "all" ]; then
		ROOM_NAME=$1
	else
		ALL=1
	fi
else
	ROOM_NAME="$1 $2"
fi

if [ $ALL -eq 1 ]; then
	$HA_PATH/new_climate_room.sh Living Room
        $HA_PATH/new_climate_room.sh Kitchen
        $HA_PATH/new_climate_room.sh Play Room
	$HA_PATH/new_climate_room.sh Studio Andrea
        $HA_PATH/new_climate_room.sh Studio Sonia
	$HA_PATH/new_climate_room.sh Master Bedroom
        $HA_PATH/new_climate_room.sh Guest Bedroom
	$HA_PATH/new_climate_room.sh Kids Bedroom
        $HA_PATH/new_climate_room.sh Common Bathroom
        $HA_PATH/new_climate_room.sh Ground Floor Bathroom
        $HA_PATH/new_climate_room.sh Service Bathroom
        $HA_PATH/new_climate_room.sh Master Bathroom
	exit 0;
fi

ROOM_NAME_LOWER=`echo $ROOM_NAME | tr A-Z a-z`
ROOM_NAME_LOWER=$(sed "s/ /_/g" <<< $ROOM_NAME_LOWER)

cd $HA_PATH
git add $HA_PATH/new_climate_room.sh >/dev/null 2>&1
git commit -m "Updated and improved Climate Config creation script" >/dev/null 2>&1

echo "Processing Climate Package for $ROOM_NAME..."
FILE=packages/devices/climate/house.yaml
NEW_FILE=$(sed "s/house/$ROOM_NAME_LOWER/g" <<< $FILE)
\cp $FILE $NEW_FILE
for ID in `cat $NEW_FILE | grep "  - id: " | cut -d\' -f2`;
	do
	RANDOM_ID=`</dev/urandom tr -dc 0-9 | head -c15`
	sed -i "s/  - id: '$ID'/  - id: '$RANDOM_ID'/" $NEW_FILE
done
sed -i "s/- House/- $ROOM_NAME/g" $NEW_FILE
sed -i 's/house_/'$ROOM_NAME_LOWER'_/g' $NEW_FILE
sed -i "s/_house/_$ROOM_NAME_LOWER/g" $NEW_FILE
sed -i 's/climate.house/climate.'$ROOM_NAME_LOWER'/g' $NEW_FILE
sed -i "s/House/$ROOM_NAME/g" $NEW_FILE

git add -A packages/devices/climate/house.yaml >/dev/null 2>&1
git commit -m "Updated House Climate Package" >/dev/null 2>&1

git add -A packages/devices/climate/"$ROOM_NAME_LOWER".yaml >/dev/null 2>&1
git commit -m "Updated $ROOM_NAME Climate Package" >/dev/null 2>&1

cd $GITHUB_HA_PATH
$GITHUB_HA_PATH/sync_github.sh

git add $GITHUB_HA_PATH/new_climate_room.sh >/dev/null 2>&1
git commit -m "Updated and improved Climate Config creation script" >/dev/null 2>&1

git add -A packages/devices/climate/house.yaml >/dev/null 2>&1
git commit -m "Updated House Climate Package" >/dev/null 2>&1

git add -A packages/devices/climate/"$ROOM_NAME_LOWER".yaml >/dev/null 2>&1
git commit -m "Updated $ROOM_NAME Climate Package" >/dev/null 2>&1

cd $OLD_PWD
