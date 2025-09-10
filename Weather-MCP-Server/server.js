#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { RequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import fetch from 'node-fetch';

// Weather API base URL
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';

// Define the tools
const tools = [
  {
    name: 'get_current_weather',
    description: 'Get current weather data for a specific location',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude of the location'
        },
        longitude: {
          type: 'number',
          description: 'Longitude of the location'
        }
      },
      required: ['latitude', 'longitude']
    }
  },
  {
    name: 'get_weather_forecast',
    description: 'Get hourly weather forecast for a specific location',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude of the location'
        },
        longitude: {
          type: 'number',
          description: 'Longitude of the location'
        },
        days: {
          type: 'number',
          description: 'Number of days to forecast (default: 7)',
          default: 7
        }
      },
      required: ['latitude', 'longitude']
    }
  },
  {
    name: 'get_weather_summary',
    description: 'Get a summary of current weather and today\'s forecast for a location',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude of the location'
        },
        longitude: {
          type: 'number',
          description: 'Longitude of the location'
        }
      },
      required: ['latitude', 'longitude']
    }
  }
];

// Create the server
const server = new Server({
  name: 'weather-mcp-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {}
  }
});

// Define request schemas
const ToolsCallRequestSchema = RequestSchema.extend({
  method: z.literal('tools/call'),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.any())
  })
});

const ToolsListRequestSchema = RequestSchema.extend({
  method: z.literal('tools/list'),
  params: z.object({}).optional()
});

// Handle tool calls
server.setRequestHandler(ToolsCallRequestSchema, async (request, extra) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_current_weather': {
      const { latitude, longitude } = args;
      
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
      }

      const url = `${WEATHER_API_BASE}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`Weather API error: ${data.error || response.statusText}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data.current, null, 2)
            }
          ]
        };
      } catch (error) {
        throw new Error(`Failed to fetch weather data: ${error.message}`);
      }
    }

    case 'get_weather_forecast': {
      const { latitude, longitude, days = 7 } = args;
      
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
      }

      const url = `${WEATHER_API_BASE}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&forecast_days=${days}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`Weather API error: ${data.error || response.statusText}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data.hourly, null, 2)
            }
          ]
        };
      } catch (error) {
        throw new Error(`Failed to fetch weather forecast: ${error.message}`);
      }
    }

    case 'get_weather_summary': {
      const { latitude, longitude } = args;
      
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
      }

      const url = `${WEATHER_API_BASE}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&hourly=temperature_2m&forecast_days=1`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`Weather API error: ${data.error || response.statusText}`);
        }

        const current = data.current;
        const hourly = data.hourly;
        
        // Calculate min/max temperatures for today
        const todayTemps = hourly.temperature_2m.slice(0, 24);
        const minTemp = Math.min(...todayTemps);
        const maxTemp = Math.max(...todayTemps);

        const summary = {
          current: {
            temperature: `${current.temperature_2m}°C`,
            wind_speed: `${current.wind_speed_10m} km/h`,
            humidity: `${current.relative_humidity_2m}%`,
            weather_code: current.weather_code
          },
          today: {
            min_temperature: `${minTemp}°C`,
            max_temperature: `${maxTemp}°C`
          },
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone
          }
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(summary, null, 2)
            }
          ]
        };
      } catch (error) {
        throw new Error(`Failed to fetch weather summary: ${error.message}`);
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Handle tool listing
server.setRequestHandler(ToolsListRequestSchema, async (request, extra) => {
  return {
    tools
  };
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Weather MCP server started'); 