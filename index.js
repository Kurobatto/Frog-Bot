//Does some basic defintions in order to make the bot function
const Discord = require("discord.js");
const client = new Discord.Client();
const schedule = require("node-schedule");
const http = require("http");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

//Tracks points for
const pointProvider = new EnmapLevel({name: "points"});
client.points = new Enmap({provider: pointProvider});

client.pointsMonitor = (client, message) => {
  //Returns if message is dm
  if (message.channel.type !=="text") return;

  //Returns if it is a bot command
  if (message.content.startsWith("~")) return;

  //Creates a new score tally if the user doesn't have one, then adds points
  const score = client.points.get(message.author.id) || { points: 0, level: 0 };
  score.points++;

  //Calculates your points for your level
  const curLevel = Math.floor(0.3 * Math.sqrt(score.points));

  //Checks to see if you have enough points to go up a level
  if (score.level < curLevel) {
    message.reply(`Congratulations, you leveled up to level **${curLevel}**! Ribbit :frog:`);
    score.level = curLevel;
  }

  //Saves the new score
  client.points.set(message.author.id, score);
};

//Tells the bot what token to login with
client.login(process.env.BotToken);

//Sends startup message when fired
client.on("ready",() => {
  console.log("Frogbot ready for combat!");
  //Sets the bot"s game display message
  client.user.setPresence({ status: "online", game: { name: "on a unicycle", type: 0 } });
});

//Defines the array for each discord channel
var discordChannel = ["98910743633608704", "99249836628406272", "140946564901240832", "99249863128002560", "200384608745947137", "145013323019059200", "308052854227075074", "208739103674466304", "263868020059799552", "348892634250739712", "106046995860332544", "106049853494198272", "276383014890504193", "268216162452635649", "139408808031027200", "192855751063109632", "368823287419240458"];

//Saves two alternative dice rolling commands
var diceString = new RegExp(/^~r\s\d+d\d+/i);
var diceStringAlt = new RegExp(/^~r\sd\d+/i);
var diceAlt = new RegExp(/\sd/);
var diceSplit = new RegExp(/[^0123456789+\-*/]+/);

//Declares variables for mojave function
var mojaveHour = 0;
var mojaveMinute = 0;
var mojaveRule = new schedule.RecurrenceRule();

//Declares regexps for difference of two squares command
var squaresString = new RegExp(/^~squares\s\d+/i);
var squaresSplit = new RegExp(/[^0123456789]+/);

//Declares regexps for rock paper scissors commands
var rpsString = new RegExp(/^~rps\s[a-z]+/i);
var rpsSplit = new RegExp(/[^a-zA-Z]+/);

//Functions that determines a new random time for Mojave meme
function mojaveTime() {
  //Sets time for the mojave meme
  mojaveHour = Math.floor((Math.random() * (23 - 0 + 1)) + 0);
  mojaveMinute = Math.floor((Math.random() * (59 - 0 + 1)) + 0);
  mojaveRule.dayOfWeek = 4;
  mojaveRule.hour = mojaveHour;
  mojaveRule.minute = mojaveMinute;
  console.log(mojaveMinute + " " + mojaveHour);
}

//Executes mojaveTime function
mojaveTime();

//Declares function that calculates dice total
function diceCalculator(diceAmount, diceNumber) {
  var diceTotalTemp = 0;
  for (var i = 0; i < diceAmount; i++) {
    diceTotalTemp += Math.floor((Math.random() * diceNumber) + 1);
  }
  return diceTotalTemp;
}

//Sets the prefix required to activate the bot
var prefix = "~";

