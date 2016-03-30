'use strict';

var express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  mongoose = require('mongoose'),
  q = require('q'),
  app = express();

require('./models/user.js');
require('./models/project.js');
require('./models/device.js');

const User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  Device = mongoose.model('Device');

//View rendering, you can rip this out if your creating an API
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

mongoose.connect('mongodb://greg:secret@ds011820.mlab.com:11820/gwdevices');

let db = mongoose.connection
db.on('error', console.error.bind(console, 'Error connecting to mongodb: '));
db.once('open', console.log.bind(console, 'Database connected.'));
mongoose.Promise = q.Promise;

app.get('/users', function (req, res, next) {
  User.find()
    .populate({
      path: 'projects',
      model: 'Project',
      populate: {
        path: 'devices',
        model: 'Device'
      }
    })
    .exec()
    .then(users => {
      res.json({users}); 
    });
});

app.post('/users', function (req, res, next) {
  let user = new User(req.body);
  user.save()
    .then(() => {
      res.json(user); 
    })
    .catch(err => {
      next(err);
    });
});

app.get('/devices', function (req, res, next) {
  Device.find()
    .then(devices => {
      res.json({devices});
    });
});

app.post('/devices', function (req, res, next) {
  let device = new Device(req.body);
  device.save()
    .then(() => {
      res.json(device);
    })
    .catch(err => {
      next(err);
    });
});

app.get('/projects', function (req, res, next) {
  Project.find()
    .then(projects => {
      res.json({projects});
    });
});

app.patch('/projects/:projectId/:deviceId', (req, res, next) => {
  Project.findById(req.params.projectId)  
    .then(project => {
      project.devices.push(req.params.deviceId);   
      project.save() 
        .then(() => {
          res.send(200); 
        });
    });
});

app.post('/projects/:userId', function (req, res, next) {
  let project = new Project(req.body);
  project.save()
    .then(() => {
      User.findById(req.params.userId)
        .then(user => {
          user.projects.push(project._id);
          user.save()
            .then(() => {
              res.json(project); 
            });
        });
    })
    .catch(err => {
      next(err);
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server up and running at http://localhost:${process.env.PORT || 3000}`);
});