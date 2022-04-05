import express from "express";
import { bot } from "..";
import { votes } from "./server";

export const apiRouter = express.Router();

apiRouter.post("/topgg", (req, res) => {
  if (req.headers["authorization"] !== "kairos bot is the best bot")
    return res.sendStatus(403);
  votes.emit("topgg", req.body.user, req.body.isWeekend);
  res.sendStatus(200);
});

apiRouter.post("/ibl", (req, res) => {
  if (req.headers["authorization"] !== "kairos bot is the best bot")
    return res.sendStatus(403);
  votes.emit(
    "ibl",
    req.body.userID,
    [5, 6, 7].includes(new Date().getUTCDay())
  );
  res.sendStatus(200);
});

apiRouter.post("/discords", (req, res) => {
  if (req.headers["authorization"] !== "kairos bot is the best bot")
    return res.sendStatus(403);
  votes.emit("discords", req.body.user, false);
  res.sendStatus(200);
});
