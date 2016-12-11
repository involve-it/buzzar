#!/bin/bash

if [[ $# -eq 0 ]] ; then
        echo "Usage: ./deploy app-name [branch]"
        exit 1
else

app=$1
branch=$2
folder=$app
echo "Deploying $app..."
if [[ $branch ]] ; then
        echo "Branch $branch"
        folder+="_$branch"
fi

echo "Cloning project from https://github.com/involve-it/$app..."
echo "If project is private, GitHub will ask for credentials"
cd projects

if [ -d $folder ]; then
        rm -rf $folder
fi

if [[ $branch ]]; then
        git clone https://USERNAME_REPLACE:PASSWORD_REPLACE@github.com/involve-it/$app.git -b $branch --single-branch $folder
else
        git clone https://USERNAME_REPLACE:PASSWORD_REPLACE@github.com/involve-it/$app.git $folder
fi

echo "Copying settings.json..."
cp $folder/meteor-app/settings.json _mup/$folder/

sudo chmod -R 777 .

echo "Removing unnecessary platoforms - iOS and Android..."

cd $folder/meteor-app
meteor remove-platform android ios

echo "Installing npm packages..."
meteor npm install

cd ../..

echo "Building and Deploying with MUP..."

cd _mup/$folder
mup deploy

echo "Deployment is complete"

fi