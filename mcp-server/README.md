# Celestial Forge MCP Server

An MCP (Model Context Protocol) server that provides AI assistants direct access to Celestial Forge character sheet functionality.

## Installation

```bash
cd mcp-server
npm install
```

## Usage

### Starting the Server
```bash
npm start          # Production
npm run dev        # Development with auto-reload
```

### MCP Client Configuration

Add to your MCP client configuration:
```json
{
  "mcpServers": {
    "celestial-forge": {
      "command": "node",
      "args": ["path/to/mcp-server/server.js"]
    }
  }
}
```

## Available Tools

### CP Management
- `parse_cp_from_text` - Extract CP values from text
- `get_current_cp` - Get current CP status and statistics  
- `set_cp` - Manually set current CP value
- `add_cp` - Add CP to current total

### Perk Selection
- `get_domain_options` - Get random domain options for perk selection
- `get_perks_from_domain` - Get available perks from a specific domain
- `select_perk` - Select a perk and add it to the character sheet

### Sheet Management
- `get_current_sheet` - Get the current character sheet with all selected perks
- `generate_sheet_export` - Generate formatted sheet export for AI responses
- `clear_sheet` - Clear all selected perks and refund CP
- `remove_perk` - Remove a specific perk from the sheet and refund its CP

## Example Usage

### Basic Workflow
1. **Parse CP from AI response**:
   ```json
   {
     "name": "parse_cp_from_text",
     "arguments": {
       "text": "You have gained 500 Choice Points from your actions!"
     }
   }
   ```

2. **Get available domains**:
   ```json
   {
     "name": "get_domain_options",
     "arguments": {}
   }
   ```

3. **Get perks from a domain**:
   ```json
   {
     "name": "get_perks_from_domain",
     "arguments": {
       "domain": "Crafting - Artisan"
     }
   }
   ```

4. **Select a perk**:
   ```json
   {
     "name": "select_perk",
     "arguments": {
       "domain": "Crafting - Artisan",
       "perk_name": "Artisan"
     }
   }
   ```

5. **Generate sheet for AI response**:
   ```json
   {
     "name": "generate_sheet_export",
     "arguments": {}
   }
   ```

### Advanced Usage

**Check current status**:
```json
{
  "name": "get_current_cp",
  "arguments": {}
}
```

**Manually adjust CP**:
```json
{
  "name": "add_cp",
  "arguments": {
    "cp": 100
  }
}
```

**Remove a perk**:
```json
{
  "name": "remove_perk",
  "arguments": {
    "perk_name": "Artisan"
  }
}
```

## Output Format

The server generates sheet exports in the requested format:

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

## Integration Examples

### Claude with MCP
Once configured, you can ask Claude:
- "Parse this text for CP: 'You now have 750 choice points'"
- "Show me available domains for perk selection"
- "Select the Artisan perk from Crafting domain"
- "Generate my current Celestial Forge sheet"

### Custom Applications
```javascript
// Connect to MCP server
const client = new MCPClient();
await client.connect('stdio', { command: 'node', args: ['server.js'] });

// Parse CP from text
const result = await client.callTool('parse_cp_from_text', {
  text: 'You have 500 Choice Points available'
});

// Get and select perks
const domains = await client.callTool('get_domain_options', {});
const perks = await client.callTool('get_perks_from_domain', {
  domain: 'Assistants'
});
const selection = await client.callTool('select_perk', {
  domain: 'Assistants',
  perk_name: 'Butler'
});

// Generate formatted output
const sheet = await client.callTool('generate_sheet_export', {});
```

## Features

### Automatic CP Parsing
Detects CP values in various formats:
- "You have 500 Choice Points"
- "CP: 450"
- "450 CP remaining"
- "Current choice points: 600"

### Intelligent Perk Selection
- Only shows affordable perks based on current CP
- Random selection system for variety
- Detailed perk information including descriptions
- Automatic CP deduction upon selection

### Persistent State
- Maintains current CP, total CP earned, and selected perks
- State persists for the duration of the server session
- Can be extended with file-based persistence if needed

## Error Handling

The server provides clear error messages for:
- Invalid perk selections
- Insufficient CP for purchases
- Missing domains or perks
- Malformed requests

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for server implementation
- `fs/promises` - File system operations
- `path` - Path utilities

## Development

### Adding New Tools
1. Add tool definition to `ListToolsRequestSchema` handler
2. Implement tool logic in `CallToolRequestSchema` handler
3. Update documentation

### Extending Functionality
The server can be extended with:
- File-based persistence
- Multi-user support
- Advanced perk filtering
- Integration with external APIs

## Troubleshooting

### Server Won't Start
- Check Node.js version (requires modern version with ES modules)
- Verify all dependencies are installed: `npm install`
- Check that `perks.json` exists in parent directory

### Tools Not Working
- Verify MCP client is properly configured
- Check server logs for error messages
- Ensure all required parameters are provided

### Perk Data Issues
- Verify `perks.json` is valid JSON
- Check file permissions
- Ensure the file contains the expected data structure

## Contributing

Contributions welcome! Areas for improvement:
- Additional tool implementations
- Better error handling
- Performance optimizations
- Extended functionality

## License

Open source - use and modify as needed for your Celestial Forge adventures!