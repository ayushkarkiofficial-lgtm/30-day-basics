"""Day 24: generate share-preview + favicon assets for the Tasklift app."""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = "D:/Claude/30_day_plan/experiments/websites/tasklift-mvp-app/public"
os.makedirs(OUT, exist_ok=True)
BG = (15, 23, 42)        # slate-900
ACCENT = (56, 189, 248)  # sky-400
WHITE = (241, 245, 249)  # slate-100
MUTED = (148, 163, 184)  # slate-400

def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

bold = "C:/Windows/Fonts/arialbd.ttf"
reg  = "C:/Windows/Fonts/arial.ttf"

# ---- OG image 1200x630 ----
W, H = 1200, 630
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
d.rectangle([0, 0, 16, H], fill=ACCENT)
d.rounded_rectangle([80, 90, 200, 210], radius=24, fill=ACCENT)
d.text((140, 150), "T", font=font(bold, 86), fill=BG, anchor="mm")
d.text((80, 270), "Tasklift", font=font(bold, 96), fill=WHITE)
d.text((84, 400), "Review manual workflows.", font=font(reg, 44), fill=WHITE)
d.text((84, 460), "Plan the automation that matters.", font=font(reg, 44), fill=MUTED)
d.text((84, 555), "snazzy-conkies-2372cf.netlify.app", font=font(reg, 32), fill=ACCENT)
img.save(os.path.join(OUT, "og-image.png"), optimize=True)

# ---- apple-touch-icon 180x180 ----
S = 180
icon = Image.new("RGB", (S, S), ACCENT)
ImageDraw.Draw(icon).text((S//2, S//2 - 6), "T", font=font(bold, 120), fill=BG, anchor="mm")
icon.save(os.path.join(OUT, "apple-touch-icon.png"), optimize=True)

# ---- favicon-32.png ----
icon.resize((32, 32), Image.LANCZOS).save(os.path.join(OUT, "favicon-32.png"), optimize=True)

for f in ("og-image.png", "apple-touch-icon.png", "favicon-32.png"):
    p = os.path.join(OUT, f)
    print(f, Image.open(p).size, os.path.getsize(p), "bytes")
