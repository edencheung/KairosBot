import { EventEmitter } from "stream";
import bodyParser = require("body-parser");

import { apiRouter } from "./api-router";
import express from "express";
import { config } from "..";
import { rootRouter } from "./root-router";

export const votes = new EventEmitter();

const app = express();

app.use(bodyParser.json());
app.use(apiRouter);
app.use(rootRouter);

app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});
