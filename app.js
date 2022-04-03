// Modules
let express = require('express');
let http = require('http');
let socketio = require('socket.io');
let morgan = require('morgan');
let config = require('./config');

// Constantes
const app = express();
const server = http.Server(app);
const io = socketio(server);
const port = config.express.port;
const options = {
  root: __dirname + '/views'
}

// Variables globales
let usernames = [];

// Middlewares
app.use(express.static(options.root))
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  console.log();
  res.sendFile('index.html', options);
});

app.get('/params/:name', (req, res) => {
  res.send(req.params.name);
});

// IO
io.on('connection', socket => {
  console.log('user connected: ' + socket.id);

  // Traitement pour l'assignation d'un username
  socket.on('setUsername', (usernameWanted) => {
    
    // Traitement string
    usernameWanted = usernameWanted.trim();

    // Vérification de l'unicité de l'username
    let usernameTaken = false;
    for (let socketid in usernames) {
      if(usernames[socketid] == usernameWanted) {
        usernameTaken = true;
      }
    }

    let timeFakeLoading = 1000;
    setTimeout(() => {
      // Traitement final
      if(usernameTaken) {
        socket.emit('rejetUsername', usernameWanted);
      } else {
        usernames[socket.id] = usernameWanted;
        socket.emit('acceptUsername', usernameWanted);
      }
    }, timeFakeLoading)

  });

  // Déconnexion de l'utilisateur
  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);
    if(usernames[socket.id]) {
      delete usernames[socket.id];
      console.log('username deleted');
    }
  });
});

// Lancement de l'application
server.listen(port, () => {
  console.log(`Serveur started on port ${port}`);
});