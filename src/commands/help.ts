import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Sends some help!"),
  async execute(interaction) {
    const embed0: MessageEmbed = new MessageEmbed()
      .setColor(`#60707d`)
      .setTitle("Getting started with the bot")
      .setDescription(
        `1. Invite ${bot.user} to any server than you want to use me in!\n` +
          "2. Use `/settimezone` to configure your timezone!\n" +
          "3. Now type a message that includes one/multiple timestrings! A timestring is something like `12:34 today` or `4:51pm 2d ago`. Use `/timestrings` for more detailed information.\n" +
          "4. Now enjoy the hassle-free and fully automatic timezone conversion when talking to your friends in another timezone!"
      );

    const embed1: MessageEmbed = new MessageEmbed()
      .setColor(`#4c5e6c`)
      .setTitle(`Commands`)
      .setDescription(
        `key: [] is required and () is optional\n` +
          `**/settimezone [timezone]** - configures your timezone\n` +
          `**/gettimezone (@user)** - gets the timezone of a given user (defaults to yourself)\n` +
          `**/gettimezonetime [timezone]** - gets the local time of a given timezone\n` +
          `**/getusertime [@user]** - gets the local time of a given user\n` +
          `**/timestamp (hour) (min) (am_pm) (date) (month) (year) (date_format) (timezone) (include_raw)** - creates a timestamp according to the data you provide\n` +
          `**/enable** - enables automatic timestring detection and translation\n` +
          `**/disable** - disables automatic timestring detection and translation\n` +
          `**/help** - you are looking at me right now 👀\n` +
          `**/timestrings** - shows you examples of timestrings\n` +
          `**/ping** - replies with "Pong" and the latency`
      );

    // const embed2: MessageEmbed = new MessageEmbed()
    //   .setTitle(`How the bot works`)
    //   .setDescription(
    //     `If you have set your timezone, the bot will automatically reply to any message that it detects a timestring in with the timestamp. ` +
    //       `It can also recognise and translate multiple timestrings in a single message. ` +
    //       `Here are examples of timestrings:\n` +
    //       `> 12:00\n` +
    //       `> 9:34 pm\n` +
    //       `> 07:34AM tmr\n` +
    //       `> 2:47 8 days ago\n` +
    //       `> 09:51pm 7 days later\n` +
    //       `> 11:58 ytd\n` +
    //       `etc...`
    //   );

    const buttonRow = new MessageActionRow().setComponents([
      new MessageButton()
        .setEmoji("👤")
        .setLabel("Invite Me")
        .setStyle("LINK")
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=950382032620503091&permissions=274877926400&scope=bot%20applications.commands"
        ),
      new MessageButton()
        .setEmoji("❔")
        .setLabel("Support Server")
        .setStyle("LINK")
        .setURL("https://discord.gg/J2xKqDKpGt"),
      new MessageButton()
        .setEmoji("🔼")
        .setLabel("Vote for Me!")
        .setStyle("LINK")
        .setURL("https://top.gg/bot/950382032620503091/vote"),
    ]);

    await interaction.reply({
      embeds: [embed0, embed1],
      components: [buttonRow],
      content: null,
    });
    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed().setTitle("/help").setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.avatarURL(),
        }),
      ],
    });
  },
});
