import { Schema, model } from "mongoose";
import { v4 } from "uuid";

const sessionSchema = new Schema({
  sessionId: {
    type: String,
    default: v4,
    unique: true,
    required: true,
  },
  players: [{ type: Schema.Types.ObjectId, ref: "PlayerSchema" }],
  gameRecords: [{ type: Schema.Types.ObjectId, ref: "GamerRecordSchema" }],
});

const SessionSchema = model("SessionSchema", sessionSchema);

export default SessionSchema;
