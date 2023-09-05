import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import TYPES from './constant/types';
import {  MongoDBClient } from './utils/mongodb/client';
import { InspectionsService } from './service/inspection';
import { ConfigProvider } from './config/provider'


import './controller/inspection';


// load everything needed to the Container
let container = new Container();

if (process.env.NODE_ENV === 'development') {
    let logger = makeLoggerMiddleware();
    container.applyMiddleware(logger);
}

container.bind(TYPES.Config).toConstantValue(ConfigProvider.useFactory())
container.bind<MongoDBClient>(TYPES.MongoDBClient).to(MongoDBClient);
container.bind<InspectionsService>(TYPES.InspectionService).to(InspectionsService);


// start the server
let server = new InversifyExpressServer(container);
let app = server.build();

server.setConfig((app) => {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(helmet.default());
});



app.listen(3000);
console.log('Server started on port 3000');

exports = module.exports = app;
