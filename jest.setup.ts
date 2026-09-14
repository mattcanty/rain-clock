import '@testing-library/jest-dom';

/* .env isn't committed, and CI never has it — give every test deterministic values
   for the environment variables the app reads, instead of depending on whatever
   (if anything) happens to be on the developer's machine */
process.env.WEATHER_API_URL = 'https://example.test/forecast';
process.env.WEATHER_API_KEY = 'test-api-key';
process.env.GITHUB_REPO_URL = 'https://github.com/mattcanty/rain-clock';
process.env.BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/mattcanty';
process.env.PIRATE_WEATHER_URL = 'https://pirateweather.net/';
