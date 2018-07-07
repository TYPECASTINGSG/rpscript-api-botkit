/**
 * @module botkit
 */

import Botkit, { Message, User, Conversation, ConsoleMessage } from 'botkit';
import {RpsContext,RpsModule,rpsAction} from 'rpscript-interface';

let MOD_ID = "botkit"

export interface ModuleContext {
  controller?:any;
  bot?:any;
  conversation?:Conversation<any>
}

@RpsModule(MOD_ID)
export default class RPSModule {

  constructor(ctx:RpsContext){
  }

  @rpsAction({verbName:'launch-botkit'})
  async launch (ctx:RpsContext,opts:Object, type:string) : Promise<any>{
    let context = ctx.getModuleContext(MOD_ID) || {};

    if(type==='console'){
      context['controller'] = Botkit.consolebot({debug: false});
      context['bot'] = context['controller'].spawn();
    }

    ctx.addModuleContext(MOD_ID,context);

    return context['bot'];
  }

  @rpsAction({verbName:'botkit-hears'})
  async hears (ctx:RpsContext,opts:Object, 
               hearing:string[],evtType:string,response:(bot,msg)=>void) : Promise<void>{
      let controller = ctx.getModuleContext(MOD_ID)['controller'];
      
      controller.hears(hearing, evtType, response);
  }

  @rpsAction({verbName:'botkit-get-user'})
  getUser (ctx:RpsContext,opts:Object, message:Message) : Promise<User>{
    let controller = ctx.getModuleContext(MOD_ID)['controller'];

    return new Promise<User>((resolve,reject) => {

      controller.storage.users.get(message.user, function(err, user) {
        (err) ? reject(err) : resolve(user);
      });
    });
  }

  @rpsAction({verbName:'botkit-save-user'})
  async saveUser (ctx:RpsContext,opts:Object, message:Message) : Promise<User>{
    let controller = ctx.getModuleContext(MOD_ID)['controller'];

    return new Promise<User>((resolve,reject) => {
      controller.storage.users.save(message.user, function(err, user) {
        (err) ? reject(err) : resolve(user);
      });
    });
  }

  @rpsAction({verbName:'botkit-reply'})
  async reply (ctx:RpsContext,opts:Object, message:Message,response:string) : Promise<void>{
    let bot = ctx.getModuleContext(MOD_ID)['bot'];
    bot.reply(message, response);
  }

  @rpsAction({verbName:'botkit-start-conversation'})
  async startConversation (ctx:RpsContext,opts:Object, message:Message) : Promise<Conversation<any>>{
    let modCtx = ctx.getModuleContext(MOD_ID);
    let bot = modCtx['bot'];

    return new Promise<Conversation<any>>((resolve,reject)=>{
      bot.startConversation(message, function (err,convo) {
        if(err)reject(err);
        else {
          modCtx['conversation'] = convo;
          ctx.addModuleContext(MOD_ID,modCtx);
          resolve(convo);
        }
      });
    });
  }

  @rpsAction({verbName:'botkit-ask'})
  async ask (ctx:RpsContext,opts:Object, question:string,
    cb:(response,conv)=>void) : Promise<void>{
      let conversation = ctx.getModuleContext(MOD_ID)['conversation'];
      conversation.ask(question,cb);
  }
  @rpsAction({verbName:'botkit-say'})
  async say (ctx:RpsContext,opts:Object, something:string) : Promise<void>{
    let conversation = ctx.getModuleContext(MOD_ID)['conversation'];
    conversation.say(something);
  }


}
