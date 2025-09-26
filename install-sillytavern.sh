#!/bin/bash

# Celestial Forge SillyTavern Extension Installer
# Usage: ./install-sillytavern.sh [path-to-sillytavern]

echo "🌌 Celestial Forge SillyTavern Extension Installer"
echo "=================================================="

# Check if SillyTavern path is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide the path to your SillyTavern installation"
    echo "Usage: $0 /path/to/SillyTavern"
    echo ""
    echo "Example: $0 ~/SillyTavern"
    exit 1
fi

SILLYTAVERN_PATH="$1"
EXTENSIONS_PATH="$SILLYTAVERN_PATH/public/scripts/extensions"
TARGET_PATH="$EXTENSIONS_PATH/celestial-forge"

# Check if SillyTavern directory exists
if [ ! -d "$SILLYTAVERN_PATH" ]; then
    echo "❌ Error: SillyTavern directory not found at: $SILLYTAVERN_PATH"
    exit 1
fi

# Check if extensions directory exists
if [ ! -d "$EXTENSIONS_PATH" ]; then
    echo "❌ Error: Extensions directory not found at: $EXTENSIONS_PATH"
    echo "This might not be a valid SillyTavern installation."
    exit 1
fi

echo "📁 SillyTavern found at: $SILLYTAVERN_PATH"
echo "📦 Installing extension to: $TARGET_PATH"

# Create extension directory
mkdir -p "$TARGET_PATH"

# Copy extension files
echo "📋 Copying extension files..."
cp -r sillytavern-extension/* "$TARGET_PATH/"

# Verify installation
if [ -f "$TARGET_PATH/manifest.json" ] && [ -f "$TARGET_PATH/index.js" ]; then
    echo "✅ Installation successful!"
    echo ""
    echo "Next steps:"
    echo "1. Restart SillyTavern"
    echo "2. Go to Extensions tab"
    echo "3. Enable 'Celestial Forge Character Sheet'"
    echo ""
    echo "🎉 Happy forging!"
else
    echo "❌ Installation failed. Please check file permissions and try again."
    exit 1
fi