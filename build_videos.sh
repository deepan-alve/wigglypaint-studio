#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/export"
SCENES=(kajal lolaakku mascara lipstick bangles kolusu pottu dhavani boy natural doll malli raani sooniyam)
# song order index for nice filenames
i=1
mkdir -p mov gif seq_png
for k in "${SCENES[@]}"; do
  n=$(printf "%02d" $i)
  # build a looped numbered sequence (cycle 0,1,2 -> ~3s at 9fps)
  rm -rf "$k/seq"; mkdir -p "$k/seq"; j=0
  for rep in $(seq 1 9); do for f in 0 1 2; do cp "$k/f$f.png" "$k/seq/$(printf '%03d' $j).png"; j=$((j+1)); done; done
  # ProRes 422 HQ .mov, 4x nearest-neighbour upscale (1420x1044), looping ~3s
  ffmpeg -y -loglevel error -framerate 9 -i "$k/seq/%03d.png" \
     -vf "scale=1420:1044:flags=neighbor" -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le \
     "mov/${n}_${k}.mov"
  # upscaled PNG frames (exact pixels) for image-sequence import
  for f in 0 1 2; do ffmpeg -y -loglevel error -i "$k/f$f.png" -vf "scale=1420:1044:flags=neighbor" "seq_png/${n}_${k}_f${f}.png"; done
  # quick preview GIF (2x)
  ffmpeg -y -loglevel error -framerate 9 -i "$k/seq/%03d.png" -vf "scale=710:522:flags=neighbor" -loop 0 "gif/${n}_${k}.gif"
  echo "done ${n}_${k}"
  i=$((i+1))
done
