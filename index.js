const config = require("./config");
const Discord = require("discord.js");
const bot = new Discord.Client({
  disableEverybody: true
});


bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
});

bot.on(`guildMemberAdd`, member => {
  return
});


bot.on("message", async message => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if(cmd === `ping`){
    let msg = await message.channel.send("Testing how long it takes for perm to attach to bot...")
    msg.edit(`It takes ${msg.createdTimestamp - message.createdTimestamp}ms to attach perm to bot. Ping is ${Math.round(bot.ping)}`)
  }

});

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

bot.login(process.env.token);
