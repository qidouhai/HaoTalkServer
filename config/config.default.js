/* eslint valid-jsdoc: "off" */

'use strict';
const qs = require('qs')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1610874551606_9368';

  // add your middleware config here
  config.middleware = [];

  config.io = {
      namespace: {
        '/': {
          connectionMiddleware: [ 'auth' ],
          packetMiddleware: [ 'filter' ],
        },
      },
      generateId: req=>{
        const data = qs.parse(req.url.split('?')[1])
        return data.userId
      }
    };
  config.bodyParser={
      formLimit: '100mb',
      jsonLimit: '100mb',
      textLimit: '100mb',
      onerror:
        (err, ctx) => {
          console.log(err);
          ctx.body = 'error';
          ctx.status = 500;
        },
  };
  config.cache={
    default:'memory',
    stores:{
      memory:{
        driver:'memory',
        max:100,
        ttl:0
      }
    }
  }
  /* config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '192.168.43.249',
    }
} */
  config.mysql={
    client:{
      host:'localhost',
      port:'3306',
      user:'root',
      password:'123456',
      database:'chatsDatabase'
    },
    app:true,
    agent:false,
  }

  config.jwt={
    secret:'haohao'
  }

  config.cors={
    origin:'*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  config.multipart={
    mode:'file'
  }
  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList:['*'],
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  
  return {
    ...config,
    ...userConfig,
  };
};
