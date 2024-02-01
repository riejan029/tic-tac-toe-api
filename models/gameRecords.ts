import { Schema, model } from "mongoose";
import { v4 } from "uuid";

const gameRecordSchema = new Schema({
  gameId: {
    type: String,
    default: v4,
    required: true,
  },
  winner: {
    type: String,
    required: true,
  },
  rounds: {
    type: Number,
    default: 0,
  },
  players: [{ type: Schema.Types.ObjectId, ref: "PlayerSchema" }],
});

const GamerRecordSchema = model("GamerRecordSchema", gameRecordSchema);

export default GamerRecordSchema;
