import { Api as TopggApi } from "@top-gg/sdk";
import { InfinityBots } from "infinity-bots";
import { bot, config } from ".";
import fetch from "node-fetch";
const topggApi = new TopggApi(config.TOP_GG_TOKEN);

const infinityBotsApi = new InfinityBots(config.INFINITY_BOTS_TOKEN);

export const hasUserVoted = {
  topgg: (userId: string) => topggApi.hasVoted(userId),
  ibl: (userId: string) => infinityBotsApi.checkUserVoted(userId, bot.user.id),
};

export async function postBotStats() {
  //top gg
  await topggApi.postStats({
    serverCount: bot.guilds.cache.size,
    shardCount: 1,
  });
  //infinity bots
  await infinityBotsApi.postBotStats({
    servers: bot.guilds.cache.size,
    shards: 1,
  });
  // discord bot list
  // await fetch(`https://discordbotlist.com/api/v1/bots/${bot.user.id}/stats`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: config.DISCORD_BOT_LIST_TOKEN,
  //   },
  //   body: JSON.stringify({
  //     users: bot.users.cache.size,
  //     guilds: bot.guilds.cache.size,
  //     voice_connections: 0,
  //   }),
  // });
  //discord extreme list
  // console.log(
  //   await fetch(
  //     `https://api.discordextremelist.xyz/v2/bot/${bot.user.id}/stats`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: config.DISCORD_EXTREME_LIST_TOKEN,
  //       },
  //       body: JSON.stringify({
  //         guildCount: bot.guilds.cache.size,
  //       }),
  //     }
  //   )
  // );
  //discord bots
  // console.log(
  //   await fetch(`https://discord.bots.gg/api/v1/bots/${bot.user.id}/stats`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: config.DISCORD_BOTS_TOKEN,
  //     },
  //     body: JSON.stringify({
  //       guildCount: bot.guilds.cache.size,
  //     }),
  //   })
  // );
}
