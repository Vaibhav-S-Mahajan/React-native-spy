#!/usr/bin/env python3
"""Generate public/og.png — the 1200x630 social card for the landing page.

Why a script instead of a checked-in binary that someone edits in Figma: the card
restates the product name, tagline and panel list, all of which live in
src/data/content.js. Generating it keeps the card honest when the copy changes,
and keeps the repo free of a binary nobody knows how to regenerate.

Usage:
    python3 scripts/make-og-image.py

Requires Pillow. Re-run and commit the result when PRODUCT copy changes.
Design mirrors src/index.css tokens so the card matches the site and the app.
"""

import os
import struct
import sys
import zlib

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is required: pip install Pillow")

W, H = 1200, 630

# Tokens copied from src/index.css. Kept as literals rather than parsed out of
# the CSS: a regex over a stylesheet is a lot of machinery for six colours.
BG = (10, 10, 12)
PANEL = (17, 17, 20)
BORDER = (42, 42, 48)
BORDER_SUBTLE = (34, 34, 38)
TEXT = (242, 242, 243)
TEXT_DIM = (168, 168, 176)
TEXT_FAINT = (108, 108, 118)
ACCENT = (34, 197, 94)
PURPLE = (167, 139, 250)
BLUE = (96, 165, 250)
AMBER = (245, 166, 35)

FONT_DIRS = [
    "/System/Library/Fonts",
    "/System/Library/Fonts/Supplemental",
    "/Library/Fonts",
    "/usr/share/fonts/truetype/dejavu",
    "/usr/share/fonts/truetype/liberation",
]

# Ordered by preference. The card is generated on a developer machine or CI, so
# it has to degrade gracefully rather than assume a specific font is present.
SANS_BOLD = ["Helvetica.ttc", "Arial Bold.ttf", "DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf"]
SANS = ["Helvetica.ttc", "Arial.ttf", "DejaVuSans.ttf", "LiberationSans-Regular.ttf"]
MONO = ["Menlo.ttc", "Courier New.ttf", "DejaVuSansMono.ttf", "LiberationMono-Regular.ttf"]


def find_font(candidates):
    for name in candidates:
        for d in FONT_DIRS:
            path = os.path.join(d, name)
            if os.path.exists(path):
                return path
    return None


def load(candidates, size, bold=False):
    path = find_font(candidates)
    if not path:
        return ImageFont.load_default()
    try:
        # Helvetica.ttc bundles regular at index 0 and bold at 1.
        if path.endswith(".ttc"):
            return ImageFont.truetype(path, size, index=1 if bold else 0)
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def main():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    f_title = load(SANS_BOLD, 74, bold=True)
    f_tag = load(SANS, 30)
    f_meta = load(MONO, 21)
    f_chip = load(SANS, 21)
    f_badge = load(MONO, 19)

    draw_grid(d)
    draw_glow(img)

    pad = 74

    # Accent rule — the same green the app uses for its connected state.
    d.rectangle([pad, 92, pad + 74, 97], fill=ACCENT)

    # Wordmark. Two weights so "Spy" carries the emphasis, matching the
    # gradient treatment the hero headline uses on its payoff word.
    y = 126
    x = pad
    for text, colour in (("React Native ", TEXT), ("Spy", ACCENT)):
        d.text((x, y), text, font=f_title, fill=colour)
        x += d.textlength(text, font=f_title)

    d.text((pad, 232), "Remote debugger for React Native", font=f_tag, fill=TEXT_DIM)

    # Panel chips — the six inspectors, colour-matched to the app's tab bar.
    chips = [
        ("Network", AMBER),
        ("WebSocket", BLUE),
        ("Console", ACCENT),
        ("Storage", PURPLE),
        ("WatermelonDB", (248, 113, 113)),
        ("Logs", TEXT_DIM),
    ]
    x, y = pad, 306
    for label, colour in chips:
        w = d.textlength(label, font=f_chip) + 46
        if x + w > W - pad:
            x, y = pad, y + 52
        d.rounded_rectangle([x, y, x + w, y + 42], radius=21, fill=PANEL, outline=BORDER)
        d.ellipse([x + 17, y + 17, x + 25, y + 25], fill=colour)
        d.text((x + 33, y + 11), label, font=f_chip, fill=TEXT_DIM)
        x += w + 12

    # Terminal-style strip: what a developer actually types to connect.
    strip_y = 430
    d.rounded_rectangle([pad, strip_y, W - pad, strip_y + 62], radius=10,
                        fill=(12, 12, 15), outline=BORDER_SUBTLE)
    d.text((pad + 24, strip_y + 20), "$", font=f_meta, fill=ACCENT)
    d.text((pad + 48, strip_y + 20), "import './rnspy.connection'", font=f_meta, fill=TEXT)
    d.text((pad + 48 + d.textlength("import './rnspy.connection'", font=f_meta) + 20, strip_y + 20),
           "// one line, dev-only", font=f_meta, fill=TEXT_FAINT)

    # Footer badges.
    badges = ["MIT licensed", "macOS · Windows · Linux", "No Metro dependency", "Zero new deps"]
    x, y = pad, 545
    for i, label in enumerate(badges):
        if i:
            d.text((x, y), "·", font=f_badge, fill=(58, 58, 66))
            x += d.textlength("·", font=f_badge) + 16
        d.text((x, y), label, font=f_badge, fill=TEXT_FAINT)
        x += d.textlength(label, font=f_badge) + 16

    out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "og.png")
    img.save(out, "PNG", optimize=True)
    print(f"wrote {out} ({os.path.getsize(out) / 1024:.1f} kB, {W}x{H})")


def draw_grid(d):
    """Faint technical grid, echoing Background.css on the site."""
    step, colour = 42, (18, 18, 22)
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=colour)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=colour)


def draw_glow(img):
    """Two soft radial blooms, mirroring the site's green and purple glows.

    Drawn as concentric translucent ellipses on an overlay rather than with a
    Gaussian blur, which keeps the gradient smooth without a filter pass.
    """
    overlay = Image.new("RGB", (W, H), BG)
    od = ImageDraw.Draw(overlay)
    for cx, cy, radius, colour in ((150, 120, 380, ACCENT), (1080, 560, 420, PURPLE)):
        steps = 60
        for i in range(steps, 0, -1):
            r = radius * i / steps
            # Quadratic falloff reads closer to a real blur than a linear ramp.
            t = 0.055 * (1 - i / steps) ** 2
            od.ellipse([cx - r, cy - r, cx + r, cy + r],
                       fill=tuple(int(BG[c] + (colour[c] - BG[c]) * t) for c in range(3)))
    img.paste(Image.blend(img, overlay, 0.55), (0, 0))


if __name__ == "__main__":
    main()