//Fires on message send in any channel
client.on("message", message => {
  //Saves the message"s content as a string
  var messageString = message.content;

  //Ignores message if message is sent by another bot or itself
  if (message.author.bot) return;

  //Sends control to pointsMonitor function
  client.pointsMonitor(client, message);

  //Responds when bot is praised
  if (message.content.toLowerCase().startsWith("good boi")) {
    message.channel.send("Ribbit :frog:");
  } else

  //Responds when bot is criticized
  if (message.content.toLowerCase().startsWith("bad boi")) {
    message.channel.send("<:ChillBinch:248943253221670923>");
  }

  //Ignores message if it does not start with prefix
  if (!message.content.startsWith(prefix)) return;

  //Displays the amount of time it took in miliseconds to receive command and to respond
  if (message.content.toLowerCase() === (prefix + "ping")) {
    //Creates a variable to save the user"s message time
    var startTime = message.createdTimestamp;

    //Sends a placeholder message to compare times
    message.channel.send(":ping_pong: Pong!").then(message => {
      //Subtracts this message"s time by the user"s message to calculate ping
      message.edit(`This message took \`${Math.round(message.createdTimestamp - startTime)} ms\` to reach you!`);
      //Checks to see if there is a 0 or negative ping value, then displays error message
      if (Math.round(message.createdTimestamp - startTime <= 0)) {
        message.channel.send("Wait a minute, that can\"t be right...");
      }
    });
  } else

  //Message that tells commands, aka huge mess. Need to find a better way to display in source code.
  if (message.content.toLowerCase() === (prefix + "commands")) {
    message.channel.send(`\`\`\`css\nPing - Displays the amount of time it takes the bot to recieve your message and send a response\nDatBoi - Here comes dat boi\nOShitWaddup - O shit waddup\n\`\`\``);
  } else

  //Responds with a meme to a meme hypothesis
  if (message.content.toLowerCase() === (prefix + "datboi")) {
    message.channel.send("O shit waddup!");
  } else

  //Responds with a meme to a meme conclusion
  if (message.content.toLowerCase() === (prefix + "oshitwaddup")) {
    message.channel.send("Here comes dat boi!");
  } else

  //Responds with Pingu noises
  if (message.content.toLowerCase() === (prefix + "pingu")) {
    message.channel.send("Noot Noot :penguin:");
  } else

  //Responds to a message with a relevant image
  if (message.content.toLowerCase() === (prefix + "bitchholdon")) {
    message.channel.send("", {
      file: "https://i.imgur.com/XHBa71T.jpg"
    });
  } else

  //B emoji version of ping command
  if (message.content.toLowerCase() === (prefix + "🅱ing") || message.content.toLowerCase() === (prefix + "🅱️ing")) {
    //Sends a placeholder message to compare times
    message.channel.send(":ping_pong: :b:ong!").then(message => {
      //Subtracts this message"s time by the user"s message to calculate ping
      message.edit(`This :b:essage took \`${Math.round(message.createdTimestamp - startTime)} ms\` to :b:each you!`);
      //Checks to see if there is a 0 or negative ping value, then displays error message
      if (Math.round(message.createdTimestamp - startTime <= 0)) {
        message.channel.send("Wait a :b:inute, that can\"t be :b:ight...");
      }
    });
  } else

  //Palindrome message command
  if (message.content.toLowerCase().startsWith(prefix + "palindrome")) {
    //Creates the new string to send
    var reverseMessage = "";
    //Reverses the message sent one character at a time
    for (var i = messageString.length - 1; i >= 12; i--) {
      reverseMessage += messageString[i];
    }
    //Sends the message back to the channel
    message.channel.send(reverseMessage);
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
        message.channel.send("Please don\"t send non-positive values.");
        return;
      }

      //Checks to see if the dice variables are bigger or equal to 100,000
      if (diceAmount >= 100000 || diceNumber >= 100000) {
        message.channel.send("Please only use values less than 100,000.");
        return;
      }

      //Calculates the dice total before any operations
      diceTotal = diceCalculator(diceAmount, diceNumber);

      //Applies operators to the dice result
      for (i = 1; i < (Math.floor((messageArray.length + 1) / 2)); i++) {
        if (messageArray[(i + i)] == "+") {
          diceTotal += parseInt(messageArray[(i + i + 1)]);
        } else if (messageArray[(i + i)] == "-") {
          diceTotal -= parseInt(messageArray[(i + i + 1)]);
        } else if (messageArray[(i + i)] == "*") {
          diceTotal *= parseInt(messageArray[(i + i + 1)]);
        } else if (messageArray[(i + i)] == "/") {
          diceTotal = Math.round(diceTotal / parseInt(messageArray[(i + i + 1)]));
        } else {
          message.channel.send("Please only use basic arithmetic operators.");
          return;
        }
      }
    } else {
      //Sets the dice amount and dice number
      diceAmount = parseInt(messageArray[1]);
      diceNumber = parseInt(messageArray[2]);

      //Checks to see if the dice variables are positive numbers
      if (diceAmount <= 0 || diceNumber <= 0) {
        message.channel.send("Please don\"t send non-positive values.");
        return;
      }

      //Checks to see if the dice variables are bigger or equal to 100,000
      if (diceAmount >= 100000 || diceNumber >= 100000) {
        message.channel.send("Please only use values less than 100,000.");
        return;
      }

      //Calculates the dice total before any operations
      diceTotal = diceCalculator(diceAmount, diceNumber);

      //Applies operators to the dice result
      for (i = 1; i < (Math.floor((messageArray.length) / 2)); i++) {
        if (messageArray[(i + i + 1)] == "+") {
          diceTotal += parseInt(messageArray[(i + i + 2)]);
        } else if (messageArray[(i + i + 1)] == "-") {
          diceTotal -= parseInt(messageArray[(i + i + 2)]);
        } else if (messageArray[(i + i + 1)] == "*") {
          diceTotal *= parseInt(messageArray[(i + i + 2)]);
        } else  if (messageArray[(i + i + 1)] == "/") {
          diceTotal = Math.round(diceTotal / parseInt(messageArray[(i + i + 2)]));
        } else {
          message.channel.send("Please only use basic arithmetic operators.");
          return;
        }
      }
    }

    //Adds commas to answer
    var diceTotalString = diceTotal.toLocaleString();

    //Sends the dice total
    message.channel.send(diceTotalString);
  } else

  //Tests to see if the command is in the proper format
  if (squaresString.test(messageString)) {
    //Splits the command into an array
    var squaresMessageArray = message.content.split(squaresSplit);

    //Converts the number in the command to a variable
    var targetNumber = parseInt(squaresMessageArray[1]);

    //Tests to make sure the number is odd
    if (targetNumber % 2 == 1) {
      //Calculates the squares of the number
      var firstSquare = ((targetNumber - 1) / 2) + 1;
      var secondSquare = (targetNumber - 1) / 2;

      //Adds decimal places to numbers
      var targetNumberString = targetNumber.toLocaleString();
      var firstSquareString = firstSquare.toLocaleString();
      var secondSquareString = secondSquare.toLocaleString();

      //Sends the difference of squares for the number
      message.channel.send(firstSquareString + "^2 - " + secondSquareString + "^2 = " + targetNumberString);
    } else {
      //Sends error message if number is not odd
      message.channel.send("Please make sure your number is odd");
    }
  } else

  if (rpsString.test(messageString)) {
    //Declares player choice variable
    var playerChoice;
    var botchoice = Math.floor((Math.random() * 2) + 0);

    //Splits the message into an array
    var rpsMessageArray = message.content.split(rpsSplit);

    //Saves input into a string, then converts it to lowercase
    var playerChoiceString = rpsMessageArray[2];
    playerChoiceString = playerChoiceString.toLowerCase();

    //Checks to see if the player put a proper attack
    if (playerChoiceString === "rock" || playerChoiceString === "paper" || playerChoiceString === "scissors"){
      //Converts playing act into number
      if (playerChoiceString === "rock") {
        playerChoice = 0;
      } else if (playerChoiceString === "paper") {
        playerChoice = 1;
      } else {
        playerChoice = 2;
      }

      //Sends the bot"s attack
      if (botchoice == 0) {
        message.channel.send("Rock.");
      } else if (botchoice == 1){
        message.channel.send("Paper.");
      } else {
        message.channel.send("Scissors.");
      }

      //Calculates who won
      if (playerChoice == botchoice) {
        message.reply("It was a tie!");
      } else if (playerChoice == 0) {
        if (botchoice == 1) {
          message.reply("You lose!");
        } else {
          message.reply("You win!");
        }
      } else if (playerChoice == 1) {
        if (botchoice == 0) {
          message.reply("You win!");
        } else {
          message.reply("You lost!");
        }
      } else {
        if (botchoice == 0) {
          message.reply("You lost!");
        } else {
          message.reply("You win!");
        }
      }
    } else {
      //Sends error message if the proper command was not chosen
      message.channel.send("Error: Please play with either rock, paper, or scissors");
    }
  } else

  if (message.content.toLowerCase() === (prefix + "points")) {
    try {
      const scorePoints = client.points.get(message.author.id).points;
      !scorePoints ? message.channel.send("You have no points yet.") : message.channel.send(`You have ${scorePoints} points!`);
    } catch(err) {
      message.channel.send("Please send a non-command message first before checking points.");
    }
  } else

  if (message.content.toLowerCase() === (prefix + "level")) {
    try {
      const scoreLevel = client.points.get(message.author.id).level;
      !scoreLevel ? message.channel.send("You have no levels yet.") : message.channel.send(`You are currently level ${scoreLevel}!`);
    } catch(err) {
      message.channel.send("Please send a non-command message first before checking points.");
    }
  } else

    //Debug message
    message.channel.send("Error: Command not recognized.");
});

//Web application portion that ensures Heroku never falls asleep
const express = require("express");
const app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set("view engine", "ejs");

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + "/public"));

// set the home page route
app.get("/", (request, response) => {
  // ejs render automatically looks in the views folder
  response.render("index");
});

app.listen(port, () => {
  // will echo "Our app is running on http://localhost:5000 when run locally"
  console.log("Our app is running on http://localhost:" + port);
});

// pings server every 15 minutes to prevent dynos from sleeping
setInterval(() => {
  http.get("http://frogbotdiscord.herokuapp.com");
}, 900000);

schedule.scheduleJob({hour: 0, minute: 0, dayOfWeek: 3}, function(){
  client.channels.get(discordChannel[discordChannel.indexOf("140946564901240832")]).send("", {
    file: "https://i.imgur.com/SPDD3R2.jpg"
  });
});

schedule.scheduleJob(mojaveRule, function(){
  client.channels.get(discordChannel[Math.floor(Math.random() * discordChannel.length)]).send("Patrolling the Mojave almost makes you wish for a nuclear winter.");
});

schedule.scheduleJob({hour: 0, minute: 0, dayOfWeek: 5}, function(){
  mojaveTime();
});
