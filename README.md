# After Effects Layer Expansion Script

This script automates the process of creating a dynamic, expandable region around a selected layer in After Effects. It allows you to choose between vertical or horizontal expansion. Once selected, it sets up a controller null layer with sliders to adjust crop, slide, stretch, and brightness. Additionally, it duplicates the main layer and uses expressions to rearrange and mask it accordingly. The script also places helpful guides at common compositional points (center, quarter, and three-quarter lines) to aid in alignment.

## Features

- **Expansion Direction:** Choose either Vertical or Horizontal expansion.
- **Automated Setup:** Creates a "Controller" Layer with slider controls for:
  - **Crop:** Adjust how much of the stretched area is visible.
  - **Slide:** Move the main layer within the expanded region.
  - **Stretch:** Control how much the background layer is stretched.
  - **Brightness:** Adjust the brightness of the stretched background layer.
- **Layer Arrangement:** Automatically duplicates and arranges layers (Controller, Stretch Layer, and Main Layer).
- **Guides for Alignment:** Places vertical and horizontal guides at:
  - Center (1/2)
  - One-quarter (1/4)
  - Three-quarters (3/4)
  
  This makes it easier to align your subject and elements within the composition.

## Requirements

- Adobe After Effects (tested on recent versions).
- The ability to run ExtendScript (.jsx) scripts in After Effects.

## Installation

1. **Save the script:**  
   Place the `.jsx` script file into the `Scripts` or `Scripts/ScriptUI Panels` folder in your After Effects installation directory.
   
   For example:
   - Windows: `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\`
   - macOS: `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/`

2. **Restart After Effects:**  
   After placing the script, restart After Effects so it can detect the new script.

## Usage

1. **Open a Composition:**  
   Make sure you have an active composition open.

2. **Select a Layer:**  
   Select the main layer in the composition that you want to be the focus of the expansion.

3. **Run the Script:**
   - If placed in `ScriptsUI Panels`, go to `Window > [Your Script Name]` to open it as a panel.
   - Otherwise, go to `File > Scripts > Run Script File...` and select your script.

4. **Choose Expansion Direction:**
   A dialog will appear prompting you to pick either "Vertical" or "Horizontal" expansion.

5. **Adjust Controls:**
   Once set up, you’ll see a "Controller" null layer at the top of your layer stack.  
   It contains slider controls for:
   - **Crop**: Adjust the stretch mask size.
   - **Slide**: Move the main layer within the expanded area.
   - **Stretch**: Increase or decrease how much the duplicate layer is stretched.
   - **Brightness**: Adjust the brightness of the stretched background.

6. **Use Guides:**
   The script automatically adds guides at:
   - Horizontal center (composition width/2), 1/4 and 3/4
   - Vertical center (composition height/2), 1/4 and 3/4

   These guides help with alignment and composition framing.

## Notes

- Make sure only one main layer is selected before running the script.
- The newly created Stretch Layer and Controller Null help manage the look of the expanded region.
- The script uses expressions and a Brightness & Contrast effect to control the background layer appearance.

## Credits

- Created by Koray Birand.

## License

This script is provided “as is,” without warranty of any kind. Use, modify, and distribute at your own discretion.
