import express from "express";
import { getBooks, createBook, getBookById } from "../controllers/book.controller.js";

const router = express.Router();

router.get("/books", getBooks);
router.post("/books", createBook);
router.get("/books/:id", getBookById);

export default router;
