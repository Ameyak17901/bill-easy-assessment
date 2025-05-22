import Book from "../models/book.model.js";

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
    const newBook = new Book({
      name,
      author,
      genre,
      reviews,
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
