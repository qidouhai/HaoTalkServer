'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
  mysql: {
    enable:true,
    package:'egg-mysql',
  },
  jwt:{
    enable:true,
    package:'egg-jwt',
  },
  cors:{
    enable:true,
    package:'egg-cors'
  }
};

