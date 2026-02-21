
const supabase = require('../supabase');

exports.getAllBooks = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addBook = async (req, res) => {
    try {
        const { title, isbn, total_copies, rack_location } = req.body;

        if (!title || !total_copies) {
            return res.status(400).json({ error: 'Title and total copies are required' });
        }

        const { data, error } = await supabase
            .from('books')
            .insert([{
                title,
                isbn,
                total_copies: parseInt(total_copies),
                available_copies: parseInt(total_copies),
                rack_location
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bulkUpload = async (req, res) => {
    try {
        const books = req.body;

        if (!Array.isArray(books)) {
            return res.status(400).json({ error: 'Expected an array of books' });
        }

        const formattedBooks = books.map(book => ({
            title: book.title,
            isbn: book.isbn,
            total_copies: parseInt(book.total_copies) || 1,
            available_copies: parseInt(book.total_copies) || 1,
            rack_location: book.rack_location
        }));

        const { data, error } = await supabase
            .from('books')
            .insert(formattedBooks)
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const { data, error } = await supabase
            .from('books')
            .select('*')
            .or(`isbn.eq.${query},title.ilike.%${query}%`);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
