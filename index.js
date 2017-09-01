//Does some basic defintions in order to make the bot function
const Discord = require('discord.js');
const client = new Discord.Client();

//Sends startup message when fired
client.on('ready',() => {
  console.log('Frogbot ready for combat!');
  //Sets the bot's game display message
  client.user.setPresence({ status: 'online', game: { name: 'on a unicycle', type: 0 } });
});

//Sets the prefix required to activate the bot
var prefix = '~'

//Fires on message send in any channel
client.on('message', message => {
    //Sets the bot's game display message

    //Ignores message if it does not start with prefix
    if (!message.content.startsWith(prefix)) return;

    //Ignores message if message is sent by another bot or itself
    if (message.author.bot) return;

    //Displays the amount of time it took in miliseconds to receive command and to respond
    if (message.content.toLowerCase() === (prefix + 'ping')) {
      //Creates a variable to save the user's message time
      var startTime = message.createdTimestamp;

      //Sends a placeholder message to compare times
      message.channel.send(`Pong!`).then(message => {
          //Subtracts this message's time by the user's message to calculate ping
          message.edit(`This message took \`${Math.round(message.createdTimestamp - startTime)} ms\` to reach you!`)
      });
    } else

    //Message that tells commands, aka huge mess. Need to find a better way to display in source code.
    if (message.content.toLowerCase() === (prefix + 'commands')) {
      message.channel.send(`\`\`\`css\nPing - Displays the amount of time it takes the bot to recieve your message and send a response\nDatBoi - Here comes dat boi\nOShitWaddup - O shit waddup\n\`\`\``);
    } else

    //Responds with a meme to a meme hypothesis
    if (message.content.toLowerCase() === (prefix + 'datboi')) {
      message.channel.send('O shit waddup!');
    } else

    //Responds with a meme to a meme conclusion
    if (message.content.toLowerCase() === (prefix + 'oshitwaddup')) {
      message.channel.send('Here comes dat boi!');
    } else

    //Responds with Pingu noises
    if (message.content.toLowerCase() === (prefix + 'pingu')) {
      message.channel.send('Noot Noot :penguin:');
    }
});

//Tells the bot what token to login with
client.login(process.env.BotToken);

//Web application portion that ensures Heroku never falls asleep
const express = require('express');
const app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', (request, response) => {
    // ejs render automatically looks in the views folder
    response.render('index');
});

app.listen(port, () => {
    // will echo 'Our app is running on http://localhost:5000 when run locally'
    console.log('Our app is running on http://localhost:' + port);
});

// pings server every 15 minutes to prevent dynos from sleeping
setInterval(() => {
 http.get('http://your-app-name.herokuapp.com');
}, 900000);
