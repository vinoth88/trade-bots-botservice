/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
const KrakenClient = require('./kraken');


const secret = 'pu/SU+ZgW6ceZuNoovnhDlbF7NPaYn2QbovLGWOfmK20lncgOoUKwGofldLIvfOpk5iQs2XHnH6bl2k0lnKwOQ=='; // API Key
const key = 'GeIiSp+TLvTaCgQ76q93wVn1JpubCbClbK2YkZ9xmH+5HAy2vbb+HRDg';


const kraken = new KrakenClient(key, secret);


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */




// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
//    session.send("You said: %s", session.message.text);
     var reply = new builder.Message()
        .address(session.message.address);

    var text = session.message.text.toLocaleLowerCase();
     
     switch (text) {
        case 'show me a hero card':
            reply.text('Sample message with a HeroCard attachment')
                .addAttachment(new builder.HeroCard(session)
                    .title('Sample Hero Card')
                    .text('Displayed in the DirectLine client'));
            break;

        case 'send me a botframework image':
            reply.text('Sample message with an Image attachment')
                .addAttachment({
                    contentUrl: 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png',
                    contentType: 'image/png',
                    name: 'BotFrameworkOverview.png'
                });

            break;
            
         case 'status':
            
            var accountBalance;
            
            kraken.api('TradeBalance', function(err, data) {

            if (err) {
                reply.text('SomeThing went wrong try again \'' );
             }
                 var temp = data.result;
                 accountBalance = temp.eb + temp.tb + temp.m + temp.n + temp.c + temp.v + temp.e + temp.mf + temp.ml;
                  reply.text(accountBalance);
           });
           
         
            break;

        default:
            reply.text('You said \'' + session.message.text + '\'');
            break;
    }

    session.send(reply);
});
