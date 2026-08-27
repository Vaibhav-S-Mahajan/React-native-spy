#!/usr/bin/env python3
"""Generate docs/assets/banner.png — the hero banner at the top of README.md.

Why a script instead of a checked-in binary someone made in Figma: the banner
restates the product name, tagline and panel list, all of which live in the
README and landing/src/data/content.js. Generating it keeps the banner honest
when the copy changes, and keeps the repo free of an image nobody can rebuild.

This is a brand banner, deliberately NOT a fake screenshot. It draws the real
logo geometry and the real panel names; it does not invent UI that looks like a
capture of the running app. For an actual screenshot, capture one.

Usage:
    python3 scripts/make-readme-banner.py

Requires Pillow. Re-run and commit the result when the product copy or the brand
mark changes. Colours mirror src/renderer/styles/theme.css (graphite, the default
theme), so the banner, the site and the app share one palette.
"""

import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is required: pip install Pillow")

W, H = 1280, 448

# Tokens copied from src/renderer/styles/theme.css :root. Literals rather than
# parsed out of the CSS: a regex over a stylesheet is a lot of machinery for
# eight colours.
BG = (10, 10, 12)
PANEL = (17, 17, 20)
BORDER = (42, 42, 48)
TEXT = (242, 242, 243)
TEXT_DIM = (168, 168, 176)
TEXT_FAINT = (108, 108, 118)
ACCENT = (34, 197, 94)
PURPLE = (167, 139, 250)
BLUE = (96, 165, 250)
AMBER = (245, 166, 35)
RED = (248, 113, 113)

FONT_DIRS = [
    "/System/Library/Fonts",
    "/System/Library/Fonts/Supplemental",
    "/Library/Fonts",
    "/usr/share/fonts/truetype/dejavu",
    "/usr/share/fonts/truetype/liberation",
]

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


def draw_logo(size):
    """The brand mark: a signal trace seen through a lens.

    Geometry is transcribed from the 32-unit viewBox in
    src/renderer/components/rnspy-devtools/Logo.jsx — change both together.

    Drawn at 4x and downsampled, because Pillow has no anti-aliasing on shape
    primitives; at 1x the lens ring and the trace come out visibly stepped.
    """
    ss = 4
    s = size * ss
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    u = s / 32.0  # one viewBox unit, in supersampled pixels

    def w(units):
        return max(1, round(units * u))

    # Badge.
    d.rounded_rectangle([1 * u, 1 * u, 31 * u, 31 * u], radius=9 * u, fill=PURPLE)

    # Rim light. Pillow grows an outline inward from the bounding box, while SVG
    # centres a stroke on the path — so the bbox here is the SVG stroke's OUTER
    # edge (1.75 - 1.5/2 = 1.0), which lands the ink in the same place.
    d.rounded_rectangle(
        [1 * u, 1 * u, 31 * u, 31 * u],
        radius=9 * u,
        outline=(255, 255, 255, 36),
        width=w(1.5),
    )

    # Lens. Same inward-outline correction: r=8.25 with a 2.25 stroke spans
    # 7.125..9.375, so the bbox radius is 9.375.
    cx = cy = 16 * u
    r_out = (8.25 + 2.25 / 2) * u
    d.ellipse([cx - r_out, cy - r_out, cx + r_out, cy + r_out], fill=BG)
    d.ellipse(
        [cx - r_out, cy - r_out, cx + r_out, cy + r_out],
        outline=(255, 255, 255, 255),
        width=w(2.25),
    )

    # Waveform. joint="curve" rounds the interior joints; Pillow has no
    # stroke-linecap, so the two endpoints get an explicit dot each.
    pts = [(10.3, 16), (12.2, 16), (13.7, 11.7), (15.4, 20), (17.3, 13.8), (19, 16), (21.7, 16)]
    px = [(x * u, y * u) for x, y in pts]
    d.line(px, fill=ACCENT, width=w(2), joint="curve")
    cap = u  # half of the 2-unit stroke
    for x, y in (px[0], px[-1]):
        d.ellipse([x - cap, y - cap, x + cap, y + cap], fill=ACCENT)

    return img.resize((size, size), Image.LANCZOS)


