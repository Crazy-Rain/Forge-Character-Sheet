import { eventSource, event_types } from "../../../../script.js";
import { extension_settings, getContext } from "../../../extensions.js";

const extensionName = "celestial-forge";
const extensionFolderPath = `scripts/extensions/${extensionName}`;

let perksData = {};
let currentCP = 0;
let totalCP = 0;
let currentSheet = [];

// Extension settings with defaults
const defaultSettings = {
    enabled: true,
    autoTrackCP: true,
    autoInsertSheet: true,
    cpPatterns: [
        "(?:current\\s+)?(?:choice\\s+)?(?:points?|cp)(?:\\s*:?\\s*)(\\d+)",
        "(\\d+)\\s*(?:choice\\s+)?(?:points?|cp)",
        "cp\\s*(?:total|current|available)?\\s*:?\\s*(\\d+)",
        "total\\s*cp\\s*:?\\s*(\\d+)",
        "remaining\\s*(?:cp|choice\\s*points?)\\s*:?\\s*(\\d+)"
    ]
};

// Load extension settings
function loadSettings() {
    if (!extension_settings[extensionName]) {
        extension_settings[extensionName] = structuredClone(defaultSettings);
    }
}

// Save extension settings
function saveSettings() {
    const context = getContext();
    context.saveSettingsDebounced();
}

