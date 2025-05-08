#!/usr/bin/env python
import bpy, json, argparse, sys

# ---------- arg parsing ----------
p = argparse.ArgumentParser()
p.add_argument("--outDir", required=True)
p.add_argument("--pattern", required=True)
p.add_argument("--ext", required=True)
p.add_argument("--start", type=int, required=True)
p.add_argument("--end",   type=int, required=True)
args, _ = p.parse_known_args(sys.argv[sys.argv.index("--") + 1:])

scn = bpy.context.scene
scn.frame_start, scn.frame_end = args.start, args.end
scn.render.filepath = args.outDir + args.pattern
if args.ext:
    scn.render.filepath += args.ext

total = scn.frame_end - scn.frame_start + 1
state = {"rendered": 0, "total": total}

# ---------- progress hooks ----------
def _after_frame(scene, depsgraph):
    state["rendered"] += 1
    pct = int(state["rendered"] / total * 100)
    print(json.dumps({"progress": pct}), flush=True)

bpy.app.handlers.render_write.append(_after_frame)

try:
    bpy.ops.render.render(animation=True)
    print(json.dumps({"status": "DONE"}), flush=True)
except Exception as e:
    print(json.dumps({"status": "ERROR", "msg": str(e)}), flush=True)
    raise