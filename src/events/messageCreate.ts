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

  const componentRows: MessageActionRow[] = [];

  if (
    !usersDB.get(msg.author.id).premExpiry ||
    usersDB.get(msg.author.id).premExpiry < Date.now()
  )
    componentRows.push(
      new MessageActionRow().addComponents(
        new MessageButton()
          .setEmoji("🔼")
          .setLabel("If you like me, consider upvoting!")
          .setStyle("LINK")
          .setURL("https://top.gg/bot/950382032620503091/vote")
      )
    );

  msg.reply({
    embeds: [
      new MessageEmbed().setColor(`#384c5c`).setDescription(description),
    ],
    allowedMentions: { repliedUser: false },
    components: componentRows,
  });

  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Timestring detected!")
        .setDescription(
          `> ${msg.content.substring(0, 900)}\nServer: ${
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
