import Book, { Review } from "../models/book.model.js";
import mongoose from "mongoose";

export const getBooks = async (req, res) => {
  const { page = 1, author = "", genre = "", limit = 10, sortBy } = req.query;
  try {
    const options = {
      skip: parseInt(page, 10) - 1,
      limit: parseInt(limit, 10),
      sort: sortBy === "asc" ? { author: 1 } : { author: -1 },
    };

    const books = await Book.find({
      $and: [{ author: author }, { genre: genre }],
    })
      .limit(limit)
      .sort(options.sort);
    if (!books) {
      return res.status(404).json({ success: false, error: "No books found" });
    }

    return res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching Books", error);
  }
};

export const createBook = async (req, res) => {
  const { name, author, genre, reviews } = req.body;

  try {
    const averageRating = Math.abs(
      reviews.reduce(
        (acc, review) => (acc + Number(review.rating)) / reviews.length,
        0
      )
    );
    const newBook = new Book({
      name,
      author,
      genre,
      reviews,
      averageRating,
    });

    await newBook.save();

    return res
      .status(201)
      .json({ success: true, message: "Book created successfully." });
  } catch (error) {
    console.error("Error in creating book: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" + error.message });
  }
};

export const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findOne({ _id: id });
    if (!book) {
      return res
        .status(404)
        .json({ success: false, error: "No book found by id: ", id });
    }
    return res.status(200).send(book);
  } catch (error) {
    console.error("Error get book: ", error.message);
    if (error.message.includes("404")) {
      return res.status(404).json({ success: false, error: "No book found." });
    }
    return res.status(500).json({
      success: false,
      error: "Internal Server Error: " + error.message,
    });
  }
};

export const createReviewForBook = async (req, res) => {
  const { id } = req.params;
  const { review, rating } = req.body;

  try {
    const book = await Book.findOne({ _id: id });

    if (!book) {
      return res
        .status(404)
        .json({ success: false, error: "No Book found, please check the id" });
    }
    const currentUser = req.user;
    console.log(currentUser._id);
    const oldReview = book.reviews.filter(
      (review) => review.userId === currentUser._id
    );
    console.log(oldReview);
    if (oldReview && oldReview.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Review by user already exists",
      });
    }

    const newReview = new Review({
      review,
      rating,
      userId: currentUser._id,
    });
    book.reviews.push(newReview);
    book.save();
  } catch (error) {
    console.error("Error creating review for book", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error: " + error.message,
    });
  }
};

export const updateReviewById = async (req, res) => {
  const { id } = req.params;
  const { review, rating } = req.body;
  try {
    const book = await Book.findOne({ _id: id });
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    const currentUser = req.user;
    const newBook = await Book.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "reviews.$[elem].review": review,
          "reviews.$[elem].rating": rating,
        },
      },
      {
        arrayFilters: [{ "elem.userId": currentUser._id }],
      }
    );
    await newBook.save();
    const tempBook = await Book.findOne({ _id: id });
    if (!tempBook) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "review Updated successfully." });
  } catch (error) {
    console.error("Internal Server Error: ", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error: " + error.message,
    });
  }
};

export const deleteReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const currentUser = req.user;
    const book = await Book.findOneAndUpdate(
      { _id: id },
      { $pull: { "reviews.$[elem].userId": currentUser._id } },
      {
        arrayFilters: [{ "elem.userId": currentUser._id }],
      }
    );

    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error("Internal Server Error: ", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
