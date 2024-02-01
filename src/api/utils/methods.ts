/* eslint-disable @typescript-eslint/comma-dangle */
import { Document } from "mongoose";

export interface PlayerType extends Document {
  name: string;
  numberOfWins: number;
  numberOfLoss: number;
  numberOfDraws: number;
  position: string;
}

export const updatePlayerStats = async (
  players: PlayerType[],
  winner: string
): Promise<void> => {
  if (winner === "p1" || winner === "p2") {
    const winningPlayer = players.find((player) => player.position === winner);
    const losingPlayers = players.filter(
      (player) => player.position !== winner
    );

    if (winningPlayer) {
      winningPlayer.numberOfWins += 1;
      await winningPlayer.save();
    }

    for (const losingPlayer of losingPlayers) {
      losingPlayer.numberOfLoss += 1;
      await losingPlayer.save();
    }
  } else {
    // It's a draw, update numberOfDraws for all players
    for (const player of players) {
      player.numberOfDraws += 1;
      await player.save();
    }
  }
};

export interface GetWinnerResponse {
  player1: string;
  player2: string;
  winner: string;
}

export const getWinner = (players: PlayerType[]): GetWinnerResponse => {
  const output: GetWinnerResponse = { player1: "", player2: "", winner: "" };
  const p1 = players[0];
  const p2 = players[1];

  if (p1.numberOfWins > p2.numberOfWins) {
    output.winner = p1.name;
  }
  if (p1.numberOfWins < p2.numberOfWins) {
    output.winner = p2.name;
  }
  if (p1.numberOfWins === p2.numberOfWins) {
    output.winner = "Draw";
  }
  return { ...output, player1: p1.name, player2: p2.name };
};
