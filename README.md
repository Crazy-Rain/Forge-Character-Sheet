# 🌌 Celestial Forge Character Sheet

A comprehensive character sheet system for Celestial Forge roleplay, featuring automatic CP tracking, perk selection, and seamless SillyTavern integration.

![Celestial Forge Interface](https://github.com/user-attachments/assets/09ff7b3e-6760-48b8-920a-e952374b2576)

## ✨ Features

- **Automatic CP Tracking**: Parses AI responses to automatically track Choice Points
- **Interactive Perk Selection**: Random domain and perk rolling system
- **SillyTavern Integration**: Multiple integration options (Extension, Iframe, MCP Server)
- **Sheet Export**: Generates formatted output for AI responses
- **Persistent Storage**: Saves progress locally
- **Modern UI**: Dark theme with responsive design
- **Cross-Platform Compatible**: Works in all environments including Termux, mobile browsers, and restricted sandboxes
- **Integrated Configuration**: Built-in modal configuration panel (no popup windows required)

## 🚀 Quick Start

### Standalone Usage
1. Open `forge-enhanced.html` in your browser
2. Start a local server: `python -m http.server 8000`
3. Navigate to `http://localhost:8000/forge-enhanced.html`

### SillyTavern Extension
1. Copy the `sillytavern-extension` folder to your SillyTavern `public/scripts/extensions/` directory
2. Restart SillyTavern
3. Enable "Celestial Forge" in the Extensions tab

### MCP Server (for Claude/AI integration)
1. Install dependencies: `cd mcp-server && npm install`
2. Run server: `npm start`
3. Configure your MCP client to connect to the server

## 📖 Usage Guide

### CP Management
1. **Manual CP**: Use "Add CP" button or paste AI responses
2. **Auto-parsing**: The system detects patterns like:
   - "You have 500 Choice Points"
   - "CP: 450"
   - "500 CP remaining"

### Perk Selection
1. Select a domain from random options
2. Choose from affordable perks in that domain
3. Perks are automatically added to your sheet
4. CP is deducted automatically

### SillyTavern Integration
1. Copy the generated sheet format from the export area
2. Paste into AI responses in the format:
   ```
   <div align="center"> <b>THE CELESTIAL FORGE</b> </div>
   <hr>
   [Perk Name] - Origin - CP Cost
   [Perk Description]
   <hr>
   Current CP: XXX
   Total Perks: X
   <hr>
   ```

### Configuration & Management
Click the **⚙️ Configuration** button to access the integrated modal with:
- **Perk Browser**: Search and explore 2,800+ perks across 40 domains
- **Sheet Manager**: Save, load, export, and manage multiple character sheets
- **Import/Export**: Import/export sheets, perks database, and settings
- **Settings**: Configure auto-save, confirmations, and display preferences

*Note: The configuration modal works in all environments, including mobile devices and restricted environments like Termux where popup windows may fail.*

## 🔧 Integration Options

### 1. SillyTavern Extension
- **Pros**: Full integration, automatic CP tracking from messages
- **Cons**: Requires SillyTavern setup
- **Best for**: Regular SillyTavern users

### 2. Iframe Integration
- **Pros**: Easy to embed, works in any web interface
- **Cons**: Limited cross-frame communication
- **Best for**: Custom web interfaces

### 3. MCP Server
- **Pros**: Direct AI integration, programmatic access
- **Cons**: Requires MCP-compatible client
- **Best for**: Claude/AI applications with MCP support

### 4. Standalone Usage
- **Pros**: No dependencies, works anywhere
- **Cons**: Manual copy/paste workflow
- **Best for**: Any setup, maximum compatibility

## 📁 File Structure

```
├── forge.html                 # Original interface
├── forge-enhanced.html        # Enhanced interface with modern UI
├── perks.json                # Perk database
├── sillytavern-extension/     # SillyTavern extension
│   ├── manifest.json
│   ├── index.js
│   ├── style.css
│   └── perks.json
├── mcp-server/               # MCP server implementation
│   ├── package.json
│   ├── server.js
│   └── README.md
└── README.md
```

## 🎯 Key Features Explained

### Automatic CP Tracking
The system uses advanced regex patterns to detect CP values in text:
- Handles multiple formats and variations
- Tracks both current and total CP earned
- Updates automatically from AI responses

### Perk Selection System
- **Random Rolling**: Generates 4 random domains, then 4 random affordable perks
- **Cost Validation**: Only shows perks you can afford
- **Detailed Display**: Shows perk name, origin, cost, and description
- **Instant Feedback**: Immediate CP deduction and sheet updates

### Export Format
Generates the exact format requested:
```html
<div align="center"> <b>THE CELESTIAL FORGE</b> </div>
<hr>
[Perk Name] - Origin - CP Cost
[Perk Description]
<hr>
Current CP: XXX
Perk Count: X
<hr>
```

## 🛠️ Development

### Local Development
```bash
# Serve files locally
python -m http.server 8000

# For MCP server development
cd mcp-server
npm install
npm run dev
```

### Extension Development
The SillyTavern extension provides:
- Automatic message parsing
- Integration with chat interface
- Persistent storage
- Modern UI components

## 📝 Notes

- All data is stored locally in browser localStorage
- Perk database contains 1000+ perks across multiple domains
- Compatible with all modern browsers
- Responsive design works on mobile devices

## 🤝 Contributing

Feel free to contribute by:
- Adding new perks to the database
- Improving the UI/UX
- Adding new integration options
- Fixing bugs or issues

## 📄 License

This project is open source. Feel free to use, modify, and distribute as needed for your Celestial Forge adventures!
