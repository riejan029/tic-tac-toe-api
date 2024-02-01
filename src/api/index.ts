import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";
import ticTacToe from "./ticTacToe";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/tic-tac-toe", ticTacToe);
export default router;
