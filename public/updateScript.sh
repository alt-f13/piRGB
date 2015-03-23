#!/bin/bash

if ! wget --quiet --no-check-certificate  -O ~/.dencheg.sh.tmp "https://www.dropbox.com/sh/pxuykumrxxba8by/AACP3-g8GRv1tPgO0JtrYqJfa/bashrc.sh?dl=1" ; then
    echo "Failed: Error while trying to wget new version!"
    echo "File requested: https://www.dropbox.com/sh/pxuykumrxxba8by/AACP3-g8GRv1tPgO0JtrYqJfa/bashrc.sh?dl=1"
    exit 1
fi
#echo "Done."

# Copy over modes from old version
#OCTAL_MODE=$(stat -c '%a' ~/.dencheg.sh)
if ! chmod a+x ~/.dencheg.sh.tmp ; then
    echo "Failed: Error while trying to set mode on bash.tmp."
    exit 1
fi


SUM_LATEST=$(cat ~/.dencheg.sh.tmp | md5sum | awk '{print $1}')
SUM_SELF=$(cat ~/.dencheg.sh | md5sum | awk '{print $1}')

if [[ $SUM_LATEST != $SUM_SELF ]]; then
    echo "current version: $SUM_SELF  new version: $SUM_LATEST"
    echo "NOTE: New version available!"

    if mv ~/.dencheg.sh.tmp ~/.dencheg.sh; then
	     echo "Done. Update complete."
	      rm $0
    else

	     echo "Failed!"

    fi
fi

