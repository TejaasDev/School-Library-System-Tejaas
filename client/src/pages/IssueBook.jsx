
import React, { useState } from 'react';
import { transactionService, userService, bookService } from '../services/api';
import { Search, User, Book as BookIcon, Calendar } from 'lucide-react';

const IssueBook = () => {
    const [studentId, setStudentId] = useState('');
    const [bookId, setBookId] = useState('');
    const [student, setStudent] = useState(null);
    const [book, setBook] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchStudent = async () => {
        if (!studentId) return;
        try {
            const response = await userService.getById(studentId);
            setStudent(response.data);
        } catch (error) {
            setStudent(null);
            setMessage('❌ Student not found.');
        }
    };

    const fetchBook = async () => {
        if (!bookId) return;
        try {
            const response = await bookService.search(bookId);
            const found = response.data[0];
            setBook(found || null);
            if (!found) setMessage('❌ Book not found.');
        } catch (error) {
            setMessage('❌ Error searching for book.');
        }
    };

    const handleIssue = async () => {
        if (!student || !book) return;
        setLoading(true);
        try {
            await transactionService.issue({ user_id: student.id, book_id: book.id });
            setMessage('✅ Book issued successfully! Due in 14 days.');
            setStudentId(''); setBookId(''); setStudent(null); setBook(null);
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.error || 'Failed to issue book.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <header>
                <h1 className="text-4xl font-extrabold text-gray-900">Issue a Book</h1>
                <p className="text-gray-500 mt-2 text-lg">Scan or enter IDs to lend a book.</p>
            </header>
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-12">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">1</div>
                        <h2 className="text-2xl font-bold text-gray-800">Assign to Student</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input type="text" className="w-full p-6 pl-16 bg-gray-50 border-none rounded-2xl text-xl" placeholder="Enter or Scan Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} onBlur={fetchStudent} />
                    </div>
                    {student && (
                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center space-x-6">
                            <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center text-blue-700"><User size={32} /></div>
                            <div>
                                <h4 className="text-xl font-bold text-blue-900">{student.name}</h4>
                                <p className="text-blue-700 opacity-80">{student.class_section} • {student.role}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold text-xl">2</div>
                        <h2 className="text-2xl font-bold text-gray-800">Select Book</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input type="text" className="w-full p-6 pl-16 bg-gray-50 border-none rounded-2xl text-xl" placeholder="Enter or Scan Book ID / ISBN" value={bookId} onChange={(e) => setBookId(e.target.value)} onBlur={fetchBook} />
                    </div>
                    {book && (
                        <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex items-center space-x-6">
                            <div className="w-16 h-16 bg-purple-200 rounded-2xl flex items-center justify-center text-purple-700"><BookIcon size={32} /></div>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-purple-900">{book.title}</h4>
                                <p className="text-purple-700 opacity-80">RACK: {book.rack_location} • Available: {book.available_copies}</p>
                            </div>
                            <div className="flex items-center text-purple-900 font-bold bg-white px-4 py-2 rounded-xl"><Calendar size={18} className="mr-2" />Due in 14 days</div>
                        </div>
                    )}
                </div>
                {message && <p className={`p-6 rounded-2xl font-bold text-center text-xl ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</p>}
                <button onClick={handleIssue} disabled={!student || !book || loading} className={`w-full py-8 rounded-3xl font-black text-3xl shadow-xl transition ${!student || !book ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                    {loading ? 'Processing...' : 'Confirm Issuance'}
                </button>
            </div>
        </div>
    );
};

export default IssueBook;
