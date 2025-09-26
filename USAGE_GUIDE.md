# 📚 Celestial Forge Usage Guide

Complete guide for using the Celestial Forge Character Sheet system in various scenarios.

## 🚀 Quick Start Options

### Option 1: Standalone Web Interface (Easiest)
```bash
# In the repository directory
python -m http.server 8000
# Open http://localhost:8000/forge-enhanced.html
```

### Option 2: SillyTavern Extension (Recommended for ST users)
```bash
# Run the installer
./install-sillytavern.sh /path/to/your/SillyTavern
# Restart SillyTavern and enable the extension
```

### Option 3: MCP Server (For AI applications)
```bash
cd mcp-server
npm install && npm start
# Configure your MCP client
```

## 🎯 Core Workflow

### 1. CP (Choice Points) Management

**Automatic Tracking (Recommended)**:
- Paste AI responses containing CP mentions
- System automatically detects patterns like:
  - "You have 500 Choice Points"
  - "CP: 450"
  - "500 CP remaining"
  - "Remaining choice points: 300"

**Manual Management**:
- Use "Add CP" button for direct CP addition
- "Subtract CP" for manual deduction
- "Reset CP" to clear all CP data

### 2. Perk Selection Process

**Step-by-Step**:
1. **Ensure you have CP** (current CP > 0)
2. **Choose Domain**: Select from 4 randomly generated domains
3. **Choose Perk**: Select from up to 4 affordable perks in that domain
4. **Automatic Processing**: Perk added to sheet, CP deducted
5. **Repeat**: Return to domain selection for additional perks

**Domain Categories Include**:
- Assistants (helpers, companions, AI)
- Breeding (genetics, reproduction)
- Crafting - Artisan (artistic creation)
- Databases - Magical (knowledge repositories)
- Facilities - Magical (workshops, labs)
- Knowledge - Reverse Engineering
- Quality - Resources
- Skills - Alchemy
- Supplies - Mundane
- Vehicles (transportation, mechs)
- And many more...

### 3. Sheet Management

**View Current Sheet**:
- See all selected perks with details
- Track total CP spent
- Remove individual perks (with CP refund)

**Export for AI**:
- Copy formatted output for AI responses
- Generated in the exact format requested:
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

## 🔧 Integration Scenarios

### Scenario 1: Solo Roleplay with AI

**Setup**: Use standalone web interface
**Workflow**:
1. Open `forge-enhanced.html`
2. Start with some CP (manually add or parse from AI)
3. Select perks based on story progression
4. Copy export and paste into AI prompts
5. AI includes perk information in responses

**Example AI Prompt**:
```
[Your roleplay context...]

Current Character Sheet:
<div align="center"> <b>THE CELESTIAL FORGE</b> </div>
<hr>
[Butler] - Big O - 100 CP
This old man offers to be your butler, capable of cooking, repairing tech, and helping with daily life. Comes with a motorcycle with rocket launcher.
<hr>
Current CP: 400
Total Perks: 1
<hr>

Continue the story, and if I gain more CP, include it in your response.
```

### Scenario 2: SillyTavern Integration

**Setup**: Install SillyTavern extension
**Workflow**:
1. Extension automatically tracks CP from AI responses
2. Use extension panel to select perks
3. Export functionality copies to clipboard
4. Paste into SillyTavern messages or persona description

**Benefits**:
- Automatic CP detection from all messages
- Integrated UI within SillyTavern
- Persistent storage between sessions
- One-click perk selection and export

### Scenario 3: Group Roleplay

**Setup**: Share the standalone interface URL
**Workflow**:
1. Host runs local server: `python -m http.server 8000`
2. Share `http://your-ip:8000/forge-enhanced.html` with group
3. Each player manages their own sheet
4. GM tracks CP awards and player progress
5. Players export sheets for character updates

### Scenario 4: MCP with Claude/AI

