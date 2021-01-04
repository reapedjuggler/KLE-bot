require('dotenv').config();

const Discord = require('discord.js');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();


// Greet a new user
bot.on('guildMemberAdd', member => {

    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');

    if (!channel) return;

    let name = member.user.username
    let welcomeEmbed = new Discord.MessageEmbed()
        .setColor('#176ffc')
        .setTitle(`Yay! ${name} you made it to KPH discord Server `)
        .setDescription(`I am your friendly bot written in Javascript, Feel free to tell us more about yourself.`)
        .setFooter('Use !help command to know more about me ')
    channel.send(welcomeEmbed)
})

const getFiles = require('./getFiles');

let commandFiles = [];

bot.on('ready', async () => {
    console.log('The KLE bot is online!');

    await getFiles('./commands')
        .then(files => {
            for (let file of files) {
                let filePath = String(file);
                filePath = './' + filePath.substring(filePath.lastIndexOf('commands\\'));
                commandFiles.push(filePath);
            }

            for (const filePath of commandFiles) {
                const command = require(filePath);
                bot.commands.set(command.name, command);
            }
        })
        .catch(err => console.log(err))
})

bot.on('message', message => {

    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // If a command is not present , log the default message    
    if (!bot.commands.has(command)) {
        if (command[0] === "!")
            bot.commands.get('!invalid').execute(message, args);
        return;
    }

    // otherwise execute that command
    try {
        bot.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

bot.login(process.env.BOT_TOKEN);