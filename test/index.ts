import {expect} from 'chai';
import m from 'mocha';

import RPSModule from '../src/index';
import { RpsContext } from 'rpscript-interface';

import Botkit from 'botkit';



m.describe('botkit', () => {

  m.it('should chat with console', async function () {
    let ctx = new RpsContext;
    let md = new RPSModule(ctx);

    let output = await md.launch(ctx,{},'console');

    await md.hears(ctx,{},['hi'],'message_received',async function(bot,msg){
      let usr = await md.saveUser(ctx,{},msg);
      
      usr = await md.getUser(ctx,{},msg);
      
      await md.reply(ctx,{},msg,"how's your day");
    });

    await md.hears(ctx,{},['talk'],'message_received',async function(bot,msg){
      await md.startConversation(ctx,{},msg);
      await md.say(ctx,{},'saying something');
    });

  }).timeout(0);

  m.xit('should start console chat from basic implementation', async function () {
    var controller = Botkit.consolebot({
      debug: false,
    });
    
    var bot = controller.spawn();
    
    controller.hears(['hi'], 'message_received', function(bot, message) {
    
        // controller.storage.users.get(message.user, function(err, user) {
            bot.reply(message, 'Hello.');
        // });
    });
  }).timeout(0);

})
