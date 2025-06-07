#!/bin/sh

echo "start the job"
ls -al
which nslookup
which mpirun
mpirun --version
sleep 10   
echo "end the job"