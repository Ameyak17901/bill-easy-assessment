import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  review: {
    type: String,
    required: true,
  },
});

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
