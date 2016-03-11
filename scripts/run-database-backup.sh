#!/bin/bash
echo `date` Start backup

NAME=`date +%y%m%d_%H%M`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cp $DIR/../mydb.db $DIR/../mydb.db.$NAME.bak

echo `date` Backup success
