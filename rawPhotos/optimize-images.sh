#!/bin/bash
#
# optimize-images.sh
# Παίρνει φωτογραφίες (HEIC, JPG, PNG) από έναν φάκελο εισόδου,
# τις κάνει resize + compress, και βγάζει optimized .jpg + .webp
# μέσα σε έναν φάκελο εξόδου, έτοιμες για τη σελίδα.
#
# Χρήση:
#   ./optimize-images.sh [input_folder] [output_folder] [max_width]
#
# Χωρίς ορίσματα, δουλεύει πάνω στο δικό μας layout:
#   είσοδος  = ο φάκελος rawPhotos (εκεί που ζει κι αυτό το script)
#   έξοδος   = src/images (ο φάκελος που διαβάζει το ίδιο το HTML)
#
# Παράδειγμα (custom φάκελοι):
#   ./optimize-images.sh ./raw-photos ./some/other/folder 1600
#
# Πρώτη φορά, εγκατάστησε τα εργαλεία (μόνο μία φορά):
#   sudo apt update
#   sudo apt install -y imagemagick libheif-examples webp
#
# Το imagemagick κάνει resize/compress γενικά.
# Το libheif-examples δίνει το "heif-convert" για τα .HEIC αρχεία iPhone.
# Το webp δίνει το "cwebp" για τη μετατροπή σε .webp.

set -e

# Το script εντοπίζει τον δικό του φάκελο, ώστε τα defaults να δουλεύουν
# σωστά ανεξάρτητα από το πού βρίσκεται ο χρήστης όταν το τρέχει.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

INPUT_DIR="${1:-$SCRIPT_DIR}"
OUTPUT_DIR="${2:-$SCRIPT_DIR/../src/images}"
MAX_WIDTH="${3:-1600}"
JPG_QUALITY=80
WEBP_QUALITY=75

if [ ! -d "$INPUT_DIR" ]; then
  echo "Ο φάκελος εισόδου δεν υπάρχει: $INPUT_DIR"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

# Έλεγχος ότι υπάρχουν τα απαραίτητα εργαλεία.
# Σε Windows/Git-Bash υπάρχει ήδη ένα δικό των Windows "convert.exe"
# (εργαλείο μετατροπής FAT->NTFS, τίποτα σχετικό με εικόνες) που θα
# "περάσει" ένα απλό `command -v convert`, οπότε επιβεβαιώνουμε ότι
# πρόκειται πράγματι για το ImageMagick πριν το εμπιστευτούμε.
if command -v magick >/dev/null 2>&1; then
  CONVERT_CMD="magick"
elif command -v convert >/dev/null 2>&1 && convert -version 2>/dev/null | grep -qi imagemagick; then
  CONVERT_CMD="convert"
else
  echo "Λείπει το ImageMagick (convert/magick). Τρέξε: sudo apt install -y imagemagick"
  exit 1
fi
command -v cwebp >/dev/null 2>&1 || { echo "Λείπει το cwebp. Τρέξε: sudo apt install -y webp"; exit 1; }

TOTAL_BEFORE=0
TOTAL_AFTER=0
COUNT=0

echo "Optimizing φωτογραφίες από '$INPUT_DIR' -> '$OUTPUT_DIR' (max width: ${MAX_WIDTH}px)"
echo "----------------------------------------------------------------------"

shopt -s nullglob nocaseglob
for FILE in "$INPUT_DIR"/*.heic "$INPUT_DIR"/*.jpg "$INPUT_DIR"/*.jpeg "$INPUT_DIR"/*.png; do
  [ -e "$FILE" ] || continue

  FILENAME=$(basename "$FILE")
  BASENAME="${FILENAME%.*}"
  EXT="${FILENAME##*.}"
  EXT_LOWER=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')

  BEFORE_SIZE=$(stat -c%s "$FILE")
  TOTAL_BEFORE=$((TOTAL_BEFORE + BEFORE_SIZE))

  TMP_JPG="/tmp/${BASENAME}_tmp.jpg"

  if [ "$EXT_LOWER" == "heic" ]; then
    # Μετατροπή HEIC -> JPG πρώτα
    if command -v heif-convert >/dev/null 2>&1; then
      heif-convert -q 90 "$FILE" "$TMP_JPG" >/dev/null 2>&1
    else
      echo "Λείπει το heif-convert για το $FILENAME. Τρέξε: sudo apt install -y libheif-examples"
      continue
    fi
  else
    cp "$FILE" "$TMP_JPG"
  fi

  # Resize + compress -> τελικό .jpg
  OUT_JPG="$OUTPUT_DIR/${BASENAME}.jpg"
  "$CONVERT_CMD" "$TMP_JPG" -auto-orient -resize "${MAX_WIDTH}>" -strip -quality "$JPG_QUALITY" "$OUT_JPG"

  # -> .webp από το ίδιο optimized jpg
  OUT_WEBP="$OUTPUT_DIR/${BASENAME}.webp"
  cwebp -quiet -q "$WEBP_QUALITY" "$OUT_JPG" -o "$OUT_WEBP"

  rm -f "$TMP_JPG"

  AFTER_SIZE=$(stat -c%s "$OUT_JPG")
  TOTAL_AFTER=$((TOTAL_AFTER + AFTER_SIZE))
  COUNT=$((COUNT + 1))

  BEFORE_KB=$((BEFORE_SIZE / 1024))
  AFTER_KB=$((AFTER_SIZE / 1024))
  echo "  $FILENAME: ${BEFORE_KB}KB -> ${AFTER_KB}KB (+ .webp)"
done

echo "----------------------------------------------------------------------"
if [ "$COUNT" -eq 0 ]; then
  echo "Δεν βρέθηκαν φωτογραφίες στο '$INPUT_DIR'."
else
  TOTAL_BEFORE_KB=$((TOTAL_BEFORE / 1024))
  TOTAL_AFTER_KB=$((TOTAL_AFTER / 1024))
  echo "Έγιναν $COUNT φωτογραφίες. Σύνολο: ${TOTAL_BEFORE_KB}KB -> ${TOTAL_AFTER_KB}KB"
  echo "Οι optimized φωτογραφίες είναι στο: $OUTPUT_DIR"
fi
