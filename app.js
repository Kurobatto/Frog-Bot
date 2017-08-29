//Does some basic defintions in order to make the bot function
const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;

//Sends startup message when fired
client.on('ready',() => {
    console.log('Frogbot ready for combat!');
    client.channels.get('145013323019059200').send('Teleport successful!')
});

//Sets the prefix required to activate the bot
var prefix = '~'

//Fires on message send in any channel
client.on('message', message => {
    //Ignores message if it does not start with prefix
    if (!message.content.startsWith(prefix)) return;

    //Ignores message if message is sent by another bot or itself
    if (message.author.bot) return;

    //Displays the amount of time it took in miliseconds to receive command and to respond
    if (message.content === (prefix + 'ping')) {
        message.channel.send(`This message took \`${Date.now() - message.createdTimestamp} ms\` to reach you!`);
    } else

    //Message that tells commands, aka huge mess. Need to find a better way to display in source code.
    if (message.content === (prefix + 'commands')) {
      message.channel.send(`\`\`\`css\nPing - Displays the amount of time it takes the bot to recieve your message and send a response\nDatBoi - Here comes dat boi\nOShitWaddup - O shit waddup\n\`\`\``);
    } else

    //Responds with a meme to a meme hypothesis
    if (message.content === (prefix + 'datboi')) {
      message.channel.send('O shit waddup!');
    } else

    //Responds with a meme to a meme conclusion
    if (message.content === (prefix + 'oshitwaddup')) {
        message.channel.send('Here comes dat boi!');
    }
});

//Tells the bot what token to login with
client.login(token);
