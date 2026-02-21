
const supabase = require('../supabase');

exports.issueBook = async (req, res) => {
    try {
        const { user_id, book_id } = req.body;

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user_id)
            .eq('active', true)
            .single();

        if (userError || !user) return res.status(404).json({ error: 'User not found or inactive' });

        const { data: activeTransactions, error: countError } = await supabase
            .from('transactions')
            .select('id')
            .eq('user_id', user_id)
            .eq('status', 'issued');

        if (countError) throw countError;

        const limit = user.role === 'teacher' ? 5 : 2;
        if (activeTransactions.length >= limit) {
            return res.status(400).json({ error: `Borrowing limit reached (${limit} books)` });
        }

        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('*')
            .eq('id', book_id)
            .single();

        if (bookError || !book) return res.status(404).json({ error: 'Book not found' });
        if (book.available_copies <= 0) return res.status(400).json({ error: 'Book not available' });

        const { data: transaction, error: transError } = await supabase
            .from('transactions')
            .insert([{ user_id, book_id, status: 'issued' }])
            .select();

        if (transError) throw transError;

        const { error: updateError } = await supabase
            .from('books')
            .update({ available_copies: book.available_copies - 1 })
            .eq('id', book_id);

        if (updateError) throw updateError;

        res.status(201).json(transaction[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { book_id } = req.body;

        const { data: transaction, error: transError } = await supabase
            .from('transactions')
            .select('*, users!inner(*), books!inner(*)')
            .eq('book_id', book_id)
            .eq('status', 'issued')
            .order('issue_date', { ascending: false })
            .limit(1)
            .single();

        if (transError || !transaction) return res.status(404).json({ error: 'No active transaction found for this book' });

        const today = new Date();
        const dueDate = new Date(transaction.due_date);
        let fine = 0;

        if (today > dueDate) {
            const diffTime = Math.abs(today - dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fine = diffDays * 5;
        }

        const { data: updatedTrans, error: updateTransError } = await supabase
            .from('transactions')
            .update({
                return_date: today.toISOString().split('T')[0],
                fine_amount: fine,
                status: 'returned'
            })
            .eq('id', transaction.id)
            .select();

        if (updateTransError) throw updateTransError;

        const { error: updateBookError } = await supabase
            .from('books')
            .update({ available_copies: transaction.books.available_copies + 1 })
            .eq('id', book_id);

        if (updateBookError) throw updateBookError;

        res.json({ transaction: updatedTrans[0], fine });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const { data: totalBooks } = await supabase.from('books').select('total_copies');
        const { data: issuedBooks } = await supabase.from('transactions').select('id').eq('status', 'issued');

        const total = totalBooks.reduce((sum, b) => sum + b.total_copies, 0);

        const today = new Date().toISOString().split('T')[0];
        const { data: todayTransactions } = await supabase
            .from('transactions')
            .select('id')
            .filter('issue_date', 'eq', today);

        const { data: overdue } = await supabase
            .from('transactions')
            .select('id')
            .eq('status', 'issued')
            .lt('due_date', today);

        res.json({
            totalBooks: total,
            booksIssued: issuedBooks.length,
            overdueCount: overdue.length,
            todayTransactions: todayTransactions.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
