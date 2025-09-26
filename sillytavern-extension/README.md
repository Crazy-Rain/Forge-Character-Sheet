# Celestial Forge SillyTavern Extension

This extension provides seamless integration of the Celestial Forge character sheet system with SillyTavern.

## Installation

### Method 1: Direct Installation
1. Download this entire `sillytavern-extension` folder
2. Copy it to your SillyTavern installation at: `public/scripts/extensions/celestial-forge/`
3. Restart SillyTavern
4. Go to Extensions tab and enable "Celestial Forge Character Sheet"

### Method 2: GitHub Integration (if available)
1. In SillyTavern, go to Extensions → Extension Manager
2. Click "Install from URL"
3. Use: `https://github.com/Crazy-Rain/Forge-Character-Sheet/tree/main/sillytavern-extension`

## Features

### Automatic CP Tracking
- Monitors all chat messages (both user and AI)
- Automatically detects and updates CP values
- Supports multiple CP format patterns
- Tracks both current and total CP earned

### Interactive Perk Selection
- Domain-based random rolling system
- Only shows affordable perks
- Detailed perk information with descriptions
- One-click perk selection and CP deduction

### Sheet Management
- View all selected perks
- Remove perks with CP refund
- Export sheet in AI-ready format
- Clear entire sheet functionality

### SillyTavern Integration
- Embeds directly in the extensions panel
- Auto-saves progress to localStorage
- Copies formatted output to clipboard
- Manual CP parsing from messages

## Usage

### Basic Workflow
1. **Enable the extension** in SillyTavern Extensions tab
2. **Add CP** either manually or by parsing AI responses
3. **Select perks** using the domain → perk selection system
4. **Export sheet** to copy formatted output for AI responses

### CP Management
- **Auto-tracking**: Extension automatically detects CP in messages
- **Manual parsing**: Click "Parse Last Message" to scan manually  
- **Manual adjustment**: Use "Add CP" for direct CP management
- **Reset**: Clear all CP data if needed

### Perk Selection Process
1. Click "Select Perk" (requires CP > 0)
2. Choose from 4 random domains
3. Select from up to 4 affordable perks in that domain
4. Perk is automatically added to sheet and CP deducted
5. Return to domain selection for next perk

### Sheet Export
The extension generates output in the exact format needed for AI responses:

```html
<div align="center"> <b>THE CELESTIAL FORGE</b> </div>
<hr>
[Perk Name] - Origin - CP Cost
[Perk Description]
<hr>
Current CP: XXX
Total Perks: X
<hr>
```

### Settings
- **Auto-track CP**: Automatically parse CP from all messages
- **Auto-insert sheet**: Automatically append sheet to AI responses (future feature)

## File Structure

```
sillytavern-extension/
├── manifest.json      # Extension metadata
├── index.js          # Main extension logic
├── style.css         # Extension styling
├── perks.json        # Perk database
└── README.md         # This file
```

## Troubleshooting

### Extension Not Loading
- Ensure the folder is in the correct location: `public/scripts/extensions/celestial-forge/`
- Check that all files are present (manifest.json, index.js, style.css, perks.json)
- Restart SillyTavern completely
- Check browser console for errors

### CP Not Detecting
- The extension looks for patterns like "CP: 500", "500 Choice Points", etc.
- Try "Parse Last Message" for manual parsing
- Check that auto-tracking is enabled in settings
- Ensure the message contains clear CP values

### Perks Not Loading
- Verify `perks.json` is present and not corrupted
- Check browser console for loading errors
- Try refreshing the page

### Export Not Working
- Try the manual copy button if clipboard access fails
- Check that you have perks selected first
- Manually copy from the textarea if needed

## Advanced Usage

### Custom Integration
The extension exposes a global object for advanced users:

```javascript
window.celestialForgeExtension.parseCP(text)     // Parse CP from text
window.celestialForgeExtension.updateCP(amount)  // Set CP amount
window.celestialForgeExtension.generateSheetExport() // Get sheet export
```

### Storage
- All data is stored in localStorage with key `celestial-forge-data`
- Includes currentCP, totalCP, and currentSheet array
- Data persists between sessions

## Support

For issues, questions, or contributions:
- GitHub: https://github.com/Crazy-Rain/Forge-Character-Sheet
- Check the main README.md for additional documentation

## Changelog

### v1.0.0
- Initial release
- Automatic CP tracking
- Interactive perk selection
- Sheet management and export
- SillyTavern integration