// Load perks data
async function loadPerksData() {
    try {
        const response = await fetch(`${extensionFolderPath}/perks.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        perksData = await response.json();
        console.log("Celestial Forge: Perks data loaded successfully");
    } catch (error) {
        console.error("Celestial Forge: Failed to load perks data:", error);
        // Fallback - try to load from the main directory
        try {
            const fallbackResponse = await fetch('/perks.json');
            if (fallbackResponse.ok) {
                perksData = await fallbackResponse.json();
                console.log("Celestial Forge: Fallback perks data loaded");
            }
        } catch (fallbackError) {
            console.error("Celestial Forge: Fallback load also failed:", fallbackError);
        }
    }
}

// Parse CP from text using configured patterns
function parseCP(text) {
    const settings = extension_settings[extensionName];
    if (!settings.autoTrackCP) return null;

    for (const patternStr of settings.cpPatterns) {
        try {
            const pattern = new RegExp(patternStr, 'gi');
            const matches = [...text.matchAll(pattern)];
            if (matches.length > 0) {
                const cpValue = parseInt(matches[matches.length - 1][1]);
                if (!isNaN(cpValue) && cpValue >= 0) {
                    return cpValue;
                }
            }
        } catch (error) {
            console.warn(`Celestial Forge: Invalid regex pattern: ${patternStr}`, error);
        }
    }
    return null;
}

// Update CP values
function updateCP(newCP) {
    const oldCP = currentCP;
    currentCP = newCP;
    
    // Only increase total if CP went up
    if (newCP > oldCP) {
        totalCP += (newCP - oldCP);
    }
    
    // Update UI
    updateCPDisplay();
    saveData();
    
    console.log(`Celestial Forge: CP updated from ${oldCP} to ${newCP} (Total: ${totalCP})`);
}

// Update CP display in the UI
function updateCPDisplay() {
    const cpDisplay = document.getElementById('celestial-forge-cp');
    const spentCP = currentSheet.reduce((sum, perk) => sum + (perk.cost || 0), 0);
    
    if (cpDisplay) {
        cpDisplay.innerHTML = `
            <div>Current CP: <span class="${currentCP > 0 ? 'cf-available-cp' : 'cf-insufficient-cp'}">${currentCP}</span></div>
            <div>Total Earned: <span>${totalCP}</span></div>
            <div>Spent: <span>${spentCP}</span></div>
        `;
    }
}

// Generate random items from array
function getRandomItems(arr, n) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
}

// Generate perk selection options
function generatePerkOptions() {
    if (!perksData || Object.keys(perksData).length === 0) {
        return { domains: [], perks: [] };
    }
    
    const domains = Object.keys(perksData);
    const randomDomains = getRandomItems(domains, Math.min(4, domains.length));
    
    return {
        domains: randomDomains,
        perks: []
    };
}

// Get perks from a domain
function getPerksFromDomain(domainName) {
    if (!perksData[domainName]) return [];
    
    const perks = perksData[domainName];
    const affordablePerks = perks.filter(perk => (perk.cost || 0) <= currentCP);
    
    return getRandomItems(affordablePerks, Math.min(4, affordablePerks.length));
}

// Add perk to sheet
function addPerkToSheet(perk) {
    const cost = perk.cost || 0;
    if (cost > currentCP) {
        alert(`Insufficient CP! You need ${cost} CP but only have ${currentCP} CP.`);
        return false;
    }
    
    currentSheet.push(perk);
    currentCP -= cost;
    updateCPDisplay();
    updateSheetDisplay();
    saveData();
    
    console.log(`Celestial Forge: Added perk "${perk.name}" for ${cost} CP`);
    return true;
}

// Generate sheet export text
function generateSheetExport() {
    let text = '<div align="center"> <b>THE CELESTIAL FORGE</b> </div>\n<hr>\n';
    
    currentSheet.forEach(perk => {
        const name = perk.name || "Unknown Perk";
        const origin = perk.origin || "Unknown";
        const cost = perk.cost || 0;
        const description = perk.description || "No description available";
        
        text += `[${name}] - ${origin} - ${cost} CP\n`;
        text += `${description}\n`;
        
        if (perk.sub_perks && perk.sub_perks.length > 0) {
            perk.sub_perks.forEach(subPerk => {
                const subName = subPerk.name || "Unknown Sub-Perk";
                const subOrigin = subPerk.origin || "Unknown";
                const subCost = subPerk.cost || 0;
                text += `  └ ${subName} - ${subOrigin} - ${subCost} CP\n`;
            });
        }
        
        text += '<hr>\n';
    });
    
    const spentCP = currentSheet.reduce((sum, perk) => sum + (perk.cost || 0), 0);
    text += `Current CP: ${currentCP}\n`;
    text += `Total Perks: ${currentSheet.length}\n`;
    text += '<hr>\n';
    
    return text;
}

// Update sheet display
function updateSheetDisplay() {
    const sheetDisplay = document.getElementById('celestial-forge-sheet');
    if (!sheetDisplay) return;
    
    if (currentSheet.length === 0) {
        sheetDisplay.innerHTML = '<div class="cf-empty">No perks selected yet</div>';
        return;
    }
    
    let html = '';
    currentSheet.forEach((perk, index) => {
        const name = perk.name || "Unknown Perk";
        const origin = perk.origin || "Unknown";
        const cost = perk.cost || 0;
        const description = perk.description || "No description available";
        
        html += `
            <div class="cf-perk-entry">
                <div class="cf-perk-header">
                    <strong>${name}</strong> (${origin}) [${cost} CP]
                    <button class="cf-remove-perk" data-index="${index}">×</button>
                </div>
                <div class="cf-perk-description">${description}</div>
            </div>
        `;
    });
    
    sheetDisplay.innerHTML = html;
    
    // Add remove button event listeners
    sheetDisplay.querySelectorAll('.cf-remove-perk').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removePerkFromSheet(index);
        });
    });
}

// Remove perk from sheet
function removePerkFromSheet(index) {
    if (index >= 0 && index < currentSheet.length) {
        const removedPerk = currentSheet.splice(index, 1)[0];
        currentCP += (removedPerk.cost || 0);
        updateCPDisplay();
        updateSheetDisplay();
        saveData();
        console.log(`Celestial Forge: Removed perk "${removedPerk.name}"`);
    }
}

// Save data to localStorage
function saveData() {
    const data = {
        currentCP,
        totalCP,
        currentSheet
    };
    localStorage.setItem('celestial-forge-data', JSON.stringify(data));
}

// Load data from localStorage
function loadData() {
    try {
        const data = localStorage.getItem('celestial-forge-data');
        if (data) {
            const parsed = JSON.parse(data);
            currentCP = parsed.currentCP || 0;
            totalCP = parsed.totalCP || 0;
            currentSheet = parsed.currentSheet || [];
            updateCPDisplay();
            updateSheetDisplay();
        }
    } catch (error) {
        console.error("Celestial Forge: Failed to load saved data:", error);
    }
}

// Create the extension UI
function createExtensionUI() {
    const template = `
        <div id="celestial-forge-panel">
            <h3>🌌 Celestial Forge</h3>
            
            <div class="cf-section">
                <h4>Choice Points</h4>
                <div id="celestial-forge-cp" class="cf-cp-display"></div>
                <div class="cf-controls">
                    <button id="cf-add-cp">Add CP</button>
                    <button id="cf-reset-cp">Reset CP</button>
                    <button id="cf-manual-parse">Parse Last Message</button>
                </div>
            </div>
            
            <div class="cf-section">
                <h4>Perk Selection</h4>
                <div id="cf-domain-selection" style="display: none;">
                    <h5>Choose Domain:</h5>
                    <div id="cf-domains" class="cf-choice-grid"></div>
                    <button id="cf-reroll-domains">Reroll Domains</button>
                </div>
                
                <div id="cf-perk-selection" style="display: none;">
                    <h5>Choose Perk from <span id="cf-selected-domain"></span>:</h5>
                    <div id="cf-perks" class="cf-choice-grid"></div>
                    <button id="cf-reroll-perks">Reroll Perks</button>
                    <button id="cf-back-to-domains">Back to Domains</button>
                </div>
                
                <button id="cf-start-selection" style="display: block;">Select Perk</button>
            </div>
            
            <div class="cf-section">
                <h4>Current Sheet</h4>
                <div id="celestial-forge-sheet" class="cf-sheet-display"></div>
                <div class="cf-controls">
                    <button id="cf-export-sheet">Export for AI</button>
                    <button id="cf-clear-sheet">Clear Sheet</button>
                </div>
            </div>
            
            <div class="cf-section">
                <h4>Settings</h4>
                <label><input type="checkbox" id="cf-auto-track"> Auto-track CP from messages</label><br>
                <label><input type="checkbox" id="cf-auto-insert"> Auto-insert sheet in responses</label>
            </div>
        </div>
    `;
    
    return template;
}

// Initialize perk selection UI
function initializePerkSelection() {
    const startButton = document.getElementById('cf-start-selection');
    const domainSection = document.getElementById('cf-domain-selection');
    const perkSection = document.getElementById('cf-perk-selection');
    const rerollDomainsButton = document.getElementById('cf-reroll-domains');
    const rerollPerksButton = document.getElementById('cf-reroll-perks');
    const backToDomainsButton = document.getElementById('cf-back-to-domains');
    
    startButton.addEventListener('click', () => {
        if (currentCP <= 0) {
            alert('You need CP to select perks!');
            return;
        }
        showDomainSelection();
    });
    
    rerollDomainsButton.addEventListener('click', showDomainSelection);
    rerollPerksButton.addEventListener('click', () => {
        const selectedDomain = document.getElementById('cf-selected-domain').textContent;
        showPerkSelection(selectedDomain);
    });
    
    backToDomainsButton.addEventListener('click', showDomainSelection);
    
    function showDomainSelection() {
        const options = generatePerkOptions();
        const domainsContainer = document.getElementById('cf-domains');
        
        domainsContainer.innerHTML = '';
        options.domains.forEach(domain => {
            const button = document.createElement('button');
            button.className = 'cf-choice-button';
            button.textContent = domain;
            button.addEventListener('click', () => showPerkSelection(domain));
            domainsContainer.appendChild(button);
        });
        
        startButton.style.display = 'none';
        domainSection.style.display = 'block';
        perkSection.style.display = 'none';
    }
    
    function showPerkSelection(domain) {
        const perks = getPerksFromDomain(domain);
        const perksContainer = document.getElementById('cf-perks');
        const domainLabel = document.getElementById('cf-selected-domain');
        
        domainLabel.textContent = domain;
        perksContainer.innerHTML = '';
        
        if (perks.length === 0) {
            perksContainer.innerHTML = '<div class="cf-empty">No affordable perks in this domain</div>';
        } else {
            perks.forEach(perk => {
                const button = document.createElement('button');
                button.className = 'cf-choice-button cf-perk-choice';
                button.innerHTML = `
                    <div class="cf-perk-name"><strong>${perk.name}</strong></div>
                    <div class="cf-perk-origin">${perk.origin || 'Unknown'}</div>
                    <div class="cf-perk-cost">[${perk.cost || 0} CP]</div>
                    <div class="cf-perk-desc">${(perk.description || '').substring(0, 100)}...</div>
                `;
                button.addEventListener('click', () => {
                    if (addPerkToSheet(perk)) {
                        // Hide selection and show start button again
                        domainSection.style.display = 'none';
                        perkSection.style.display = 'none';
                        startButton.style.display = 'block';
                    }
                });
                perksContainer.appendChild(button);
            });
        }
        
        domainSection.style.display = 'none';
        perkSection.style.display = 'block';
    }
}

// Initialize other controls
function initializeControls() {
    // CP controls
    document.getElementById('cf-add-cp').addEventListener('click', () => {
        const amount = prompt('How much CP to add?', '100');
        const cp = parseInt(amount);
        if (cp && cp > 0) {
            updateCP(currentCP + cp);
        }
    });
    
    document.getElementById('cf-reset-cp').addEventListener('click', () => {
        if (confirm('Reset all CP data?')) {
            currentCP = 0;
            totalCP = 0;
            updateCPDisplay();
            saveData();
        }
    });
    
    document.getElementById('cf-manual-parse').addEventListener('click', () => {
        const context = getContext();
        const chat = context.chat;
        if (chat && chat.length > 0) {
            const lastMessage = chat[chat.length - 1];
            const foundCP = parseCP(lastMessage.mes);
            if (foundCP !== null) {
                updateCP(foundCP);
                alert(`Found CP: ${foundCP}`);
            } else {
                alert('No CP found in last message');
            }
        }
    });
    
    // Sheet controls
    document.getElementById('cf-export-sheet').addEventListener('click', () => {
        const exportText = generateSheetExport();
        navigator.clipboard.writeText(exportText).then(() => {
            alert('Sheet copied to clipboard!');
        }).catch(() => {
            // Fallback - show in a dialog
            const textarea = document.createElement('textarea');
            textarea.value = exportText;
            textarea.style.width = '100%';
            textarea.style.height = '200px';
            
            const dialog = document.createElement('div');
            dialog.style.position = 'fixed';
            dialog.style.top = '50%';
            dialog.style.left = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.style.background = 'white';
            dialog.style.padding = '20px';
            dialog.style.border = '1px solid #ccc';
            dialog.style.zIndex = '10000';
            dialog.style.maxWidth = '80vw';
            dialog.style.maxHeight = '80vh';
            dialog.style.overflow = 'auto';
            
            const title = document.createElement('h3');
            title.textContent = 'Sheet Export (Copy manually)';
            
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.addEventListener('click', () => document.body.removeChild(dialog));
            
            dialog.appendChild(title);
            dialog.appendChild(textarea);
            dialog.appendChild(closeButton);
            document.body.appendChild(dialog);
            
            textarea.select();
        });
    });
    
    document.getElementById('cf-clear-sheet').addEventListener('click', () => {
        if (confirm('Clear all selected perks?')) {
            // Refund CP
            const refund = currentSheet.reduce((sum, perk) => sum + (perk.cost || 0), 0);
            currentCP += refund;
            currentSheet = [];
            updateCPDisplay();
            updateSheetDisplay();
            saveData();
        }
    });
    
    // Settings
    const autoTrackCheckbox = document.getElementById('cf-auto-track');
    const autoInsertCheckbox = document.getElementById('cf-auto-insert');
    
    autoTrackCheckbox.checked = extension_settings[extensionName].autoTrackCP;
    autoInsertCheckbox.checked = extension_settings[extensionName].autoInsertSheet;
    
    autoTrackCheckbox.addEventListener('change', () => {
        extension_settings[extensionName].autoTrackCP = autoTrackCheckbox.checked;
        saveSettings();
    });
    
    autoInsertCheckbox.addEventListener('change', () => {
        extension_settings[extensionName].autoInsertSheet = autoInsertCheckbox.checked;
        saveSettings();
    });
}

// Handle message events
function handleMessage(data) {
    if (!extension_settings[extensionName].autoTrackCP) return;
    
    // Check both user and AI messages for CP
    if (data && data.message && data.message.mes) {
        const foundCP = parseCP(data.message.mes);
        if (foundCP !== null) {
            updateCP(foundCP);
        }
    }
}

// Handle AI response generation
function handleAIResponse(data) {
    if (!extension_settings[extensionName].autoInsertSheet) return;
    
    // If we have perks selected and the AI is generating a response,
    // we could potentially modify the response to include the sheet
    // This would require more complex integration with SillyTavern's message system
}

// Copy perks.json to extension folder
async function copyPerksData() {
    try {
        // First try to fetch from the main directory
        const response = await fetch('/perks.json');
        if (response.ok) {
            const perksText = await response.text();
            // Since we can't write files directly in browser, we'll store in localStorage as backup
            localStorage.setItem('celestial-forge-perks-backup', perksText);
            console.log('Celestial Forge: Perks data backed up to localStorage');
        }
    } catch (error) {
        console.warn('Celestial Forge: Could not backup perks data:', error);
    }
}

// Main initialization function
async function init() {
    loadSettings();
    await loadPerksData();
    await copyPerksData();
    loadData();
    
    // Create UI in the extensions panel
    const extensionContainer = document.createElement('div');
    extensionContainer.innerHTML = createExtensionUI();
    
    // Find the extensions container and add our UI
    const extensionsPanel = document.getElementById('extensions_settings2') || 
                          document.querySelector('.extensions_block') ||
                          document.body;
    
    extensionsPanel.appendChild(extensionContainer);
    
    // Initialize UI components
    initializePerkSelection();
    initializeControls();
    updateCPDisplay();
    updateSheetDisplay();
    
    // Set up event listeners
    eventSource.on(event_types.MESSAGE_RECEIVED, handleMessage);
    eventSource.on(event_types.MESSAGE_SENT, handleMessage);
    
    console.log('Celestial Forge extension initialized');
}

// Extension entry point
jQuery(async () => {
    if (window.location.href.includes('extensions')) {
        // Only initialize if we're in SillyTavern
        await init();
    }
});

// Export for potential manual initialization
window.celestialForgeExtension = {
    init,
    loadSettings,
    saveSettings,
    parseCP,
    updateCP,
    generateSheetExport
};