import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { bot, config } from ".";
import { usersDB } from "./commands/set-timezone";
import { votes } from "./listing-manager";

votes.on("topgg", async (id, isWeekend) => {
  const duration = (isWeekend ? 6 : 12) * 60 * 60 * 1000;
  const now = Date.now();
  let userData = usersDB.get(id);
  if (userData?.premExpiry && userData.premExpiry > now)
    usersDB.setAttribute(
      id,
      "premExpiry",
      userData.premExpiry + 12 * 60 * 60 * 1000
    );
  else usersDB.setAttribute(id, "premExpiry", now + 12 * 60 * 60 * 1000);
  usersDB.setAttribute(id, "topggNextVote", now + duration);

  userData = usersDB.get(id);
  const discUser = await bot.users.fetch(id);
  if (!discUser) return;

  let description = `I have added 12 hours of premium to your account, which expires <t:${Math.round(
    userData.premExpiry / 1000
  )}:R>. `;

  await discUser.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Thank you for voting on top.gg!")
        .setDescription(description),
    ],
  });
  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [
      new MessageEmbed().setTitle("Voted on Top.gg!").setAuthor({
        name: discUser.tag,
        iconURL: discUser.avatarURL(),
      }),
    ],
  });
});

votes.on("ibl", async (id, isWeekend) => {
  const duration = (isWeekend ? 6 : 12) * 60 * 60 * 1000;
  const now = Date.now();
  let userData = usersDB.get(id);
  if (userData?.premExpiry && userData.premExpiry > now)
    usersDB.setAttribute(
      id,
      "premExpiry",
      userData.premExpiry + 12 * 60 * 60 * 1000
    );
  else usersDB.setAttribute(id, "premExpiry", now + 12 * 60 * 60 * 1000);
  usersDB.setAttribute(id, "iblNextVote", now + duration);

  userData = usersDB.get(id);
  const discUser = await bot.users.fetch(id).catch(() => {});
  if (!discUser) return;

  let description = `I have added 12 hours of premium to your account, which expires <t:${Math.round(
    userData.premExpiry / 1000
  )}:R>. `;

  await discUser.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Thank you for voting on infinity bot list!")
        .setDescription(description),
    ],
  });
  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [
      new MessageEmbed().setTitle("Voted on infinity bot list!").setAuthor({
        name: discUser.tag,
        iconURL: discUser.avatarURL(),
      }),
    ],
  });
});

export async function checkForVoteReminder() {
  for (const [id, userData] of usersDB.entries()) {
    if (!userData.topggNextVote) continue;

    const discUser = await bot.users.fetch(id).catch(() => {});
    if (!discUser) continue;
    if (
      userData.topggNextVote < Date.now() &&
      Date.now() - userData.topggNextVote < 60 * 1000
    ) {
      discUser.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Reminder: You can now vote!")
            .setDescription("You will be awarded premium after you vote!"),
        ],
        components: [
          new MessageActionRow().setComponents(
            new MessageButton()
              .setEmoji("953542648550023199")
              .setStyle("LINK")
              .setLabel("Top.gg")
              .setURL("https://top.gg/bot/950382032620503091/vote")
          ),
        ],
      });
    }
    if (
      userData.iblNextVote < Date.now() &&
      Date.now() - userData.iblNextVote < 60 * 1000
    ) {
      discUser.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Reminder: You can now vote!")
            .setDescription("You will be awarded premium after you vote!"),
        ],
        components: [
          new MessageActionRow().setComponents(
            new MessageButton()
              .setEmoji("953548945458626601")
              .setStyle("LINK")
              .setLabel("Infinity bot list")
              .setURL("https://infinitybots.gg/bots/950382032620503091/vote")
          ),
        ],
      });
    }
  }
}
