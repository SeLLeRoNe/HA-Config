#!/bin/bash

if [ "$1" = "" ]; then
	echo -n "Please enter the new room name: ";
	read ROOM_NAME
else
	ROOM_NAME=$1
fi

ROOM_NAME_LOWER=`echo $ROOM_NAME | tr A-Z a-z`
ENTITY_NAME=$(sed "s/ /_/g" <<< $ROOM_NAME_LOWER)

OLD_PWD=$PWD
HA_PATH=/home/ha/.homeassistant/
GITHUB_HA_PATH=/home/ha/HA-Config/
cd $HA_PATH

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
	git add $NEW_FILE
done
git commit -m "Updated $ROOM_NAME Climate Automations"


cd $OLD_PWD