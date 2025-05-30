#!/bin/bash

# Wait for the live.txt file to exist
echo "Waiting for live.txt to be created..."
while [ ! -f output/live.txt ]; do
  sleep 2
done

echo "live.txt found. Starting gowitness..."
exec gowitness scan file -f output/live.txt -s output/screenshots