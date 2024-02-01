import express from "express";

const router = express.Router();

interface GameListResponse {
  gameId: string;
  playerName: string;
}

interface GameSessionParams {
  gameId: string;
}

interface GameSessionResponse {
  winner: string;
  loser: string;
  isDraw: boolean;
  round: number;
}

interface RoundData {
  roundId: string;
  data: RoundObject[];
}

interface RoundObject {
  winner: string;
  isDraw: boolean;
  roundNo: number;
}

interface CreateSessionParams {
  player1: string;
  player2: string;
}

//Get List of 5 latest games
router.get<{}, GameListResponse[]>("/", (req, res) => {
  res.json([{ gameId: "test", playerName: "test" }]);
});

//Get session game
router.get<GameSessionParams, GameSessionResponse[]>(
  "/session",
  (req, res) => {}
);

//add data after round end
router.post<GameSessionResponse & { gameId: string }, { code: number }>(
  "/addRoundResult",
  (req, res) => {}
);

//Add session result after the game
router.post<RoundData, { code: number }>("/addSessionResult", (req, res) => {});

//Create session of the game
router.post<CreateSessionParams, { code: number; gameId: string }>(
  "/addSession",
  (req, res) => {}
);

export default router;
