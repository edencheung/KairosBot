import { Api as TopggApi } from "@top-gg/sdk";
import { InfinityBots } from "infinity-bots";
import { bot, config } from ".";
import axios from "axios";

const topggApi = new TopggApi(config.TOP_GG_TOKEN);

const infinityBotsApi = new InfinityBots(config.INFINITY_BOTS_TOKEN);

export const hasUserVoted = {
  topgg: (userId: string) => topggApi.hasVoted(userId),
  ibl: (userId: string) => infinityBotsApi.checkUserVoted(userId, bot.user.id),
};

export async function postBotStats() {
  // await postTopggStats();
  // await postIblStats();
  // await postDblStats();
  // await postDelStats();
  // await postDbotsggStats();
  // await postDiscordsStats();
}

async function postTopggStats() {
  return await topggApi.postStats({
    serverCount: bot.guilds.cache.size,
    shardCount: 1,
  });
}

async function postIblStats() {
  return await infinityBotsApi.postBotStats({
    servers: bot.guilds.cache.size,
    shards: 1,
  });
}

async function postDblStats() {
  return await axios.post(
    `https://discordbotlist.com/api/v1/bots/950382032620503091/stats`,
    {
      users: bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      guilds: bot.guilds.cache.size,
      voice_connections: 0,
    },
    {
      headers: {
        Authorization: config.DISCORD_BOT_LIST_TOKEN,
      },
    }
  );
}

async function postDelStats() {
  return await axios.post(
    `https://api.discordextremelist.xyz/v2/bot/950382032620503091/stats`,
    {
      guildCount: bot.guilds.cache.size,
    },
    {
      headers: {
        Authorization: config.DISCORD_EXTREME_LIST_TOKEN,
      },
    }
  );
}

async function postDbotsggStats() {
  return await axios.post(
    `https://discord.bots.gg/api/v1/bots/950382032620503091/stats`,
    {
      guildCount: bot.guilds.cache.size,
    },
    {
      headers: {
        Authorization: config.DISCORD_BOTS_TOKEN,
      },
    }
  );
}

async function postDiscordsStats() {
  return await axios.post(
    `https://discords.com/bots/api/bot/950382032620503091`,
    {
      server_count: bot.guilds.cache.size,
    },
    {
      headers: {
        Authorization: config.DISCORDS_TOKEN,
      },
    }
  );
}
