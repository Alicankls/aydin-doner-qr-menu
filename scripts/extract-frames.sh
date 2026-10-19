#!/usr/bin/env bash
# Extracts evenly spaced webp frames for the home page scenes.
# Usage: bash scripts/extract-frames.sh [desktop quality=80] [mobile quality=86]
# Mobile frames are a vertical 9:16 slice cut from the full source height (a phone only ever shows the
# middle of a 16:9 video), so every stored pixel is shown 1:1 instead of being a wasted, upscaled 1080px frame.
# Scene N on the page = scenes[N-1] in src/lib/cinematic/scenes.json (source video + frame counts,
# also read by the engine). Never upscales past the source width.
set -euo pipefail
cd "$(dirname "$0")/.."
DQ=${1:-80}; MQ=${2:-86}
DESKTOP_W=1920
CFG=src/lib/cinematic/scenes.json
count=$(node -e "console.log(require('./$CFG').scenes.length)")

rm -rf public/frames; mkdir -p public/frames/poster
for ((n = 1; n <= count; n++)); do
  name=$(node -e "console.log(require('./$CFG').scenes[$n-1].source)")
  src="kaynak-videolar/$name.mp4"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  srcw=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$src")
  srch=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src")
  for kind in desktop mobile; do
    frames=$(node -e "console.log(require('./$CFG').scenes[$n-1].$kind)")
    rate=$(awk -v f="$frames" -v d="$dur" 'BEGIN{printf "%.6f", f/d}')
    out="public/frames/$kind/sahne-$n"; mkdir -p "$out"
    if [ "$kind" = desktop ]; then
      q=$DQ; w=$(( DESKTOP_W < srcw ? DESKTOP_W : srcw ))
      vf="fps=$rate,scale=$w:-2:flags=lanczos"; size="${w}px wide"
    else
      q=$MQ; cw=$(( srch * 9 / 16 / 2 * 2 ))
      vf="fps=$rate,crop=$cw:$srch:(iw-$cw)/2:0"; size="${cw}x${srch} (9:16 slice, native pixels)"
    fi
    ffmpeg -v error -y -i "$src" -vf "$vf" -frames:v "$frames" -c:v libwebp -quality "$q" "$out/%04d.webp"
    echo "sahne-$n ($name) $kind: $size q$q $frames frames $(find "$out" -name '*.webp' -printf '%s
' | awk '{s+=$1}END{printf "%.2f MB", s/1048576}')"
  done
  ffmpeg -v error -y -i "$src" -vf "select=eq(n\,0),scale=$(( 1280 < srcw ? 1280 : srcw )):-2:flags=lanczos" -frames:v 1 -c:v libwebp -quality 70 "public/frames/poster/sahne-$n.webp"
done
# menu backdrop: the plated döner at the end of scene 1's source
first=$(node -e "console.log(require('./$CFG').scenes[0].source)")
ffmpeg -v error -y -sseof -1 -i "kaynak-videolar/$first.mp4" -vf "scale=1280:-2:flags=lanczos" -frames:v 1 -c:v libwebp -quality 70 public/frames/poster/menu.webp
