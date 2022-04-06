import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { bot, config } from ".";
import { usersDB } from "./commands/set-timezone";
import { votes } from "./server/server";

function buttonRowGen(id: string) {
  let buttonRow = new MessageActionRow();
  const topggVoted =
    usersDB.get(id).topggNextVote &&
    usersDB.get(id).topggNextVote >= Date.now();
  const iblVoted =
    usersDB.get(id).iblNextVote && usersDB.get(id).iblNextVote >= Date.now();
  const discordsVoted =
    usersDB.get(id).discordsNextVote &&
    usersDB.get(id).discordsNextVote >= Date.now();
  const dblVoted =
    usersDB.get(id).dblNextVote && usersDB.get(id).dblNextVote >= Date.now();
  buttonRow.addComponents(
    new MessageButton()
      .setEmoji(topggVoted ? "953542648550023199" : "✅")
      .setStyle("LINK")
      .setLabel("Top.gg")
      .setURL("https://top.gg/bot/950382032620503091/vote")
      .setDisabled(topggVoted)
  );
  buttonRow.addComponents(
    new MessageButton()
      .setEmoji(iblVoted ? "953548945458626601" : "✅")
      .setStyle("LINK")
      .setLabel("Infinity Bots")
      .setURL("https://infinitybots.gg/bots/950382032620503091/vote")
      .setDisabled(iblVoted)
  );
  buttonRow.addComponents(
    new MessageButton()
      .setEmoji(discordsVoted ? "960865615457968178" : "✅")
      .setStyle("LINK")
      .setLabel("Discords")
      .setURL("https://discords.com/bots/bot/950382032620503091/vote")
      .setDisabled(discordsVoted)
  );
  buttonRow.addComponents(
    new MessageButton()
      .setEmoji(dblVoted ? "953579545213161502" : "✅")
      .setStyle("LINK")
      .setLabel("Discord Bot List")
      .setURL("https://discordbotlist.com/bots/kairosbot/upvote")
      .setDisabled(dblVoted)
  );
  buttonRow.addComponents(
    new MessageButton()
      .setEmoji("953561327341817856")
      .setStyle("LINK")
      .setLabel("Discord Extreme List (Can only be voted once)")
      .setURL("https://discordextremelist.xyz/en-US/bots/950382032620503091")
  );
  return buttonRow;
}

votes.on("topgg", async (id) => {
  const duration = 12 * 60 * 60 * 1000;
  const now = Date.now();
  let userData = usersDB.get(id);
  if (userData?.premExpiry && userData.premExpiry > now)
    usersDB.setAttribute(id, "premExpiry", userData.premExpiry + duration);
  else usersDB.setAttribute(id, "premExpiry", now + duration);
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
      new MessageEmbed().setTitle(
        "It would also really help if you leave a review, or vote on these other sites!"
      ),
    ],
    components: [buttonRowGen(id)],
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
      new MessageEmbed().setTitle(
        "It would also really help if you can vote on these other sites!"
      ),
    ],
    components: [buttonRowGen(id)],
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

votes.on("dbl", async (id) => {
  const duration = 12 * 60 * 60 * 1000;
  const now = Date.now();
  let userData = usersDB.get(id);
  if (userData?.premExpiry && userData.premExpiry > now)
    usersDB.setAttribute(id, "premExpiry", userData.premExpiry + duration);
  else usersDB.setAttribute(id, "premExpiry", now + duration);
  usersDB.setAttribute(id, "dblNextVote", now + duration);

  userData = usersDB.get(id);
  const discUser = await bot.users.fetch(id);
  if (!discUser) return;

  let description = `I have added 12 hours of premium to your account, which expires <t:${Math.round(
    userData.premExpiry / 1000
  )}:R>. `;

  await discUser.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Thank you for voting on Discord Bot List!")
        .setDescription(description),
      new MessageEmbed().setTitle(
        "It would also really help if you can vote on these other sites!"
      ),
    ],
    components: [buttonRowGen(id)],
  });
  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [
      new MessageEmbed().setTitle("Voted on Discord Bot List!").setAuthor({
        name: discUser.tag,
        iconURL: discUser.avatarURL(),
      }),
    ],
  });
});

votes.on("discords", async (id) => {
  const duration = 12 * 60 * 60 * 1000;
  const now = Date.now();
  let userData = usersDB.get(id);
  if (userData?.premExpiry && userData.premExpiry > now)
    usersDB.setAttribute(id, "premExpiry", userData.premExpiry + duration);
  else usersDB.setAttribute(id, "premExpiry", now + duration);
  usersDB.setAttribute(id, "discordsNextVote", now + duration);

  userData = usersDB.get(id);
  const discUser = await bot.users.fetch(id);
  if (!discUser) return;

  let description = `I have added 12 hours of premium to your account, which expires <t:${Math.round(
    userData.premExpiry / 1000
  )}:R>. `;

  await discUser.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Thank you for voting on discords.com!")
        .setDescription(description),
      new MessageEmbed().setTitle(
        "It would also really help if you can vote on these other sites!"
      ),
    ],
    components: [buttonRowGen(id)],
  });
  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [
      new MessageEmbed().setTitle("Voted on Discords.com!").setAuthor({
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
