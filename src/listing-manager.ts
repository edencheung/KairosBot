import { Api as TopggApi } from "@top-gg/sdk";
import { bot, config } from ".";
import axios from "axios";

const { InfinityFetcher, InfinityPoster } = require("@infinitybots/node-sdk")

const topggApi = new TopggApi(config.TOP_GG_TOKEN);

const infinityF = new InfinityFetcher({
  auth: config.INFINITY_BOTS_TOKEN,
  botID: bot.user.id,
});

const infinityP = new InfinityPoster({
  auth: config.INFINITY_BOTS_TOKEN,
  botID: bot.user.id,
});

export const hasUserVoted = {
  topgg: (userId: string) => topggApi.hasVoted(userId),
  ibl: (userId: string) => infinityF.getUserVotes(userId).has_voted,
};

export async function postBotStats() {
  await postTopggStats().catch((e) =>
    console.log("Error posting to Top.gg | " + e)
  );
  await postIblStats().catch((e) => console.log("Error posting to Ibl | " + e));
  await postDblStats().catch((e) => console.log("Error posting to Dpl | " + e));
  await postDelStats().catch((e) => console.log("Error posting to Del | " + e));
  await postDbotsggStats().catch((e) =>
    console.log("Error posting to Dbotsgg | " + e)
  );
  await postDiscordsStats().catch((e) =>
    console.log("Error posting to Discords | " + e)
  );
}

async function postTopggStats() {
  return await topggApi.postStats({
    serverCount: bot.guilds.cache.size,
    shardCount: 1,
  });
}

async function postIblStats() {
  return await infinityP.postBotStats({
    servers: bot.guilds.cache.size,
    shards: 1,
    users: bot.users.cache.size
  });
}

async function postDblStats() {
  return await axios.post(
    `https://discordbotlist.com/api/v1/bots/950382032620503091/stats`,
    {
      users: bot.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      ),
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
