//Does some basic defintions in order to make the bot function
const Discord = require('discord.js');
const client = new Discord.Client();
const schedule = require('node-schedule');

//Saves two alternative dice rolling commands
var diceString = new RegExp(/^~r\s\d+d\d+/i);
var diceStringAlt = new RegExp(/^~r\sd\d+/i);
var diceAlt = new RegExp(/\sd/);
var diceSplit = new RegExp(/[^0123456789\+\-\*\/]+/)

//Declares function that calculates dice total
function diceCalculator(diceAmount, diceNumber) {
  var diceTotalTemp = 0;
  for (i = 0; i < diceAmount; i++) {
    diceTotalTemp += Math.floor((Math.random() * diceNumber) + 1);
  }
  return diceTotalTemp;
}

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
    //Saves the message's content as a string
    var messageString = message.content;

    //Ignores message if it does not start with prefix
    if (!message.content.startsWith(prefix)) return;

    //Ignores message if message is sent by another bot or itself
    if (message.author.bot) return;

    //Displays the amount of time it took in miliseconds to receive command and to respond
    if (message.content.toLowerCase() === (prefix + 'ping')) {
      //Creates a variable to save the user's message time
      var startTime = message.createdTimestamp;

      //Sends a placeholder message to compare times
      message.channel.send(`:ping_pong: Pong!`).then(message => {
          //Subtracts this message's time by the user's message to calculate ping
          message.edit(`This message took \`${Math.round(message.createdTimestamp - startTime)} ms\` to reach you!`);
          //Checks to see if there is a 0 or negative ping value, then displays error message
          if (Math.round(message.createdTimestamp - startTime <= 0)) {
            message.channel.send('Wait a minute, that can\'t be right...')
          }
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
    } else

    //Responds to a message with a relevant image
    if (message.content.toLowerCase() === (prefix + 'bitchholdon')) {
      message.channel.send("", {
        file: "https://i.imgur.com/XHBa71T.jpg"
      });
    } else

    //B emoji version of ping command
    if (message.content.toLowerCase() === (prefix + '🅱ing') || message.content.toLowerCase() === (prefix + '🅱️ing')) {
      //Creates a variable to save the user's message time
      var startTime = message.createdTimestamp;

      //Sends a placeholder message to compare times
      message.channel.send(`:ping_pong: :b:ong!`).then(message => {
          //Subtracts this message's time by the user's message to calculate ping
          message.edit(`This :b:essage took \`${Math.round(message.createdTimestamp - startTime)} ms\` to :b:each you!`);
          //Checks to see if there is a 0 or negative ping value, then displays error message
          if (Math.round(message.createdTimestamp - startTime <= 0)) {
            message.channel.send('Wait a :b:inute, that can\'t be :b:ight...')
          }
      });
    } else

    //Checks to see if the message follows the dice roll command format
    if (diceString.test(messageString) || diceStringAlt.test(messageString)) {
      //Declares some variables for use later
      var diceAmount = 0;
      var diceNumber = 0;
      var diceTotal = 0;

      //Splits the message into two numbers
      var messageArray = message.content.split(diceSplit);

      //Checks to see if the message is a variant of the dice rolling command
      if (diceAlt.test(messageString)) {
        //Sets the dice amount and dice number
        diceAmount = 1;
        diceNumber = parseInt(messageArray[1]);

        //Checks to see if the dice variables are positive numbers
        if (diceAmount <= 0 || diceNumber <= 0) {
          message.channel.send('Please don\'t send non-positive values.');
          return;
        }

        //Checks to see if the dice variables are bigger or equal to 100,000
        if (diceAmount >= 100000 || diceNumber >= 100000) {
          message.channel.send('Please only use values less than 100,000.')
          return;
        }

        //Calculates the dice total before any operations
        diceTotal = diceCalculator(diceAmount, diceNumber)

        //Applies operators to the dice result
        for (i = 1; i < (Math.floor((messageArray.length + 1) / 2)); i++) {
          if (messageArray[(i + i)] == '+') {
            diceTotal += parseInt(messageArray[(i + i + 1)]);
          } else

          if (messageArray[(i + i)] == '-') {
            diceTotal -= parseInt(messageArray[(i + i + 1)]);
          } else

          if (messageArray[(i + i)] == '*') {
            diceTotal *= parseInt(messageArray[(i + i + 1)]);
          } else

          if (messageArray[(i + i)] == '/') {
            diceTotal = Math.round(diceTotal / parseInt(messageArray[(i + i + 1)]));
          } else {
            message.channel.send('Please only use basic arithmetic operators.');
            return;
          }
        }
      } else {
        //Sets the dice amount and dice number
        diceAmount = parseInt(messageArray[1]);
        diceNumber = parseInt(messageArray[2]);

        //Checks to see if the dice variables are positive numbers
        if (diceAmount <= 0 || diceNumber <= 0) {
          message.channel.send('Please don\'t send non-positive values.');
          return;
        }

        //Checks to see if the dice variables are bigger or equal to 100,000
        if (diceAmount >= 100000 || diceNumber >= 100000) {
          message.channel.send('Please only use values less than 100,000.');
          return;
        }

        //Calculates the dice total before any operations
        diceTotal = diceCalculator(diceAmount, diceNumber)

        //Applies operators to the dice result
        for (i = 1; i < (Math.floor((messageArray.length) / 2)); i++) {
          if (messageArray[(i + i + 1)] == '+') {
            diceTotal += parseInt(messageArray[(i + i + 2)]);
          } else

          if (messageArray[(i + i + 1)] == '-') {
            diceTotal -= parseInt(messageArray[(i + i + 2)]);
          } else

          if (messageArray[(i + i + 1)] == '*') {
            diceTotal *= parseInt(messageArray[(i + i + 2)]);
          } else

          if (messageArray[(i + i + 1)] == '/') {
            diceTotal = Math.round(diceTotal / parseInt(messageArray[(i + i + 2)]));
          } else {
            message.channel.send('Please only use basic arithmetic operators.');
            return;
          }
        }
      }

      //Adds commas to answer
      var diceTotalString = diceTotal.toLocaleString();

      //Sends the dice total
      message.channel.send(diceTotalString);
    } else

    //Debug message
    message.channel.send("Error: Command not recognized.");
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
  http.get('http://frogbotdiscord.herokuapp.com');
}, 900000);

var frogTime2 = schedule.scheduleJob({hour: 2, minute: 0, dayOfWeek: 3}, function(){
  client.channels.get('140946564901240832').send("", {
    file: "https://i.imgur.com/SPDD3R2.jpg"
  });
});
