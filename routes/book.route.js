import express from "express";
import {
  getBooks,
  createBook,
  getBookById,
  createReviewForBook,
  updateReviewById,
  deleteReviewById,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/books", getBooks);
router.post("/books", createBook);
router.get("/books/:id", getBookById);
router.post("/books/:id/reviews", createReviewForBook);
router.put("/reviews/:id", updateReviewById);
router.delete("/reviews/:id", deleteReviewById);

export default router;
