import { MessageEmbed } from "discord.js";
import { bot, Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Sends some help!"),
  async execute(interaction) {
    const embed1: MessageEmbed = new MessageEmbed()
      .setColor(`#384c5c`)
      .setTitle(`Commands`)
      .setDescription(
        `key: [] is required and () is optional\n` +
          `**/settimezone [timezone]** - configures your timezone\n` +
          `**/gettimezone (@user)** - gets the timezone of a given user (defaults to yourself)\n` +
          `**/timestamp [hour] (min) (am_pm) (date) (month) (year) (date_format) (timezone) (include_raw)** - creates a timestamp according to the data you provide\n` +
          `**/enable** - enables automatic timestring detection and translation\n` +
          `**/disable** - disables automatic timestring detection and translation\n` +
          `**/help** - you are looking at me right now 👀\n` +
          `**/ping** - replies with "Pong" and the latency`
      );

    const embed2: MessageEmbed = new MessageEmbed()
      .setColor(`#384c5c`)
      .setTitle(`How the bot works`)
      .setDescription(
        `If you have set your timezone, the bot will automatically reply to any message that it detects a timestring in with the timestamp. ` +
          `It can also recognise and translate multiple timestrings in a single message. ` +
          `Here are examples of timestrings:\n` +
          `> 12:00\n` +
          `> 9:34 pm\n` +
          `> 07:34AM tmr\n` +
          `> 2:47 8 days ago\n` +
          `> 09:51pm 7 days later\n` +
          `> 11:58 ytd\n` +
          `etc...`
      )
      .setFooter({
        iconURL: bot.user.avatarURL(),
        text: "If you like the bot, consider upvoting it https://top.gg/bot/950382032620503091",
      });

    await interaction.reply({ embeds: [embed1, embed2], content: null });
  },
});
