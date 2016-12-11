module.exports = {
  servers: {
    one: {
      host: '188.225.37.147',
      username: 'root',
      password: '3RqjPogt',
      // pem: '/home/user/.ssh/id_rsa', // mup doesn't support '~' alias for home directory
      // password: 'password',
      // or leave blank to authenticate using ssh-agent
      opts: {
        port: 22
      },
    }
  },

  meteor: {
    name: 'buzzar',
    path: '/home/webuser/projects/buzzar/meteor-app', // mup doesn't support '~' alias for home directory
    // port: 000, // useful when deploying multiple instances (optional)
    docker: {
      image: 'abernix/meteord:base' // (optional)
      // image: 'abernix/meteord:base', // use this image if using Meteor 1.4+

    },
    servers: {
      one: {} // list of servers to deploy, from the 'servers' list
    },
    buildOptions: {
      serverOnly: true,
      debug: false,
      cleanAfterBuild: true // default
      //buildLocation: '/my/build/folder', // defaults to /tmp/<uuid>
      /*mobileSettings: {
       yourMobileSetting: "setting value"
       }*/
    },
    env: {
      ROOT_URL: 'https://shiners.mobi',
      MONGO_URL: 'mongodb://buzzarrw:7Y3MEgANBDsIWgHdhHLUJYMbs@188.225.37.147:27017/buzzar'
    },
    /*log: { // (optional)
     driver: 'syslog',
     opts: {
     "syslog-address":'udp://syslogserverurl.com:1234'
     }
     },*/
    ssl: {
      port: 443,
      crt: './chained.crt',
      key: './server.key',
    },
    deployCheckWaitTime: 60 // default 10
  }
};