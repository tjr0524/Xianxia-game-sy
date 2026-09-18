#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image


def edge_alpha_max(alpha: Image.Image) -> int:
    width, height = alpha.size
    edges = (
        alpha.crop((0, 0, width, 1)),
        alpha.crop((0, height - 1, width, height)),
        alpha.crop((0, 0, 1, height)),
        alpha.crop((width - 1, 0, width, height)),
    )
    return max(edge.getextrema()[1] for edge in edges)


def validate(pack_root: Path) -> None:
    boss_root = pack_root / "boss"
    manifest = json.loads(
        (boss_root / "foundation_guardian_sprite_manifest.json").read_text(encoding="utf-8")
    )
    grid = manifest["grid"]
    columns = int(grid["columns"])
    rows = int(grid["rows"])
    cell_width = int(grid["cell_width"])
    cell_height = int(grid["cell_height"])

    for layer_name, relative_name in manifest["layers"].items():
        path = boss_root / relative_name
        image = Image.open(path).convert("RGBA")
        expected = (columns * cell_width, rows * cell_height)
        if image.size != expected:
            raise AssertionError(f"{layer_name}: {image.size} != {expected}")

        for row in range(rows):
            for column in range(columns):
                frame = image.crop(
                    (
                        column * cell_width,
                        row * cell_height,
                        (column + 1) * cell_width,
                        (row + 1) * cell_height,
                    )
                )
                if edge_alpha_max(frame.getchannel("A")) != 0:
                    raise AssertionError(
                        f"{layer_name}: edge alpha at row={row + 1}, column={column + 1}"
                    )

    frames = sorted((boss_root / "frames").glob("row*_*.png"))
    if len(frames) != columns * rows:
        raise AssertionError(f"frame count {len(frames)} != {columns * rows}")
    for frame_path in frames:
        frame = Image.open(frame_path).convert("RGBA")
        if frame.size != (cell_width, cell_height):
            raise AssertionError(f"{frame_path.name}: invalid size {frame.size}")
        if edge_alpha_max(frame.getchannel("A")) != 0:
            raise AssertionError(f"{frame_path.name}: non-zero edge alpha")

    if manifest["scale_policy"]["per_frame_scale_allowed"]:
        raise AssertionError("per-frame scale must remain disabled")

    grounded = set(manifest["grounded_frames"])
    ground_y = int(manifest["pivot"]["ground_y"])
    tolerance = int(manifest["pivot"]["ground_tolerance_px"])
    body_root = boss_root / manifest["frame_directories"]["body"]
    for frame_name in grounded:
        alpha = Image.open(body_root / f"{frame_name}.png").convert("RGBA").getchannel("A")
        bbox = alpha.point(lambda value: 255 if value > 8 else 0).getbbox()
        if bbox is None:
            raise AssertionError(f"{frame_name}: empty body frame")
        body_bottom = bbox[3]
        if abs(body_bottom - ground_y) > tolerance:
            raise AssertionError(
                f"{frame_name}: ground bottom {body_bottom} outside {ground_y}±{tolerance}"
            )

    print(
        f"PASS character={manifest['character']} grid={columns}x{rows} "
        f"cell={cell_width}x{cell_height} frames={len(frames)} "
        f"uniform_source_scale={manifest['scale_policy']['uniform_source_scale']} "
        f"per_frame_scale=false"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pack_root", type=Path)
    args = parser.parse_args()
    validate(args.pack_root)


if __name__ == "__main__":
    main()