**Setup**: Configure MCP server
**Workflow**:
```
User: "I just defeated the boss. Parse this response for CP: 'Your victory grants you 750 choice points to spend.'"

Claude: [Uses parse_cp_from_text tool]
Found CP: 750. Updated from 200 to 750. Total CP earned: 1050

User: "Show me available domains for perk selection"

Claude: [Uses get_domain_options tool]
Available domains:
- Assistants (46 total, 1 affordable)
- Crafting - Artisan (100 total, 42 affordable)
- Vehicles (57 total, 43 affordable)
- Knowledge - Reverse Engineering (46 total, 9 affordable)

User: "Get perks from Assistants domain"

Claude: [Uses get_perks_from_domain tool]
Available perks from Assistants:
**Butler** (Big O) [100 CP]
This old man offers to be your butler, capable of cooking...

User: "Select the Butler perk"

Claude: [Uses select_perk tool]
Successfully selected "Butler" for 100 CP. Remaining CP: 650

User: "Generate my current sheet"

Claude: [Uses generate_sheet_export tool]
<div align="center"> <b>THE CELESTIAL FORGE</b> </div>
<hr>
[Butler] - Big O - 100 CP
This old man offers to be your butler...
<hr>
Current CP: 650
Total Perks: 1
<hr>
```

## 💡 Tips and Best Practices

### CP Management
- **Start conservatively**: Don't spend all CP immediately
- **Track story beats**: Major victories = more CP
- **Plan ahead**: Save CP for expensive, powerful perks
- **Use auto-parsing**: Let the system track CP for you

### Perk Selection Strategy
- **Synergy focus**: Choose perks that complement each other
- **Story-driven**: Select perks that fit your character's journey
- **Domain diversity**: Explore different domains for variety
- **Cost consideration**: Balance cheap utility with expensive power

### Integration Tips
- **Regular exports**: Keep your AI/character sheet updated
- **Backup data**: Save/export your sheet regularly
- **Clear formatting**: Ensure exported text is properly formatted
- **Consistency**: Use the same format across all platforms

## 🐛 Troubleshooting

### CP Not Detected
- Check the text contains clear CP values
- Try manual parsing with "Parse AI Response" button
- Use standard formats: "CP: 500" or "500 Choice Points"
- Verify auto-tracking is enabled (SillyTavern extension)

### Perks Not Loading
- Ensure `perks.json` is present and accessible
- Check browser console for errors
- Verify server is running (for web interface)
- Try refreshing the page

### Export Issues
- Try manual copy from textarea if clipboard fails
- Check that perks are actually selected
- Verify the format matches expected output
- Test with different browsers if needed

### SillyTavern Extension Issues
- Verify extension is in correct directory
- Check all files are present (manifest.json, index.js, etc.)
- Restart SillyTavern completely
- Enable extension in Extensions tab

## 📋 Common Workflows

### Daily Roleplay Session
1. Load previous sheet data
2. Parse new CP from AI responses
3. Select 1-2 new perks based on story
4. Export updated sheet
5. Continue roleplay with new abilities

### Character Creation
1. Start with initial CP allocation
2. Select foundation perks (assistants, basic skills)
3. Plan character concept around selected perks
4. Export initial sheet for character description
5. Begin roleplay with established baseline

### Campaign Management
1. GM sets CP rewards for achievements
2. Players update sheets after sessions
3. Export sheets shared with group
4. Track character progression over time
5. Balance encounters around character capabilities

## 🎨 Customization

### Modifying Perks
- Edit `perks.json` to add/modify perks
- Follow existing JSON structure
- Include name, origin, cost, description
- Test changes by reloading interface

### UI Customization
- Modify CSS in `style.css` (extension) or `forge-enhanced.html`
- Change colors, fonts, layout
- Add custom themes or branding
- Maintain responsive design principles

### Adding Features
- Fork the repository
- Add new functionality to relevant files
- Test across all integration methods
- Submit pull requests for improvements

## 🤝 Community Usage

### Sharing Sheets
- Export as JSON for full sheet sharing
- Use formatted text for quick sharing
- Include CP totals and perk counts
- Share screenshots of interface for visual reference

### Collaborative Campaigns
- Use shared server hosting
- Coordinate CP awards with GM
- Track party synergies and combinations
- Document character interactions and perk effects

This guide should cover most usage scenarios. For additional help, check the repository README or open an issue on GitHub!