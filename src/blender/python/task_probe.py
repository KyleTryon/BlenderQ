# scripts/blend_probe.py
import bpy, sys, json, os, datetime, math

# ---------------- helpers ----------------
scene = bpy.context.scene
frames = scene.frame_end - scene.frame_start + 1

out = {
    "frames"    : frames,
    "renderPath": bpy.path.abspath(scene.render.filepath),  # may be "//" relative
}
print(json.dumps(out))