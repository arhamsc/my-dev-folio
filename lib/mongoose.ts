import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  try {
    if (!process.env.MONGODB_URL) throw new Error("No mongodb url in ENV");

    if (isConnected) return console.log("DB connected already");

    mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Mongodb is connected");
  } catch (e) {
    console.log(e);
  }
};
