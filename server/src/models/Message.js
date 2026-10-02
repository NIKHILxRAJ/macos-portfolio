import mongoose from "mongoose";

// A message a visitor sends from the Contacts window.
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

// Saves messages to MongoDB; reports unavailable when the database isn't connected.
export function createMongoMessageStore() {
  return {
    available: () => mongoose.connection.readyState === 1,
    save: (doc) => Message.create(doc),
  };
}
