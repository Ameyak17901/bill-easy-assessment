import express from "express";
import {
  getBooks,
  createBook,
  getBookById,
  createReviewForBook,
  updateReviewById,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/books", getBooks);
router.post("/books", createBook);
router.get("/books/:id", getBookById);
router.post("/books/:id/reviews", createReviewForBook);
router.put("/reviews/:id", updateReviewById);

export default router;
