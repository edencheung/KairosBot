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
    .setName("timestrings")
    .setDescription("Shows you examples of timestrings!"),
  async execute(interaction) {
    const embed0: MessageEmbed = new MessageEmbed()
      .setColor(`#4c5e6c`)
      .setTitle("Examples of timestrings")
      .setDescription(
        `> 12:00\n` +
          `> 9:34 pm\n` +
          `> 07:34AM tmr\n` +
          `> 2:47 8 days ago\n` +
          `> 09:51pm 7 days later\n` +
          `> 11:58 ytd\n` +
          `etc...`
      );

    const embed1: MessageEmbed = new MessageEmbed()
      .setColor(`#384c5c`)
      .setDescription(
        `If you need more help, want to suggest a feature or submit a bug report, join the [support server](https://discord.gg/J2xKqDKpGt)!\n\n` +
          `If you like the bot, consider upvoting it [here](https://top.gg/bot/950382032620503091).`
      );

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
      content: null,
      components: [buttonRow],
    });

    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed().setTitle("/timestrings").setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.avatarURL(),
        }),
      ],
    });
  },
});
