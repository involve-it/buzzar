/**
 * Created by aarutunyan on 3/18/15.
 */
// source emo$ server:
{
  var portNumber = '8888', //src server
      dirName = './',
      express = require('express'),
      app = express();
  app.use(express.static(dirName));
  app.listen(portNumber);

  console.log('new static express server is running, dir name = ' + dirName + ', port number = ' + portNumber);
}
