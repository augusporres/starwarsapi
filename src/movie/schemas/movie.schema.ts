import { Schema } from "mongoose";

export const MovieSchema  = new Schema({
    title: String,
    episodeId: Number,
    director: String,
    releaseDate: Date
});