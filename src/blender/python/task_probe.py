# scripts/blend_probe.py
import bpy, json, os, re

scene = bpy.context.scene
frames = scene.frame_end - scene.frame_start + 1

#
# Resolve the absolute filepath (may already contain "####")
filepath_abs = bpy.path.abspath(scene.render.filepath)

# Split path into directory and filename components
dir_path, file_part = os.path.split(filepath_abs)

# Ensure the directory path ends with a separator so plain string‑concat works later
if dir_path and not dir_path.endswith(os.sep):
    dir_path += os.sep

# Extract base name and frame‑padding length from any trailing #'s
m = re.match(r"^(.*?)(#+)$", file_part)
if m:
    base_name = m.group(1)
    frame_padding = len(m.group(2))
else:
    base_name = os.path.splitext(file_part)[0] or scene.name
    # If the user is rendering a single still frame and provided no "#" placeholders,
    # we don't add any padding. Otherwise assume Blender's default 4‑digit padding.
    if frames == 1:
        frame_padding = 0
    else:
        frame_padding = 4  # Default padding when no hashes and multiple frames

# Build the frame pattern (e.g. "cube####")
frame_pattern = f"{base_name}{'#' * frame_padding}" if frame_padding > 0 else base_name

# Directory containing the renders, without the filename
render_dir = dir_path

# Determine file extension from Blender's image settings
file_format = scene.render.image_settings.file_format.lower()
extensions = {
    'png': '.png',
    'jpeg': '.jpg',
    'jpg': '.jpg',
    'targa': '.tga',
    'tiff': '.tif',
    'bmp': '.bmp',
    'open_exr': '.exr',
    'ffmpeg': '.mp4',
}

extension = extensions.get(file_format, '')

out = {
    "frames": frames,
    "renderPath": render_dir,
    "renderFilename": frame_pattern,  # Extension explicitly excluded
    "renderExtension": extension,
}

print(json.dumps(out))