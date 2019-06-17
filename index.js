const config = require("./config");
const Discord = require("discord.js");
const rbx = require("noblox.js")
const db = require("quick.db")
const bot = new Discord.Client({
  disableEverybody: true
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
});

bot.on(`guildMemberAdd`, member => {
  console.log(`User ` + member.user.username + ` has joined`)
  var role = member.guild.roles.find('name', 'Enlisted')
  member.addRole(role)
});


bot.on("message", async message => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if(cmd === `ping`){
    let msg = await message.channel.send("Testing how long it takes for perm to attach to bot...")
    msg.edit(`It takes ${msg.createdTimestamp - message.createdTimestamp}ms to attach perm to bot. Ping is ${Math.round(bot.ping)}ms`)
  } else
  if(cmd === `addrole`){
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      return message.reply("Insufficient Permissions.").then(r => r.delete(5000))
    }
    if (message.mentions.users.size === 0) {
      return message.reply("Please mention a user.").then(r => r.delete(5000))
    }
    let roleMember = message.guild.member(message.mentions.users.first())
    if (!roleMember) {
      return message.reply("Invalid Member").then(r => r.delete(5000))
    }
    let role = args.slice(message.mentions.members.size).join(' ')
    if (!role) {
      return message.reply('Please add a role.').then(r => r.delete(5000))
    }
    let realrole = message.guild.roles.find(`name`, role)
    if (!realrole) {
      return message.reply("Please add a valid role").then(r => r.delete(5000))
    }
    if (roleMember.highestRole.position > message.member.highestRole.position) {
      return message.reply("Cannot role this person!").then(r => r.delete(5000));
    }
    if (message.member.highestRole.position < realrole.position) {
      return message.reply("Role too high to be added!").then(r => r.delete(5000));
    }
    let sicon = message.guild.iconURL
    let roleEmbed = new Discord.RichEmbed()
      .setAuthor("TES Bot", bot.user.avatarURL)
      .setThumbnail(sicon)
      .setTitle(`PROMOTION BY ` + message.author.username)
      .setDescription(`LOG`)
      .addField("Promoted Person:", roleMember.user.username, true)
      .addField("Role Added:", realrole.name, true)
      .addField("Promoted Channel:", message.channel, true)
      .addField("Time:", message.createdAt, true)
      .setFooter("Prefix: ! | This bot is still in it's early phases | Go kill some HBC for me will ya?!", bot.user.avatarURL)
      .setTimestamp();

    roleMember.addRole(realrole.id).then(messag => {
      message.reply(`${message.author.username} has added the role ${realrole.name} to ${roleMember.user.username}`)
      let channel = message.guild.channels.find(`name`, `logs`)
      channel.send(roleEmbed);
    })
  }
});

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

bot.login(process.env.token);
