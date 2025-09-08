#!/usr/bin/env python3
r"""
Simple image pipeline for heroBooks marketing images.

Features
- Resize to exact WxH using cover-style crop (mode=crop)
- Optional logo overlay bottom-right with automatic scaling
- Save as WebP/JPEG/PNG with configurable quality

Usage example (PowerShell):
  python .\hb_image_pipeline.py \
    --src "public/photos/landing/construction.webp" \
    --dst "public/photos/landing/construction-1024x640.webp" \
    --size 1024x640 \
    --logo "public/logos/heroBooks mini Color.png" \
    --mode crop \
    --quality 85

Requires: Pillow (pip install pillow)
Note: To save WebP, your Pillow build must include WebP support.
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Tuple, Optional

try:
    from PIL import Image, ImageOps
except Exception as e:  # pragma: no cover
    sys.stderr.write("Pillow is required. Install with: pip install pillow\n")
    raise


LANCZOS = Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.LANCZOS


def parse_size(value: str) -> Tuple[int, int]:
    # Accept x, X, or the Unicode multiplication sign ×
    normalized = value.replace("×", "x").replace("X", "x")
    if "x" not in normalized:
        raise argparse.ArgumentTypeError("--size must be WIDTHxHEIGHT, e.g., 1024x640")
    w_str, h_str = normalized.split("x", 1)
    try:
        w = int(w_str)
        h = int(h_str)
    except ValueError:
        raise argparse.ArgumentTypeError("--size must be integers like 1024x640")
    if w <= 0 or h <= 0:
        raise argparse.ArgumentTypeError("--size values must be positive")
    return w, h


@dataclass
class Options:
    src: Path
    dst: Path
    size: Tuple[int, int]
    mode: str
    logo: Optional[Path]
    quality: int
    logo_placement: str
    logo_opacity: int  # 0-100
    logo_scale: float  # percent of width


def cover_crop_resize(img: Image.Image, target: Tuple[int, int]) -> Image.Image:
    """Scale to cover, then center-crop to exactly target size."""
    tw, th = target
    sw, sh = img.size
    # Compute scale ratios
    scale = max(tw / sw, th / sh)
    new_w = int(round(sw * scale))
    new_h = int(round(sh * scale))
    resized = img.resize((new_w, new_h), LANCZOS)
    # Center crop
    left = (new_w - tw) // 2
    top = (new_h - th) // 2
    right = left + tw
    bottom = top + th
    return resized.crop((left, top, right, bottom))


def contain_fit_resize(img: Image.Image, target: Tuple[int, int]) -> Image.Image:
    """Scale to fit inside target box, no crop. Pads with transparency if needed."""
    tw, th = target
    sw, sh = img.size
    scale = min(tw / sw, th / sh)
    new_w = int(round(sw * scale))
    new_h = int(round(sh * scale))
    resized = img.resize((new_w, new_h), LANCZOS)
    # Create transparent canvas and paste centered
    canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    x = (tw - new_w) // 2
    y = (th - new_h) // 2
    canvas.paste(resized, (x, y))
    return canvas


def apply_logo(
    base: Image.Image,
    logo_path: Path,
    target_size: Tuple[int, int],
    placement: str = "bottom-right",
    opacity: int = 100,
    scale_percent: float = 15.0,
) -> Image.Image:
    """Overlay logo with placement, opacity, and scaling.

    placement: bottom-right|bottom-left|top-right|top-left|center
    opacity: 0-100 (applied multiplicatively to logo alpha)
    scale_percent: desired logo width as % of target width
    """
    try:
        logo = Image.open(logo_path).convert("RGBA")
    except OSError as e:
        raise RuntimeError(f"Failed to open logo {logo_path}: {e}")

    tw, th = target_size
    # Scale logo to specified percent of target width, but never upscale beyond original
    desired_w = max(1, int(round(tw * (scale_percent / 100.0))))
    if logo.width > 0 and desired_w < logo.width:
        scale = desired_w / logo.width
        new_w = int(round(logo.width * scale))
        new_h = int(round(logo.height * scale))
        logo = logo.resize((new_w, new_h), LANCZOS)

    # Apply additional opacity if requested
    opacity = max(0, min(100, int(opacity)))
    if opacity < 100:
        # Multiply existing alpha by opacity factor
        if logo.mode != "RGBA":
            logo = logo.convert("RGBA")
        alpha = logo.split()[-1]
        # Point operation to scale alpha
        factor = opacity / 100.0
        alpha = alpha.point(lambda a: int(a * factor))
        logo.putalpha(alpha)

    margin = max(4, int(round(tw * 0.03)))
    # Compute position based on placement
    if placement == "bottom-right":
        x = tw - logo.width - margin
        y = th - logo.height - margin
    elif placement == "bottom-left":
        x = margin
        y = th - logo.height - margin
    elif placement == "top-right":
        x = tw - logo.width - margin
        y = margin
    elif placement == "top-left":
        x = margin
        y = margin
    elif placement == "center":
        x = (tw - logo.width) // 2
        y = (th - logo.height) // 2
    else:
        raise ValueError("Invalid logo placement")

    # Ensure base is RGBA for alpha composition
    if base.mode != "RGBA":
        base = base.convert("RGBA")
    base.alpha_composite(logo, (x, y))
    return base


def save_image(img: Image.Image, dst: Path, quality: int) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    ext = dst.suffix.lower()

    params = {}
    if ext in {".jpg", ".jpeg"}:
        # JPEG has no alpha; convert
        if img.mode in ("RGBA", "LA"):
            img = img.convert("RGB")
        params.update({"quality": quality, "optimize": True, "progressive": True})
        fmt = "JPEG"
    elif ext == ".png":
        # For PNG, quality maps to compression level inversely (0-9). Keep default.
        fmt = "PNG"
    elif ext == ".webp":
        # Use lossy WebP quality; if quality==100, still use lossy unless we detect lossless need
        params.update({"quality": quality, "method": 6})
        fmt = "WEBP"
    else:
        # Fallback: infer from extension without extra params
        fmt = None

    try:
        if fmt:
            img.save(dst, format=fmt, **params)
        else:
            img.save(dst, **params)
    except OSError as e:
        # Common when Pillow lacks WebP support
        raise RuntimeError(f"Failed to save {dst}: {e}")


def process(opts: Options) -> None:
    # Load source with EXIF orientation applied
    try:
        src_img = Image.open(opts.src)
    except OSError as e:
        raise RuntimeError(f"Failed to open src {opts.src}: {e}")
    src_img = ImageOps.exif_transpose(src_img)

    # Work in RGBA for safe compositing
    if src_img.mode not in ("RGB", "RGBA"):
        src_img = src_img.convert("RGBA")

    if opts.mode == "crop":
        out_img = cover_crop_resize(src_img, opts.size)
    elif opts.mode == "fit":
        out_img = contain_fit_resize(src_img, opts.size)
    else:
        raise ValueError("Unsupported --mode. Use 'crop' or 'fit'.")

    if opts.logo:
        out_img = apply_logo(
            out_img,
            opts.logo,
            opts.size,
            placement=opts.logo_placement,
            opacity=opts.logo_opacity,
            scale_percent=opts.logo_scale,
        )

    save_image(out_img, opts.dst, opts.quality)


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="heroBooks image pipeline (resize, crop, logo, webp)")
    p.add_argument(
        "--src",
        required=True,
        nargs="+",
        help="Source image path(s) or glob(s), e.g., C:\\...\\*.webp",
    )
    p.add_argument(
        "--dst",
        required=True,
        type=Path,
        help=(
            "Destination file OR directory. If directory, outputs as name-WxH.ext inside it"
        ),
    )
    p.add_argument("--size", required=False, type=parse_size, help="Target size WIDTHxHEIGHT, e.g., 1024x640")
    p.add_argument("--logo", type=Path, default=None, help="Optional logo image (PNG recommended)")
    p.add_argument(
        "--mode",
        choices=["crop", "fit"],
        default=None,
        help="Resize strategy: 'crop' covers then center-crops; 'fit' contains with padding",
    )
    p.add_argument("--quality", type=int, default=85, help="Output quality (WebP/JPEG)")
    p.add_argument(
        "--inplace",
        action="store_true",
        help="Keep original filenames. If --dst is a directory, write there; otherwise alongside source",
    )
    p.add_argument(
        "--preset",
        choices=["avatar", "landing"],
        help=(
            "Preset defaults: avatar=512x512 crop; landing=1024x640 fit. Explicit flags override the preset"
        ),
    )
    p.add_argument(
        "--logo-placement",
        choices=["bottom-right", "bottom-left", "top-right", "top-left", "center"],
        default="bottom-right",
        help="Logo placement (default: bottom-right)",
    )
    p.add_argument("--logo-opacity", type=int, default=100, help="Logo opacity 0-100 (default 100)")
    p.add_argument("--logo-scale", type=float, default=15.0, help="Logo width as %% of output width")
    return p


def resolve_sources(patterns: Tuple[str, ...]) -> list[Path]:
    from glob import glob
    out: list[Path] = []
    for pat in patterns:
        matches = glob(pat)
        if not matches:
            # treat as literal path
            matches = [pat]
        for m in matches:
            p = Path(m)
            if p.is_file():
                out.append(p)
    # de-duplicate while preserving order
    seen = set()
    unique: list[Path] = []
    for p in out:
        if p.resolve() not in seen:
            seen.add(p.resolve())
            unique.append(p)
    return unique


def infer_output_path(src: Path, dst_arg: Path, target_size: Tuple[int, int], inplace: bool = False) -> Path:
    """Determine output path.

    - If inplace=True: keep same filename; write into --dst directory if provided, else alongside src.
    - Else: if --dst is a directory-like path, write name-WxH.ext inside it; if a file path, use it as-is.
    """
    if inplace:
        if dst_arg.exists() and dst_arg.is_dir():
            return dst_arg / src.name
        if dst_arg.suffix == "":
            # Treat as a directory path even if it doesn't exist yet
            return dst_arg / src.name
        # Specific file provided; allow single-source overwrite
        return dst_arg

    # Non-inplace behavior: append -WxH when writing into a directory
    if dst_arg.exists() and dst_arg.is_dir():
        out_dir = dst_arg
    elif dst_arg.suffix == "":
        out_dir = dst_arg
    else:
        # Specific file provided
        return dst_arg

    tw, th = target_size
    stem = src.stem
    ext = src.suffix or ".webp"
    out_name = f"{stem}-{tw}x{th}{ext}"
    return out_dir / out_name


def main(argv: Optional[list[str]] = None) -> int:
    args = build_arg_parser().parse_args(argv)

    # Apply preset defaults where options were not provided
    preset_size: Optional[Tuple[int, int]] = None
    preset_mode: Optional[str] = None
    if args.preset == "avatar":
        preset_size = (512, 512)
        preset_mode = "crop"
    elif args.preset == "landing":
        preset_size = (1024, 640)
        preset_mode = "fit"

    final_size = args.size or preset_size
    final_mode = args.mode or preset_mode or "crop"
    if not final_size:
        sys.stderr.write("Either provide --size or choose a --preset that defines a size.\n")
        return 2

    sources = resolve_sources(tuple(args.src))
    if not sources:
        sys.stderr.write("No source files matched.\n")
        return 2

    errors = 0
    for i, src in enumerate(sources, 1):
        dst_path = infer_output_path(src, args.dst, final_size, inplace=args.inplace)
        opts = Options(
            src=src,
            dst=dst_path,
            size=final_size,
            mode=final_mode,
            logo=args.logo,
            quality=args.quality,
            logo_placement=args.logo_placement,
            logo_opacity=args.logo_opacity,
            logo_scale=args.logo_scale,
        )
        try:
            process(opts)
            print(f"[{i}/{len(sources)}] Wrote {dst_path}")
        except Exception as e:
            errors += 1
            sys.stderr.write(f"[{i}/{len(sources)}] Error processing {src}: {e}\n")

    return 0 if errors == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
