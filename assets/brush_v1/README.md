# Brush Sprite Assets v1

Runtime-ready sprite atlas for the current hand-painted xianxia asset pass.

Included animations:
- Player move (6), attack (6)
- Red wolf walk (6), attack (6), death (4)
- Spirit herbs low/mid/high (4 frames each)
- Return portal (6)

Runtime rules:
- Load `brush_v1_atlas.png` once.
- Frame rectangles, FPS, looping and anchors are defined in `manifest.json`.
- Actors face right; flip horizontally for left-facing motion.
- Common anchor is bottom-center.

This is a first-pass mobile runtime atlas. Larger source cuts are kept out of the web build to keep loading light and can be replaced as the asset pass continues.
