/* eslint valid-jsdoc: "off" */

'use strict';

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
        '/example': {
          connectionMiddleware: [ 'connection' ],
          packetMiddleware: ['packet'],
        },
      },
    };
  
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