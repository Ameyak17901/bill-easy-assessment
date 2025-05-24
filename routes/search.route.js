import express from 'express';
import { searchBook } from '../controllers/search.controller.js';

const router = express.Router();


router.get("/search", searchBook);

export default router;