def draw_grid(d):
    """Faint technical grid, echoing the site's Background.css."""
    step, colour = 42, (18, 18, 22)
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=colour)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=colour)


def draw_glow(img):
    """Two soft radial blooms, mirroring the site's green and purple glows.

    Concentric translucent ellipses rather than a Gaussian blur pass — smooth
    enough at this size and much cheaper.
    """
    overlay = Image.new("RGB", (W, H), BG)
    od = ImageDraw.Draw(overlay)
    for cx, cy, radius, colour in ((150, 70, 400, ACCENT), (1130, 400, 430, PURPLE)):
        steps = 60
        for i in range(steps, 0, -1):
            r = radius * i / steps
            t = 0.06 * (1 - i / steps) ** 2
            od.ellipse(
                [cx - r, cy - r, cx + r, cy + r],
                fill=tuple(int(BG[c] + (colour[c] - BG[c]) * t) for c in range(3)),
            )
    img.paste(Image.blend(img, overlay, 0.55), (0, 0))


def main():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    draw_grid(d)
    draw_glow(img)

    f_title = load(SANS_BOLD, 66, bold=True)
    f_tag = load(SANS, 25)
    f_chip = load(SANS, 19)
    f_badge = load(MONO, 17)

    # ── Mark, centred ──
    logo_size = 104
    logo = draw_logo(logo_size)
    img.paste(logo, ((W - logo_size) // 2, 44), logo)

    # ── Wordmark. Two colours so "Spy" carries the emphasis, matching the
    #    gradient treatment the site's hero headline uses on its payoff word. ──
    parts = [("React Native ", TEXT), ("Spy", ACCENT)]
    total = sum(d.textlength(t, font=f_title) for t, _ in parts)
    x, y = (W - total) / 2, 172
    for text, colour in parts:
        d.text((x, y), text, font=f_title, fill=colour)
        x += d.textlength(text, font=f_title)

    # ── Tagline ──
    tag = "See everything your React Native app does."
    d.text(((W - d.textlength(tag, font=f_tag)) / 2, 258), tag, font=f_tag, fill=TEXT_DIM)

    # ── Panel chips: the six inspectors, colour-matched to the app's tab bar ──
    chips = [
        ("Network", AMBER),
        ("WebSocket", BLUE),
        ("Console", ACCENT),
        ("Storage", PURPLE),
        ("WatermelonDB", RED),
        ("Logs", TEXT_DIM),
    ]
    gap = 11
    widths = [d.textlength(label, font=f_chip) + 42 for label, _ in chips]
    x = (W - (sum(widths) + gap * (len(chips) - 1))) / 2
    y = 316
    for (label, colour), cw in zip(chips, widths):
        d.rounded_rectangle([x, y, x + cw, y + 38], radius=19, fill=PANEL, outline=BORDER)
        d.ellipse([x + 15, y + 15, x + 23, y + 23], fill=colour)
        d.text((x + 31, y + 10), label, font=f_chip, fill=TEXT_DIM)
        x += cw + gap

    # ── Footer badges ──
    badges = ["MIT licensed", "macOS · Windows · Linux", "No Metro dependency", "Zero new deps"]
    sep = "  ·  "
    line = sep.join(badges)
    d.text(((W - d.textlength(line, font=f_badge)) / 2, 392), line, font=f_badge, fill=TEXT_FAINT)

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(root, "docs", "assets")
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, "banner.png")
    img.save(out, "PNG", optimize=True)
    print(f"wrote {out} ({os.path.getsize(out) / 1024:.1f} kB, {W}x{H})")


if __name__ == "__main__":
    main()
