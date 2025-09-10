# Weather MCP Server

A Model Context Protocol (MCP) server that provides weather data using the Open-Meteo API. This server allows AI assistants to retrieve current weather conditions and forecasts for any location on Earth.

## Features

- **Current Weather**: Get real-time temperature, wind speed, humidity, and weather conditions
- **Weather Forecast**: Retrieve hourly forecasts for up to 7 days
- **Weather Summary**: Get a comprehensive summary including current conditions and daily min/max temperatures
- **Global Coverage**: Works with any latitude/longitude coordinates worldwide
- **No API Key Required**: Uses the free Open-Meteo API

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Running the Server

Start the MCP server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### Available Tools

The server provides three main tools:

#### 1. `get_current_weather`
Get current weather data for a specific location.

**Parameters:**
- `latitude` (number): Latitude of the location
- `longitude` (number): Longitude of the location

**Example:**
```json
{
  "name": "get_current_weather",
  "arguments": {
    "latitude": 52.52,
    "longitude": 13.41
  }
}
```

#### 2. `get_weather_forecast`
Get hourly weather forecast for a specific location.

**Parameters:**
- `latitude` (number): Latitude of the location
- `longitude` (number): Longitude of the location
- `days` (number, optional): Number of days to forecast (default: 7)

**Example:**
```json
{
  "name": "get_weather_forecast",
  "arguments": {
    "latitude": 52.52,
    "longitude": 13.41,
    "days": 3
  }
}
```

#### 3. `get_weather_summary`
Get a summary of current weather and today's forecast for a location.

**Parameters:**
- `latitude` (number): Latitude of the location
- `longitude` (number): Longitude of the location

**Example:**
```json
{
  "name": "get_weather_summary",
  "arguments": {
    "latitude": 52.52,
    "longitude": 13.41
  }
}
```

## API Reference

This server uses the [Open-Meteo API](https://open-meteo.com/), which provides:

- **Temperature**: 2-meter temperature in Celsius
- **Wind Speed**: 10-meter wind speed in km/h
- **Humidity**: Relative humidity percentage
- **Weather Codes**: WMO weather codes for conditions

### Weather Codes
- 0: Clear sky
- 1-3: Partly cloudy
- 45, 48: Foggy
- 51-55: Drizzle
- 61-65: Rain
- 71-75: Snow
- 95: Thunderstorm

## Configuration

The server is configured to use the Open-Meteo API base URL: `https://api.open-meteo.com/v1/forecast`

No API key is required as Open-Meteo is a free service.

## Error Handling

The server includes comprehensive error handling for:
- Missing required parameters
- Invalid API responses
- Network connectivity issues
- API rate limiting

## Development

To modify the server:

1. Edit `server.js` to add new tools or modify existing ones
2. Update the tool schemas in the `tools/list` handler
3. Test your changes with `npm run dev`

## License

MIT License - feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests. 