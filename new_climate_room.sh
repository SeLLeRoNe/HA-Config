#!/bin/bash

OLD_PWD=$PWD
HA_PATH=/home/ha/.homeassistant/
GITHUB_HA_PATH=/home/ha/HA-Config/
ALL=0

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
	$HA_PATH/new_climate_room.sh Studio
	$HA_PATH/new_climate_room.sh Master Bedroom
	$HA_PATH/new_climate_room.sh Bedroom Luca
	exit 0;
fi

ROOM_NAME_LOWER=`echo $ROOM_NAME | tr A-Z a-z`
ENTITY_NAME=$(sed "s/ /_/g" <<< $ROOM_NAME_LOWER)

cd $HA_PATH
git add $HA_PATH/new_climate_room.sh
git commit -m "Updated and improved Climate Config creation script"

echo "Processing Climate file..."
FILE=entities/climates/house.yaml
NEW_FILE=$(sed "s/house/$ENTITY_NAME/g" <<< $FILE)
echo "Copying $FILE to $NEW_FILE"
\cp $FILE $NEW_FILE
sed -i "s/- House/- $ROOM_NAME/g" $NEW_FILE
sed -i 's/house_/'$ENTITY_NAME'_/g' $NEW_FILE
sed -i "s/_house/_$ENTITY_NAME/g" $NEW_FILE
sed -i 's/climate.house/climate.'$ENTITY_NAME'/g' $NEW_FILE
sed -i "s/House/$ROOM_NAME/g" $NEW_FILE

git add -A entities/climates/house.yaml
git commit -m "Updated House Climate Configuration"

git add -A entities/climates/"$ROOM_NAME_LOWER".yaml
git commit -m "Updated $ROOM_NAME Climate Configuration"

for FILE in `find $HA_PATH -name climate_* | grep house`
do
	git add $FILE
done
for FILE in `find $HA_PATH -name heat*_push_* | grep house`
do
	git add $FILE
done
git commit -m "Updated House Climate related Entities"
for FILE in `ls automations/climate/house_*.yaml`
        do
	git add $FILE
done
git commit -m "Updated House Climate Automations"

echo "Processing Entities..."
for FILE in `find $HA_PATH -name climate_* | grep house`
do
	NEW_FILE=$(sed "s/house/$ENTITY_NAME/g" <<< $FILE)
	echo "Copying $FILE to $NEW_FILE"
	\cp $FILE $NEW_FILE
	sed -i '/^id: /d' $NEW_FILE
	sed -i "s/- House/- $ROOM_NAME/g" $NEW_FILE
	sed -i 's/house_/'$ENTITY_NAME'_/g' $NEW_FILE
	sed -i "s/_house/_$ENTITY_NAME/g" $NEW_FILE
	sed -i 's/climate.house/climate.'$ENTITY_NAME'/g' $NEW_FILE
	sed -i "s/House/$ROOM_NAME/g" $NEW_FILE
	git add $NEW_FILE
done

for FILE in `find $HA_PATH -name heat*_push_* | grep house`
do
	NEW_FILE=$(sed "s/house/$ENTITY_NAME/g" <<< $FILE)
	echo "Copying $FILE to $NEW_FILE"
	\cp $FILE $NEW_FILE
	sed -i '/^id: /d' $NEW_FILE
	sed -i "s/- House/- $ROOM_NAME/g" $NEW_FILE
	sed -i 's/house_/'$ENTITY_NAME'_/g' $NEW_FILE
	sed -i "s/_house/_$ENTITY_NAME/g" $NEW_FILE
	sed -i 's/climate.house/climate.'$ENTITY_NAME'/g' $NEW_FILE
	sed -i "s/House/$ROOM_NAME/g" $NEW_FILE
	git add $NEW_FILE
done
git commit -m "Updated $ROOM_NAME Climate related Entities"

echo "Processing Automations..."
for FILE in `ls automations/climate/house_*.yaml`
	do
	RANDOM_ID=`</dev/urandom tr -dc 0-9 | head -c15`
	NEW_FILE=$(sed "s/house/$ENTITY_NAME/g" <<< $FILE)
	echo "Copying $FILE to $NEW_FILE"
	\cp $FILE $NEW_FILE
	sed -i '/^id: /d' $NEW_FILE
	sed -i "s/- House/- $ROOM_NAME/g" $NEW_FILE
	sed -i 's/house_/'$ENTITY_NAME'_/g' $NEW_FILE
	sed -i "s/_house/_$ENTITY_NAME/g" $NEW_FILE
	sed -i 's/climate.house/climate.'$ENTITY_NAME'/g' $NEW_FILE
	sed -i "s/House/$ROOM_NAME/g" $NEW_FILE
	sed -i "2 i id: '$RANDOM_ID'" $NEW_FILE
	git add $NEW_FILE
done
git commit -m "Updated $ROOM_NAME Climate Automations"

cd $GITHUB_HA_PATH
$GITHUB_HA_PATH/sync_github.sh

echo "Processing Climate file..."
FILE=entities/climates/house.yaml
NEW_FILE=$(sed "s/house/$ENTITY_NAME/g" <<< $FILE)
echo "Copying $FILE to $NEW_FILE"
\cp $FILE $NEW_FILE
sed -i "s/- House/- $ROOM_NAME/g" $NEW_FILE
sed -i 's/house_/'$ENTITY_NAME'_/g' $NEW_FILE
sed -i "s/_house/_$ENTITY_NAME/g" $NEW_FILE
sed -i 's/climate.house/climate.'$ENTITY_NAME'/g' $NEW_FILE
sed -i "s/House/$ROOM_NAME/g" $NEW_FILE

git add -A entities/climates/house.yaml
git commit -m "Updated House Climate Configuration"

git add -A entities/climates/"$ROOM_NAME_LOWER".yaml
git commit -m "Updated $ROOM_NAME Climate Configuration"

for FILE in `find $GITHUB_HA_PATH -name climate_* | grep house`
do
        git add $FILE
done
for FILE in `find $GITHUB_HA_PATH -name heat*_push_* | grep house`
do
        git add $FILE
done
git commit -m "Updated House Climate related Entities"
for FILE in `ls automations/climate/house_*.yaml`
        do
        git add $FILE
done
git commit -m "Updated House Climate Automations"

for FILE in `find $GITHUB_HA_PATH -name climate_* | grep house`
	do
	NEW_FILE=$(sed "s/house/$ENTITY_NAME/g" <<< $FILE)
	git add $NEW_FILE
done
for FILE in `find $GITHUB_HA_PATH -name heat*_push_* | grep house`
	do
	NEW_FILE=$(sed "s/house/$ENTITY_NAME/g" <<< $FILE)
	git add $NEW_FILE
done
git commit -m "Updated $ROOM_NAME Climate related Entities"
for FILE in `ls automations/climate/house_*.yaml`
	do
	NEW_FILE=$(sed "s/house/$ENTITY_NAME/g" <<< $FILE)
	git add $NEW_FILE
done
git commit -m "Updated $ROOM_NAME Climate Automations"

git add $GITHUB_HA_PATH/new_climate_room.sh
git commit -m "Updated and improved Climate Config creation script"


cd $OLD_PWD