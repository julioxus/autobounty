#!/bin/bash
set -e

TARGETS="targets.txt"
OUTDIR="output"

mkdir -p $OUTDIR

echo "[*] Running subfinder..."
subfinder -dL $TARGETS -silent > $OUTDIR/subs.txt

echo "[*] Resolving with dnsx..."
cat $OUTDIR/subs.txt | dnsx -silent > $OUTDIR/resolved.txt

echo "[*] Checking live hosts..."
cat $OUTDIR/resolved.txt | httpx -silent > $OUTDIR/live.txt

echo "[*] Done! Output in $OUTDIR"
