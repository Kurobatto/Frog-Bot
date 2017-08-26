const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

client.on('ready',() => {
    console.log('Frogbot ready for combat!');
})

var prefix = '~'
client.on('message', message => {
    if (message.content === (prefix + 'ping')) {
        message.channel.send('pong');
    }
});

client.login(settings.token);
