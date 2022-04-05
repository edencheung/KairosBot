import axios from "axios";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { config } from "..";
import { postBotStats } from "../listing-manager";
import { checkForVoteReminder } from "../votes";

export default async (bot: Client) => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("/help", { type: "LISTENING" });

  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [
      new MessageEmbed()
        .setTitle("I am now online!")
        .setDescription(
          `\`\`\`${(await axios.get("https://api.ipify.org")).data}\`\`\``
        ),
    ],
  });

  setInterval(
    () =>
      postBotStats().catch((e) =>
        console.error(
          `There was an error posting stats to listing sites | ${e}`
        )
      ),
    180000
  );
  checkForVoteReminder();
  setInterval(checkForVoteReminder, 60 * 1000);
};
