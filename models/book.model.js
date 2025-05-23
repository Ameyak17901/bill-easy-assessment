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
  rating: {
    type: Number,
    default: 0,
    min: [1, "Rating must be atleast 1"],
    max: [5, "Rating cannot exceed 5"],
  },
});

export const Review = mongoose.model("Review", reviewSchema);

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
  reviews: [{ type: reviewSchema, ref: "Review" }],
  averageRating: {
    type: Number,
    default: 0,
  },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
