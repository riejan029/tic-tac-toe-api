import { Schema, model } from "mongoose";
import { v4 } from "uuid";

const playerSchema = new Schema({
  id: {
    type: String,
    default: v4,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  numberOfWins: {
    type: Number,
    default: 0,
  },
  numberOfLoss: {
    type: Number,
    default: 0,
  },
  numberOfDraws: {
    type: Number,
    default: 0,
  },
  position: {
    type: String,
    enum: ["p1", "p2"],
  },
  session: {
    type: Schema.Types.ObjectId,
    ref: "SessionSchema",
  },
});

const PlayerSchema = model("PlayerSchema", playerSchema);

export default PlayerSchema;
