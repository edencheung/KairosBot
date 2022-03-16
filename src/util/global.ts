let config;
try {
  config = require("../config.json");
} catch {
  config = process.env;
}

export default {
  PREFIX: config.PREFIX,
  TOKEN: config.TOKEN,
  LOG: config.LOG,
  TOP_GG_TOKEN: config.TOP_GG_TOKEN,
  INFINITY_BOTS_TOKEN: config.INFINITY_BOTS_TOKEN,
  DISCORD_EXTREME_LIST_TOKEN: config.DISCORD_EXTREME_LIST_TOKEN,
  DISCORD_BOTS_TOKEN: config.DISCORD_BOTS_TOKEN,
};
