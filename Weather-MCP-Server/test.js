#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function testWeatherMCP() {
  // Spawn the MCP server process
  const serverProcess = spawn('node', ['server.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Create client transport
  const transport = new StdioClientTransport(serverProcess.stdin, serverProcess.stdout);
  
  // Create MCP client
  const client = new Client({
    name: 'weather-test-client',
    version: '1.0.0',
  });

  try {
    // Connect to the server
    await client.connect(transport);

    console.log('Connected to Weather MCP Server\n');

    // Test 1: Get current weather for Berlin (using your example coordinates)
    console.log('=== Test 1: Current Weather for Berlin ===');
    try {
      const currentWeather = await client.callTool({
        name: 'get_current_weather',
        arguments: {
          latitude: 52.52,
          longitude: 13.41
        }
      });
      console.log('Current Weather:', currentWeather.content[0].text);
    } catch (error) {
      console.error('Error getting current weather:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Get weather summary
    console.log('=== Test 2: Weather Summary for Berlin ===');
    try {
      const weatherSummary = await client.callTool({
        name: 'get_weather_summary',
        arguments: {
          latitude: 52.52,
          longitude: 13.41
        }
      });
      console.log('Weather Summary:', weatherSummary.content[0].text);
    } catch (error) {
      console.error('Error getting weather summary:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Get 3-day forecast
    console.log('=== Test 3: 3-Day Forecast for Berlin ===');
    try {
      const forecast = await client.callTool({
        name: 'get_weather_forecast',
        arguments: {
          latitude: 52.52,
          longitude: 13.41,
          days: 3
        }
      });
      
      // Parse and display first few hours of forecast
      const forecastData = JSON.parse(forecast.content[0].text);
      console.log('First 6 hours of forecast:');
      for (let i = 0; i < 6; i++) {
        const time = forecastData.time[i];
        const temp = forecastData.temperature_2m[i];
        const humidity = forecastData.relative_humidity_2m[i];
        const wind = forecastData.wind_speed_10m[i];
        console.log(`${time}: ${temp}°C, ${humidity}% humidity, ${wind} km/h wind`);
      }
    } catch (error) {
      console.error('Error getting forecast:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: List available tools
    console.log('=== Test 4: Available Tools ===');
    try {
      const tools = await client.listTools();
      console.log('Available tools:');
      tools.tools.forEach(tool => {
        console.log(`- ${tool.name}: ${tool.description}`);
      });
    } catch (error) {
      console.error('Error listing tools:', error.message);
    }

  } catch (error) {
    console.error('Error connecting to server:', error.message);
  } finally {
    // Clean up
    serverProcess.kill();
    console.log('\nTest completed. Server process terminated.');
  }
}

// Run the test
testWeatherMCP().catch(console.error); 