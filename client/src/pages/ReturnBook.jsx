
import React, { useState } from 'react';
import { transactionService } from '../services/api';
import { Search, RotateCcw, DollarSign, AlertCircle } from 'lucide-react';

const ReturnBook = () => {
    const [bookId, setBookId] = useState('');
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReturn = async (e) => {
        e.preventDefault();
        if (!bookId) return;
        setLoading(true);
        try {
            const response = await transactionService.return({ book_id: bookId });
            setResult(response.data);
            setMessage('✅ Book returned successfully!');
            setBookId('');
        } catch (error) {
            setResult(null);
            setMessage(`❌ ${error.response?.data?.error || 'Failed to process return.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <header>
                <h1 className="text-4xl font-extrabold text-gray-900">Return a Book</h1>
                <p className="text-gray-500 mt-2 text-lg">Calculate fines and restock books instantly.</p>
            </header>
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-10">
                <form onSubmit={handleReturn} className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    <input type="text" className="w-full p-8 pl-16 bg-gray-50 border-none rounded-3xl text-2xl" placeholder="Scan or enter Book ID to return" value={bookId} onChange={(e) => setBookId(e.target.value)} />
                    <button type="submit" disabled={!bookId || loading} className="absolute right-4 top-1/2 -translate-y-1/2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 disabled:bg-gray-200">{loading ? 'Checking...' : 'Detect'}</button>
                </form>
                {result && (
                    <div className="space-y-8">
                        <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="w-20 h-20 bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center"><RotateCcw size={40} /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-emerald-900">Return Processed</h3>
                                    <p className="text-emerald-700 font-bold text-lg">{result.transaction.books.title}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-emerald-600 font-bold">Issued by</p>
                                <p className="text-xl font-black text-emerald-900">{result.transaction.users.name}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className={`p-8 rounded-3xl border ${result.fine > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <DollarSign className={result.fine > 0 ? 'text-red-600' : 'text-green-600'} />
                                    <h4 className="text-xl font-bold">Fine Amount</h4>
                                </div>
                                <p className={`text-5xl font-black ${result.fine > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{result.fine}</p>
                                {result.fine > 0 && <p className="mt-2 text-red-700 font-medium">Overdue by {Math.ceil(result.fine / 5)} days</p>}
                            </div>
                            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col justify-center">
                                <button className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-xl hover:bg-gray-100 transition">Admin Override Fine</button>
                            </div>
                        </div>
                    </div>
                )}
                {message && !result && <p className="p-8 rounded-3xl font-bold text-center text-xl bg-red-50 text-red-700">{message}</p>}
                {!result && (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <AlertCircle size={80} className="mx-auto text-gray-400" />
                        <p className="text-2xl font-bold text-gray-400">Waiting for Book ID...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReturnBook;
