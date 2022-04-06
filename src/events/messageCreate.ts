import {
  Client,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { config } from "..";
import { usersDB } from "../commands/set-timezone";
import { attachCallbackButtons } from "../util/interactions";

export default async (bot: Client, msg: Message) => {
  const content = msg.content;

  // Very temp eval util code

  function guilds() {
    return bot.guilds.cache.size;
  }

  function users() {
    return bot.users.cache.size;
  }

  async function ownerGuilds() {
    let owners = bot.guilds.cache.map((g) => g.ownerId);
    let obj: {
      [key: string]: number;
    } = {};
    for (let ownerId of owners) {
      let owner = (await bot.users.fetch(ownerId))?.tag ?? ownerId;
      if (!obj[owner]) obj[owner] = 1;
      else obj[owner] = obj[owner] + 1;
    }
    return obj;
  }

  // Very temp eval code
  if (msg.content.startsWith("eval")) {
    if (msg.author.id !== "686060470376857631") return;
    try {
      const code = content.split(" ").splice(1).join(" ");
      let evaled: any;

      if (code === "ownerGuilds()") evaled = await ownerGuilds();
      else evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      msg.channel.send({ content: `\`\`\`${evaled.substring(0, 1994)}\`\`\`` });
    } catch (err) {
      msg.channel.send({
        content: `\`\`\`${err.toString().substring(0, 1994)}\`\`\``,
      });
    }
  }
  //If there is no time detected
  if (!/([0-1][0-9]|2[0-3]|([^0-9]|^)[0-9]):[0-5][0-9]/g.test(content)) return;

  //If the timezone is not set for the user
  if (usersDB.get(msg.author.id)?.timezone == undefined) {
    attachCallbackButtons(
      null,
      await msg.author.send({
        content:
          "Hey there, I have detected a timestring but you have not configured your timezone. " +
          "Please use the `/settimezone` command to set your timezone and `/help` for more information!\n" +
          "If you do not want to see this message again, simply press the button below.",
      }),
      [
        {
          emoji: "❌",
          callback: async (_, botMsg) => {
            await botMsg.reply(
              "Thanks for confirming. You will not see this message again."
            );
            usersDB.setAttribute(msg.author.id, "timezone", null);
          },
        },
      ]
    );
    return;
  }
  // This means that the user has intentionally disabled timestring detection
  console.log(usersDB.get(msg.author.id));
  if (usersDB.get(msg.author.id).timezone == null) return;
  if (!usersDB.get(msg.author.id).enabled) return;

  let timestamps: {
    input: string;
    epoch: number;
  }[] = [];
  const inputTimes = content.matchAll(
    /([0-1][0-9]|2[0-3]|([^0-9]|^)[0-9]):[0-5][0-9]/g
  );
  for (const inputTime of inputTimes) {
    const [time] = inputTime;
    let hour = parseInt(time.split(":")[0]);
    let min = parseInt(time.split(":")[1]);
    const { index } = inputTime;
    let tempStr = content.substring(index + time.length).trim();
    //check if there is "PM" trailing it
    if (hour < 12 && /^(pm|PM)(?![a-zA-Z])/g.test(tempStr)) hour += 12;

    //check if there is "AM" trailing it
    if (hour == 12 && /^(am|AM)(?![a-zA-Z])/g.test(tempStr)) hour -= 12;

    //remove am/pm if present
    if (/^(am|AM|pm|PM)(?![a-zA-Z])/g.test(tempStr))
      tempStr = tempStr.trim().substring(2).trim();

    let dayDiff: number = 0;
    //check if there are words trailing it

    //today
    if (/^(today|tdy)(?![a-zA-Z])/g.test(tempStr)) {
      tempStr = removeIfStarting(["today", "tdy"], tempStr);
    }
    //tmr
    else if (/^(tomorrow|tmr)(?![a-zA-Z])/g.test(tempStr)) {
      dayDiff++;
      tempStr = removeIfStarting(["tmr", "tomorrow"], tempStr);
    }
    //ytd
    else if (/^(yesterday|ytd)(?![a-zA-Z])/g.test(tempStr)) {
      dayDiff--;
      tempStr = removeIfStarting(["yesterday", "ytd"], tempStr);
    }
    // n days later
    else if (/^[0-9]+(| )(day|days|d) +(later)(?![a-zA-Z])/g.test(tempStr)) {
      const lengthOfDigits = tempStr
        .match(/^[0-9]+(| )(day|days|d) +later(?![a-zA-Z])/g)[0]
        .replace(/[^0-9]/g, "").length;
      dayDiff += parseInt(tempStr.trim().substring(0, lengthOfDigits));
      tempStr = tempStr.trim().substring(lengthOfDigits);
      tempStr = removeIfStarting(["days", "day", "d"], tempStr);
      tempStr = removeIfStarting(["later"], tempStr);
    }
    // n days before
    else if (
      /^[0-9]+(| )(day|days|d) +(before|b4|ago)(?![a-zA-Z])/g.test(tempStr)
    ) {
      const lengthOfDigits = tempStr
        .match(/^[0-9]+(| )(day|days|d) +(before|b4|ago)(?![a-zA-Z])/g)[0]
        .replace(/[^0-9]/g, "").length;
      dayDiff -= parseInt(tempStr.trim().substring(0, lengthOfDigits));
      tempStr = tempStr.trim().substring(lengthOfDigits);
      tempStr = removeIfStarting(["days", "day", "d"], tempStr);
      tempStr = removeIfStarting(["before", "b4", "ago"], tempStr);
    }

    //get full date string
    const inputDateStrLength = content.length - index - tempStr.length;
    const inputDateStr = content.substring(index, index + inputDateStrLength);

    //make time
    const userTzOffset = usersDB.get(msg.author.id).timezone;
    const date = new Date();
    const UCTHour = date.getUTCHours();
    const userHour = (userTzOffset + UCTHour + 24) % 24;
    const hourDiff = hour - userHour;
    date.setUTCDate(date.getUTCDate() + dayDiff);
    date.setUTCHours(UCTHour + hourDiff);
    date.setUTCMinutes(min);
    date.setUTCSeconds(0);

    timestamps.push({
      input: inputDateStr,
      epoch: Math.round(date.getTime() / 1000),
    });
  }
  let description = timestamps
    .map((t) => `**${t.input.trim()}:** <t:${t.epoch}:f> (<t:${t.epoch}:R>)`)
    .join("\n");
  const embeds = [
    new MessageEmbed().setColor(`#384c5c`).setDescription(description),
  ];

  if (
    !usersDB.get(msg.author.id).premExpiry ||
    usersDB.get(msg.author.id).premExpiry < Date.now()
  )
    embeds.push(
      new MessageEmbed()
        .setDescription(
          "If you liked using this bot, please consider supporting Kairos Bot by voting on " +
            "__**[Top.gg](https://top.gg/bot/950382032620503091/vote)**__! It is free and would help a lot!\n\n" +
            "Got any questions/suggestions/issues? Join the [support server](https://kairosbot.live/support)!"
        )
        .setFooter({
          text: "This attached message can be removed by voting.",
        })
    );
  try {
    await msg.reply({
      embeds,
      allowedMentions: { repliedUser: false },
    });
  } catch (_) {
    msg.author
      .send({
        content:
          "Hi there, I have detected a timestring send by you and have attempted to translate it. However, I do not have the permissions to send messages in the channel. If you are the owner of the server or an admin, please give me the permissions to send messages in the channel. If not, contact an admin to allow me to send messages. If this is intended, just use the `/disable` command to disable me.",
      })
      .catch(() => {});
  }

  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Timestring detected!")
        .setDescription(
          `> ${msg.content.substring(0, 900).replace("\n", "\n> ")}\nServer: ${
            msg.guild?.name ?? "DMs"
          } (${msg.guild?.id ?? "DMs"})`
        )
        .setAuthor({
          name: msg.author.tag,
          iconURL: msg.author.avatarURL(),
        }),
    ],
  });
};

function removeIfStarting(keywords: string[], string: string): string {
  string = string.trim();
  for (const keyword of keywords)
    if (string.startsWith(keyword)) return string.substring(keyword.length);
  return string;
}
