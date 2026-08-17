#!/usr/bin/env bash
# Derives a short cinematic motion piece (Ken Burns pans + crossfades) from the
# strongest campaign stills. The asset library contains no real video, so this
# derived piece stands in for the "Video / Motion" stage and is labeled as such
# in the manifest (video.derived = true).
#
# Output: public/assets/p14/video/p14-story.mp4 (720x1280, ~20s, muted) + poster.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=public/assets/p14
OUT=$SRC/video
mkdir -p "$OUT"

# Sequence mirrors VIDEO_SEQUENCE in scripts/classification.mjs
IMGS=("$SRC/campaign-3.jpg" "$SRC/scene-gallery-1.jpg" "$SRC/scene-veranda-1.jpg" "$SRC/scene-wheat-1.jpg" "$SRC/campaign-1.jpg")

W=720; H=1280; FPS=30; DUR=4.5; FADE=0.9
D=135 # DUR * FPS

FILTER=""
for i in 0 1 2 3 4; do
  # Alternate slow zoom-in / zoom-out for gentle motion
  if [ $((i % 2)) -eq 0 ]; then
    ZOOM="zoom='min(1.0+0.0009*on,1.12)'"
  else
    ZOOM="zoom='max(1.12-0.0009*on,1.0)'"
  fi
  FILTER+="[$i:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},zoompan=${ZOOM}:d=${D}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=${FPS},format=yuv420p[v$i];"
done

# Chain crossfades; offsets are n * (DUR - FADE) = n * 3.6
FILTER+="[v0][v1]xfade=transition=fade:duration=${FADE}:offset=3.6[x1];"
FILTER+="[x1][v2]xfade=transition=fade:duration=${FADE}:offset=7.2[x2];"
FILTER+="[x2][v3]xfade=transition=fade:duration=${FADE}:offset=10.8[x3];"
FILTER+="[x3][v4]xfade=transition=fade:duration=${FADE}:offset=14.4[xout]"

# Each still enters as a single frame; zoompan (d=${D}) generates the motion frames.
ffmpeg -y -loglevel error \
  -i "${IMGS[0]}" \
  -i "${IMGS[1]}" \
  -i "${IMGS[2]}" \
  -i "${IMGS[3]}" \
  -i "${IMGS[4]}" \
  -filter_complex "$FILTER" -map "[xout]" \
  -c:v libx264 -preset slow -crf 23 -movflags +faststart -an \
  "$OUT/p14-story.mp4"

# Poster frame from the opening still
ffmpeg -y -loglevel error -i "$OUT/p14-story.mp4" -vframes 1 -q:v 3 "$OUT/p14-story-poster.jpg"

ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "$OUT/p14-story.mp4"
echo "Video derived OK."
