import Book from "../models/book.model.js";

export const searchBook = async (req, res) => {
  const { author, title } = req.query;
  try {
    if (author) {
      const result = await Book.find({
        author: { $regex: author, $options: "i" },
      });

      if (!result || result.length === 0) {
        return res.status(404).json({ success: false, error: "No book found" });
      }

      return res.status(200).json({ success: true, data: result });
    } else if (title) {
      const result = await Book.find({
        title: { $regex: title, $options: "i" },
      });
      if (!result || result.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "No book found." });
      }

      return res.status(200).json({ success: true, data: result });
    }
  } catch (error) {
    console.error("Error while searching book: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" + error.message });
  }
};
