import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import * as express from 'express'
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import TYPES from './constant/types';
import { MongoDBClient } from './infra/mongodb';
import { InspectionRepository } from './repo/inspection';
import './controller/inspection';
import { readConfig } from './constant/config';
import path = require('path');

// load everything needed to the Container
let container = new Container();

if (process.env.NODE_ENV === 'development') {
  let logger = makeLoggerMiddleware();
  container.applyMiddleware(logger);
}

container.bind(TYPES.Config).toConstantValue(readConfig());
container.bind<MongoDBClient>(TYPES.MongoDBClient)
  .to(MongoDBClient).inSingletonScope();
container.bind<InspectionRepository>(TYPES.InspectionRepo)
  .to(InspectionRepository).inSingletonScope();

async function start() {
  await container.get<MongoDBClient>(TYPES.MongoDBClient).init();
  // start the server
  let server = new InversifyExpressServer(container);
  let app = server.build();

  app.use(express.static(path.join(__dirname, "public")))
  app.use('/', function(req, res){
    res.sendFile(path.join(__dirname, "public", "view.html"))
  })

  server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
    app.use(helmet.default());
  });
  app.listen(3000);
  console.log('Server started on port 3000');
}

start();
