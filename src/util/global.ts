let config;
try {
  config = require("../../config.json");
} catch {
  config = process.env;
}

export default {
  TOKEN: config.TOKEN,
  CLIENT_ID: config.CLIENT_ID,
  PORT: config.PORT,
  LOG: config.LOG,
  DOMAIN: config.DOMAIN,
  TOP_GG_TOKEN: config.TOP_GG_TOKEN,
  INFINITY_BOTS_TOKEN: config.INFINITY_BOTS_TOKEN,
  DISCORD_EXTREME_LIST_TOKEN: config.DISCORD_EXTREME_LIST_TOKEN,
  DISCORD_BOTS_TOKEN: config.DISCORD_BOTS_TOKEN,
  DISCORD_BOT_LIST_TOKEN: config.DISCORD_BOT_LIST_TOKEN,
  DISCORDS_TOKEN: config.DISCORDS_TOKEN,
};
