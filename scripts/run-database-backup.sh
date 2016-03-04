#!/bin/bash
echo `date` Start backup

name=`date +%y%m%d_%H%M`
cp ./mydb.db ./mydb.db.$name.bak

echo `date` Backup success
