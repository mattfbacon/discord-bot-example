require("dotenv").config();
const Discord = require("discord.js");
const mathjs = require("mathjs");

const client = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

if (!process.env.CLIENT_TOKEN) {
	console.error("Please provide token via CLIENT_TOKEN");
	process.exit(1);
}
client.login(process.env.CLIENT_TOKEN);

const commands = new Map([
	["ping", ping],
	["help", help],
	["math", math],
]);

client.on("messageCreate", async (msg) => {
	const PREFIX = "prefix! ";
	if (!msg.content.startsWith(PREFIX)) {
		return;
	}
	const [command, ...args] = msg.content.slice(PREFIX.length).split(" ");
	const handler = commands.get(command);
	if (handler) {
		handler(msg, args);
	} else {
		await msg.reply("Unknown command");
	}
});

async function ping(msg, _args) {
	await msg.reply("Pong!");
}
ping.help = "Send the bot a ping";

async function help(msg, args) {
	if (args[0]) {
		const name = args[0];
		const command = commands.get(name);
		if (command) {
			await msg.reply(
				`Help for the \`${name}\` command: ${command.help ?? "Sorry, no help."}`
			);
		} else {
			await msg.reply("Unknown command");
		}
	} else {
		await msg.reply(
			`Here are the commands you can use:\n\`\`\`${[...commands.entries()]
				.map(([name, { help }]) => `${name}: ${help ?? "Sorry, no help."}`)
				.join("\n")}\`\`\``
		);
	}
}
help.help = "List commands or get help with a command";

async function math(msg, args) {
	const expression = args.join(" ");
	await msg.reply(mathjs.evaluate(expression).toString());
}
math.help = "Evaluate a mathematical expression";
