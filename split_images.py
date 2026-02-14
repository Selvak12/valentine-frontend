try:
    from PIL import Image # type: ignore
except ImportError:
    print("Error: The 'Pillow' library is not installed.")
    print("Please run: pip install Pillow")
    exit(1)

import os
import glob

# Search for the uploaded file - check local directory first
local_files = glob.glob('**/media__1771040804991.jpg', recursive=True)
if local_files:
    img_path = local_files[0]
else:
    # Fallback to the specific global path if not found locally
    search_path = r'C:\Users\HP\.gemini\**\media__1771040804991.jpg'
    files = glob.glob(search_path, recursive=True)
    if not files:
        print("Error: Could not find the uploaded image locally or in .gemini folder.")
        exit(1)
    img_path = files[0]

output_dir = r'src/assets/carousel'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

img = Image.open(img_path)
width, height = img.size

w_slice = width // 2
h_slice = height // 2

for i in range(2):
    for j in range(2):
        left = j * w_slice
        top = i * h_slice
        right = (j + 1) * w_slice
        bottom = (i + 1) * h_slice
        
        slice_img = img.crop((left, top, right, bottom))
        slice_img.save(os.path.join(output_dir, f'story_{i*2+j+1}.jpg'))

print(f"Success: Split {img_path} into 4 images in {output_dir}")
