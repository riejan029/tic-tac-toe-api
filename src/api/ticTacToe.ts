/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/return-await */
import type { CreatePlayersParams, PlayerObject } from "./types";
import express from "express";
import PlayerSchema from "../../models/playerModel";
import SessionSchema from "../../models/sessionModel";
import GamerRecordSchema from "../../models/gameRecords";
import {
  GetWinnerResponse,
  getWinner,
  updatePlayerStats,
} from "./utils/methods";
const router = express.Router();

//Create Player response should be gameId
router.post<CreatePlayersParams>("/addPlayers", async (req, res) => {
  const playersData = req.body.players;

  try {
    // Create a new session
    const newSession = await SessionSchema.create({ players: [] });

    // Create players and associate them with the session
    const createdPlayers = await Promise.all(
      playersData.map(async (playerData: PlayerObject) => {
        const player = new PlayerSchema({
          ...playerData,
          session: newSession._id,
        });
        return await player.save();
      })
    );

    // Update the session with player references
    newSession.players = createdPlayers.map((player) => player);
    await newSession.save();

    // Populate the players in the session to get their details
    const populatedSession = await SessionSchema.populate(newSession, {
      path: "players",
      select: "-_id name numberOfWins numberOfLoss numberOfDraws position",
    });

    res.status(200).json({
      sessionId: populatedSession.sessionId,
      players: populatedSession.players, // Include details of the created players
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Endpoint to add a new game record to a session
router.post("/addGameRecord", async (req, res) => {
  const { winner, rounds, players, sessionId } = req.body;

  try {
    // Create a new GameRecord
    const gameRecord = new GamerRecordSchema({ winner, rounds });

    // Find the session by sessionId
    const session = await SessionSchema.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Find or create Player documents for the players in the game
    const playerPromises = players.map(async (playerData: PlayerObject) => {
      const existingPlayer = await PlayerSchema.findOne({
        name: playerData.name,
      });
      if (existingPlayer) {
        return existingPlayer;
      }

      const newPlayer = new PlayerSchema(playerData);
      return newPlayer.save();
    });

    const createdPlayers = await Promise.all(playerPromises);

    // Update the gameRecord with player references
    gameRecord.players = createdPlayers.map((player) => player._id);

    // Save the gameRecord
    await gameRecord.save();
    await updatePlayerStats(createdPlayers, winner);

    // Add the gameRecord to the session's gameRecords array
    session.gameRecords.push(gameRecord._id);
    await session.save();

    await gameRecord.populate({ path: "players", model: "PlayerSchema" });

    res.status(201).json({
      message: "GameRecord added to session",
      gameRecord,
      sessionId: sessionId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding GameRecord to session", error });
  }
});

//retrieve session records
router.get<{ sessionId: string }>("/getGameRecords", async (req, res) => {
  const { sessionId } = req.query;
  try {
    // Find the session by sessionId
    const session = await SessionSchema.findOne(
      { sessionId },
      "-_id -__v"
    ).populate({
      path: "gameRecords",
      options: { limit: 5, sort: { rounds: 1 } },
      populate: {
        path: "players",
        model: "PlayerSchema",
        select:
          "-_id __v name numberOfWins numberOfLoss numberOfDraws position",
      },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const history = session.gameRecords;

    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving game records", error });
  }
});

//retrieve history
router.get("/getHistory", async (req, res) => {
  try {
    // Retrieve 5 sessions with complete data
    const sessions = await SessionSchema.find({}, "-_id -__v").populate({
      path: "gameRecords",
      options: { sort: { rounds: -1 } },
      populate: {
        path: "players",
        model: "PlayerSchema",
        select: "-_id name numberOfWins numberOfLoss numberOfDraws position",
      },
      select: "-_id __v winner rounds gameId ",
    });

    const sessionsWithWinners = sessions.map((session: any) => {
      const gameRecordsWithWinners = session.gameRecords.map(
        (gameRecord: any) => {
          const winnerDetails: GetWinnerResponse = getWinner(
            gameRecord.players
          );
          return { ...gameRecord.toObject(), winnerDetails }; // Ensure toObject() is called on Mongoose documents
        }
      );

      return { ...session.toObject(), gameRecords: gameRecordsWithWinners };
    });
    res.status(200).json({ sessions: sessionsWithWinners });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sessions", error });
  }
});

export default router;
