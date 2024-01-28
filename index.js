const { Client, Collection, Events, GatewayIntentBits, Partials, Routes ,REST} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const client = new Client({
  intents: [GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember],
  shards: "auto"
});

/* SYSTEM INFO*/
let token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
let appID = "xxxxxxxxxxxxxx";

// variable that holds commands 
client.commands = new Collection();

// loader function
function addCommand(command){ client.commands.set(command.data.name, command); }

/*-------------------------------------------------------------------------------------------------*/
/*----------------------------------------- Adds commands -----------------------------------------*/
/*-------------------------------------------------------------------------------------------------*/
addCommand({
  addminCommand: true,
  data: new SlashCommandBuilder()
      .setName("ding")
      .setDescription("Pong!"),
    async execute(interaction) {
      await interaction.reply('Pong!');
    },
});

addCommand({
  data: new SlashCommandBuilder()
      .setName("ping2")
      .setDescription("Pong!2"),
    async execute(interaction) {
      await interaction.reply('Pong!2');
    },
});



/*-------------------------------------------------------------------------------------------------*/
/*---------------------------------------- Handle commands ----------------------------------------*/
/*-------------------------------------------------------------------------------------------------*/
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) { console.error(`No command matching ${interaction.commandName} was found.`); return; }

  if(command.addminCommand == true && !(interaction.member.roles.cache.some(role => role.name === 'Moštař')) ){
    await interaction.reply({ content: 'Dont have permision for this!', ephemeral: true });
    return;
  }


	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});



/*-------------------------------------------------------------------------------------------------*/
/*---------------------------------------- Deploy commands ----------------------------------------*/
/*-------------------------------------------------------------------------------------------------*/
const rest = new REST().setToken(token);

(async () => {
	try {

    // load from map to array for refreshing command snipet
    const commands = [];
    for (const [key, value] of client.commands) {
      commands.push(value.data);
    }

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(appID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();



/*-------------------------------------------------------------------------------------------------*/
/*------------------------------------------- Run client ------------------------------------------*/
/*-------------------------------------------------------------------------------------------------*/
client.login(token);
