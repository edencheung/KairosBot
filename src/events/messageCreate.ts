import { Client, Message, MessageEmbed } from "discord.js";
import { usersDB } from "../commands/set-timezone";

export default async (bot: Client, msg: Message) => {
  const content = msg.content;

  //If there is no time detected
  if (!/([0-1][0-9]|2[0-3]|([^0-9]|^)[0-9]):[0-5][0-9]/g.test(content)) return;

  //If the timezone is not set for the user
  if (usersDB.get(msg.author.id) == undefined) return;
  if (!usersDB.get(msg.author.id).enabled) return;

  let timestamps: {
    input: string;
    timestamp: string;
  }[] = [];
  const inputTimes = content.matchAll(
    /([0-1][0-9]|2[0-3]|([^0-9]|^)[0-9]):[0-5][0-9]/g
  );
  for (const inputTime of inputTimes) {
    const [time] = inputTime;
    let hour = parseInt(time.split(":")[0]);
    let min = parseInt(time.split(":")[1]);
    const { index } = inputTime;
    let tempStr = content.substring(index + 5).trim();
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
    const userHour = userTzOffset + date.getUTCHours();
    const hourDiff = hour - userHour;
    date.setUTCDate(date.getUTCDate() + dayDiff);
    date.setUTCHours(date.getUTCHours() + hourDiff);
    date.setUTCMinutes(min);
    date.setUTCSeconds(0);

    timestamps.push({
      input: inputDateStr,
      timestamp: `<t:${Math.round(date.getTime() / 1000)}:f>`,
    });
  }
  msg.reply({
    embeds: [
      new MessageEmbed()
        .setColor(`#384c5c`)
        .setDescription(
          timestamps.map((t) => `**${t.input}:** ${t.timestamp}`).join("\n")
        )
        .setFooter({
          iconURL: bot.user.avatarURL(),
          text: "If you like the bot, consider upvoting it https://top.gg/bot/950382032620503091",
        }),
    ],
    allowedMentions: { repliedUser: false },
  });
};

function removeIfStarting(keywords: string[], string: string): string {
  string = string.trim();
  for (const keyword of keywords)
    if (string.startsWith(keyword)) return string.substring(keyword.length);
  return string;
}
