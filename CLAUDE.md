# Vivi 农场 · 小黑狗的小世界 - Project Organizer

This document tracks progress, generated assets, and scripts for the Vivi 农场 website project.

## Project Structure

Always keep prompts and images organized within the project directory.

- `/images/` - All generated images saved here, organized by category if necessary
- `/prompts/` - Saved JSON prompt configurations corresponding to generated images
- `/scripts/` - Utility scripts for image generation and API interaction
- `master_prompt_reference.md` - JSON schema and guide for Nano Banana 2 prompting (in skills folder)

## Image Generation Workflow

When generating images:

1. Use the **Nano Banana image generation skill** to generate images.
2. Save the resulting image to the correctly categorized subfolder inside `/images/` (e.g., `/images/characters/`). If a specific category cannot be determined, save it to `/images/miscellaneous/`.
3. Save the corresponding prompt JSON to `/prompts/`, mirroring the same subfolder used for the image.
4. When processing multiple images at the same time, run generation commands in parallel.

## Image Categories

- `/images/characters/` - Vivi 角色图, 小黑狗插图
- `/images/farm/` - 农场场景, 背景图
- `/images/album/` - 相册里的图片
- `/images/miscellaneous/` - 其他

## Scripts

Scripts live globally in the skills folder (available to all projects):

| Script | Purpose |
|--------|---------|
| `~/Desktop/Projects/skills/.agents/skills/nano-banana-images/scripts/generate_kie.py` | Generate image via Kie.ai API |
| `~/Desktop/Projects/skills/.agents/skills/nano-banana-images/scripts/get_kie_image.py` | Retrieve a previously submitted task by taskId |

**Usage (run from project root):**
```bash
SKILL=~/Desktop/Projects/skills/.agents/skills/nano-banana-images
python3 $SKILL/scripts/generate_kie.py prompts/my_prompt.json images/characters/vivi.jpg "4:5"
python3 $SKILL/scripts/get_kie_image.py <taskId> images/characters/vivi.jpg
```
