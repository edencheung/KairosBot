import { Client, Interaction } from "discord.js";
import { commands } from "..";
import { timezones } from "../commands/set-timezone";

export default async (_bot: Client, interaction: Interaction) => {
  if (!interaction.isCommand() && !interaction.isAutocomplete()) return;
  
  if(interaction.isAutocomplete()){
    const focusedValue = interaction.options.getFocused();
    const filtered = timezones.filter(function(tz){
      return tz.toLowerCase().indexOf(focusedValue.toLowerCase()) > -1;
    });
    if(filtered.length <= 25){
      await interaction.respond(
        filtered.map(c => ({ name: c, value: c }))
      );
    }
  }

  if(interaction.isCommand()){
    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
};
