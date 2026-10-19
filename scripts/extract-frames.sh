#!/usr/bin/env bash
# Extracts evenly spaced webp frames for the home page scenes.
# Usage: bash scripts/extract-frames.sh [desktop quality=80] [mobile quality=75]
# Scene N on the page = scenes[N-1] in src/lib/cinematic/scenes.json (source video + frame counts,
# also read by the engine). Never upscales past the source width.
set -euo pipefail
cd "$(dirname "$0")/.."
DQ=${1:-80}; MQ=${2:-75}
DESKTOP_W=1920; MOBILE_W=1080
CFG=src/lib/cinematic/scenes.json
count=$(node -e "console.log(require('./$CFG').scenes.length)")

rm -rf public/frames; mkdir -p public/frames/poster
for ((n = 1; n <= count; n++)); do
  name=$(node -e "console.log(require('./$CFG').scenes[$n-1].source)")
  src="kaynak-videolar/$name.mp4"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  srcw=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$src")
  for kind in desktop mobile; do
    frames=$(node -e "console.log(require('./$CFG').scenes[$n-1].$kind)")
    if [ "$kind" = desktop ]; then maxw=$DESKTOP_W; q=$DQ; else maxw=$MOBILE_W; q=$MQ; fi
    w=$(( maxw < srcw ? maxw : srcw ))
    rate=$(awk -v f="$frames" -v d="$dur" 'BEGIN{printf "%.6f", f/d}')
    out="public/frames/$kind/sahne-$n"; mkdir -p "$out"
    ffmpeg -v error -y -i "$src" -vf "fps=$rate,scale=$w:-2:flags=lanczos" -frames:v "$frames" -c:v libwebp -quality "$q" "$out/%04d.webp"
    echo "sahne-$n ($name) $kind: ${w}px q$q $frames frames $(find "$out" -name '*.webp' -printf '%s\n' | awk '{s+=$1}END{printf "%.2f MB", s/1048576}')"
  done
  ffmpeg -v error -y -i "$src" -vf "select=eq(n\,0),scale=$(( 1280 < srcw ? 1280 : srcw )):-2:flags=lanczos" -frames:v 1 -c:v libwebp -quality 70 "public/frames/poster/sahne-$n.webp"
done
# menu backdrop: the plated döner at the end of scene 1's source
first=$(node -e "console.log(require('./$CFG').scenes[0].source)")
ffmpeg -v error -y -sseof -1 -i "kaynak-videolar/$first.mp4" -vf "scale=1280:-2:flags=lanczos" -frames:v 1 -c:v libwebp -quality 70 public/frames/poster/menu.webp
