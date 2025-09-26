#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class CelestialForgeMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'celestial-forge-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.perksData = {};
    this.currentCP = 0;
    this.totalCP = 0;
    this.currentSheet = [];

    this.setupToolHandlers();
  }

  async loadPerksData() {
    try {
      const perksPath = path.join(__dirname, '..', 'perks.json');
      const data = await fs.readFile(perksPath, 'utf8');
      this.perksData = JSON.parse(data);
      console.error('Perks data loaded successfully');
    } catch (error) {
      console.error('Failed to load perks data:', error);
    }
  }

  parseCP(text) {
    const cpPatterns = [
      /(?:current\s+)?(?:choice\s+)?(?:points?|cp)(?:\s*:?\s*)(\d+)/gi,
      /(\d+)\s*(?:choice\s+)?(?:points?|cp)/gi,
      /cp\s*(?:total|current|available)?\s*:?\s*(\d+)/gi,
      /total\s*cp\s*:?\s*(\d+)/gi,
      /remaining\s*(?:cp|choice\s*points?)\s*:?\s*(\d+)/gi,
      /you\s+(?:now\s+)?have\s+(\d+)\s*(?:cp|choice\s*points?)/gi,
      /(\d+)\s*(?:cp|choice\s*points?)\s+(?:remaining|left|available)/gi
    ];

    for (const pattern of cpPatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > 0) {
        const cpValue = parseInt(matches[matches.length - 1][1]);
        if (!isNaN(cpValue) && cpValue >= 0) {
          return cpValue;
        }
      }
    }
    return null;
  }

  getRandomItems(arr, n) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  generatePerkOptions() {
    if (!this.perksData || Object.keys(this.perksData).length === 0) {
      return { domains: [], perks: [] };
    }
    
    const domains = Object.keys(this.perksData);
    const randomDomains = this.getRandomItems(domains, Math.min(4, domains.length));
    
    return {
      domains: randomDomains,
      perks: []
    };
  }

  getPerksFromDomain(domainName) {
    if (!this.perksData[domainName]) return [];
    
    const perks = this.perksData[domainName];
    const affordablePerks = perks.filter(perk => (perk.cost || 0) <= this.currentCP);
    
    return this.getRandomItems(affordablePerks, Math.min(4, affordablePerks.length));
  }

  generateSheetExport() {
    let text = '<div align="center"> <b>THE CELESTIAL FORGE</b> </div>\n<hr>\n';
    
    this.currentSheet.forEach(perk => {
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
    
    if (this.currentSheet.length > 0) {
      text += `Current CP: ${this.currentCP}\n`;
      text += `Total Perks: ${this.currentSheet.length}\n`;
      text += '<hr>\n';
    }
    
    return text;
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'parse_cp_from_text',
            description: 'Parse Choice Points (CP) from text, typically AI responses',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Text to parse for CP values'
                }
              },
              required: ['text']
            }
          },
          {
            name: 'get_current_cp',
            description: 'Get current CP status and statistics',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'set_cp',
            description: 'Manually set current CP value',
            inputSchema: {
              type: 'object',
              properties: {
                cp: {
                  type: 'number',
                  description: 'CP value to set'
                }
              },
              required: ['cp']
            }
          },
          {
            name: 'add_cp',
            description: 'Add CP to current total',
            inputSchema: {
              type: 'object',
              properties: {
                cp: {
                  type: 'number',
                  description: 'CP value to add'
                }
              },
              required: ['cp']
            }
          },
          {
            name: 'get_domain_options',
            description: 'Get random domain options for perk selection',
            inputSchema: {
              type: 'object',
              properties: {
                count: {
                  type: 'number',
                  description: 'Number of domains to return (default: 4)',
                  default: 4
                }
              }
            }
          },
          {
            name: 'get_perks_from_domain',
            description: 'Get available perks from a specific domain',
            inputSchema: {
              type: 'object',
              properties: {
                domain: {
                  type: 'string',
                  description: 'Domain name to get perks from'
                },
                count: {
                  type: 'number',
                  description: 'Number of perks to return (default: 4)',
                  default: 4
                }
              },
              required: ['domain']
            }
          },
          {
            name: 'select_perk',
            description: 'Select a perk and add it to the character sheet',
            inputSchema: {
              type: 'object',
              properties: {
                domain: {
                  type: 'string',
                  description: 'Domain the perk belongs to'
                },
                perk_name: {
                  type: 'string',
                  description: 'Name of the perk to select'
                }
              },
              required: ['domain', 'perk_name']
            }
          },
          {
            name: 'get_current_sheet',
            description: 'Get the current character sheet with all selected perks',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'generate_sheet_export',
            description: 'Generate formatted sheet export for AI responses',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'clear_sheet',
            description: 'Clear all selected perks and refund CP',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'remove_perk',
            description: 'Remove a specific perk from the sheet and refund its CP',
            inputSchema: {
              type: 'object',
              properties: {
                perk_name: {
                  type: 'string',
                  description: 'Name of the perk to remove'
                }
              },
              required: ['perk_name']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'parse_cp_from_text': {
            const foundCP = this.parseCP(args.text);
            if (foundCP !== null) {
              const oldCP = this.currentCP;
              this.currentCP = foundCP;
              if (foundCP > oldCP) {
                this.totalCP += (foundCP - oldCP);
              }
              return {
                content: [{
                  type: 'text',
                  text: `Found CP: ${foundCP}. Updated from ${oldCP} to ${foundCP}. Total CP earned: ${this.totalCP}`
                }]
              };
            } else {
              return {
                content: [{
                  type: 'text',
                  text: 'No CP values found in the provided text.'
                }]
              };
            }
          }

          case 'get_current_cp': {
            const spentCP = this.currentSheet.reduce((sum, perk) => sum + (perk.cost || 0), 0);
            return {
              content: [{
                type: 'text',
                text: `Current CP: ${this.currentCP}\nTotal CP Earned: ${this.totalCP}\nCP Spent: ${spentCP}\nPerks Selected: ${this.currentSheet.length}`
              }]
            };
          }

          case 'set_cp': {
            const oldCP = this.currentCP;
            this.currentCP = Math.max(0, args.cp);
            return {
              content: [{
                type: 'text',
                text: `CP manually set from ${oldCP} to ${this.currentCP}`
              }]
            };
          }

          case 'add_cp': {
            this.currentCP += args.cp;
            this.totalCP += args.cp;
            return {
              content: [{
                type: 'text',
                text: `Added ${args.cp} CP. Current CP: ${this.currentCP}, Total earned: ${this.totalCP}`
              }]
            };
          }

          case 'get_domain_options': {
            const options = this.generatePerkOptions();
            const domainInfo = options.domains.map(domain => {
              const domainPerks = this.perksData[domain] || [];
              const affordableCount = domainPerks.filter(perk => (perk.cost || 0) <= this.currentCP).length;
              return `${domain} (${domainPerks.length} total, ${affordableCount} affordable)`;
            });
            
            return {
              content: [{
                type: 'text',
                text: `Available domains:\n${domainInfo.join('\n')}`
              }]
            };
          }

          case 'get_perks_from_domain': {
            const perks = this.getPerksFromDomain(args.domain);
            if (perks.length === 0) {
              return {
                content: [{
                  type: 'text',
                  text: `No affordable perks available in domain: ${args.domain}`
                }]
              };
            }

            const perkInfo = perks.map(perk => {
              const name = perk.name || 'Unknown Perk';
              const origin = perk.origin || 'Unknown';
              const cost = perk.cost || 0;
              const description = (perk.description || 'No description').substring(0, 100) + '...';
              return `**${name}** (${origin}) [${cost} CP]\n${description}`;
            });

            return {
              content: [{
                type: 'text',
                text: `Available perks from ${args.domain}:\n\n${perkInfo.join('\n\n')}`
              }]
            };
          }

          case 'select_perk': {
            const domainPerks = this.perksData[args.domain];
            if (!domainPerks) {
              return {
                content: [{
                  type: 'text',
                  text: `Domain not found: ${args.domain}`
                }]
              };
            }

            const perk = domainPerks.find(p => p.name === args.perk_name);
            if (!perk) {
              return {
                content: [{
                  type: 'text',
                  text: `Perk not found: ${args.perk_name}`
                }]
              };
            }

            const cost = perk.cost || 0;
            if (cost > this.currentCP) {
              return {
                content: [{
                  type: 'text',
                  text: `Insufficient CP! Need ${cost} CP but only have ${this.currentCP} CP.`
                }]
              };
            }

            this.currentSheet.push(perk);
            this.currentCP -= cost;

            return {
              content: [{
                type: 'text',
                text: `Successfully selected "${perk.name}" for ${cost} CP. Remaining CP: ${this.currentCP}`
              }]
            };
          }

          case 'get_current_sheet': {
            if (this.currentSheet.length === 0) {
              return {
                content: [{
                  type: 'text',
                  text: 'No perks selected yet.'
                }]
              };
            }

            const sheetInfo = this.currentSheet.map((perk, index) => {
              const name = perk.name || 'Unknown Perk';
              const origin = perk.origin || 'Unknown';
              const cost = perk.cost || 0;
              return `${index + 1}. **${name}** (${origin}) [${cost} CP]`;
            });

            const totalCost = this.currentSheet.reduce((sum, perk) => sum + (perk.cost || 0), 0);

            return {
              content: [{
                type: 'text',
                text: `Current Character Sheet:\n${sheetInfo.join('\n')}\n\nTotal CP Spent: ${totalCost}\nRemaining CP: ${this.currentCP}`
              }]
            };
          }

          case 'generate_sheet_export': {
            const exportText = this.generateSheetExport();
            return {
              content: [{
                type: 'text',
                text: exportText
              }]
            };
          }

          case 'clear_sheet': {
            const refundCP = this.currentSheet.reduce((sum, perk) => sum + (perk.cost || 0), 0);
            this.currentCP += refundCP;
            this.currentSheet = [];
            return {
              content: [{
                type: 'text',
                text: `Sheet cleared. Refunded ${refundCP} CP. Current CP: ${this.currentCP}`
              }]
            };
          }

          case 'remove_perk': {
            const perkIndex = this.currentSheet.findIndex(p => p.name === args.perk_name);
            if (perkIndex === -1) {
              return {
                content: [{
                  type: 'text',
                  text: `Perk not found in sheet: ${args.perk_name}`
                }]
              };
            }

            const removedPerk = this.currentSheet.splice(perkIndex, 1)[0];
            const refundCP = removedPerk.cost || 0;
            this.currentCP += refundCP;

            return {
              content: [{
                type: 'text',
                text: `Removed "${removedPerk.name}" and refunded ${refundCP} CP. Current CP: ${this.currentCP}`
              }]
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.message}`
          }],
          isError: true
        };
      }
    });
  }

  async run() {
    await this.loadPerksData();
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Celestial Forge MCP Server started');
  }
}

const server = new CelestialForgeMCPServer();
server.run().catch(console.error);