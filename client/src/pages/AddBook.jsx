
import React, { useState } from 'react';
import { bookService } from '../services/api';
import { Upload, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const AddBook = () => {
    const [activeTab, setActiveTab] = useState('quick');
    const [showMore, setShowMore] = useState(false);
    const [formData, setFormData] = useState({ title: '', total_copies: 1, isbn: '', rack_location: '' });
    const [message, setMessage] = useState('');

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        try {
            await bookService.add(formData);
            setMessage('✅ Book added successfully!');
            setFormData({ title: '', total_copies: 1, isbn: '', rack_location: '' });
        } catch (error) {
            setMessage('❌ Failed to add book.');
        }
    };

    const handleBulkUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target.result;
                const lines = text.split('\n');
                const books = lines.slice(1).filter(l => l.trim()).map(line => {
                    const values = line.split(',');
                    return {
                        title: values[0]?.trim(),
                        isbn: values[1]?.trim(),
                        total_copies: parseInt(values[2]) || 1,
                        rack_location: values[3]?.trim() || ''
                    };
                }).filter(b => b.title);

                try {
                    setMessage(`📈 Uploading ${books.length} books...`);
                    await bookService.bulkUpload(books);
                    setMessage(`✅ Successfully uploaded ${books.length} books!`);
                } catch (error) {
                    setMessage('❌ Bulk upload failed: ' + (error.response?.data?.error || error.message));
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <header>
                <h1 className="text-4xl font-extrabold text-gray-900">Add New Books</h1>
                <p className="text-gray-500 mt-2 text-lg">Add books manually or via CSV bulk upload.</p>
            </header>

            <div className="flex space-x-2 bg-gray-100 p-2 rounded-2xl w-fit">
                <button onClick={() => setActiveTab('quick')} className={`px-8 py-3 rounded-xl font-bold transition ${activeTab === 'quick' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Quick Add</button>
                <button onClick={() => setActiveTab('bulk')} className={`px-8 py-3 rounded-xl font-bold transition ${activeTab === 'bulk' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Bulk Upload</button>
            </div>

            {activeTab === 'quick' ? (
                <form onSubmit={handleQuickAdd} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-lg font-bold text-gray-700">Book Title *</label>
                            <input type="text" required className="w-full p-5 bg-gray-50 border-none rounded-2xl text-xl" placeholder="e.g. The Great Gatsby" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="space-y-3">
                            <label className="text-lg font-bold text-gray-700">Number of Copies *</label>
                            <input type="number" required min="1" className="w-full p-5 bg-gray-50 border-none rounded-2xl text-xl" value={formData.total_copies} onChange={(e) => setFormData({ ...formData, total_copies: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-lg font-bold text-gray-700">ISBN (Optional)</label>
                        <input type="text" className="w-full p-5 bg-gray-50 border-none rounded-2xl text-xl" placeholder="e.g. 9780743273565" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />
                    </div>
                    <button type="button" onClick={() => setShowMore(!showMore)} className="flex items-center text-indigo-600 font-bold hover:underline">
                        {showMore ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />} More Options
                    </button>
                    {showMore && (
                        <div className="p-8 bg-gray-50 rounded-2xl space-y-3">
                            <label className="text-lg font-bold text-gray-700">Rack Location</label>
                            <input type="text" className="w-full p-5 bg-white border-gray-200 border rounded-2xl text-xl" placeholder="e.g. A-15" value={formData.rack_location} onChange={(e) => setFormData({ ...formData, rack_location: e.target.value })} />
                        </div>
                    )}
                    {message && <p className={`p-4 rounded-xl font-medium ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</p>}
                    <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Save Book</button>
                </form>
            ) : (
                <div className="bg-white p-20 rounded-3xl border-4 border-dashed border-gray-100 text-center space-y-6">
                    <div className="mx-auto w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <Upload size={48} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900">Drop CSV file here</h3>
                        <p className="text-gray-500 mt-2 text-xl">Or click to browse your computer</p>
                    </div>
                    <input type="file" accept=".csv" onChange={handleBulkUpload} className="hidden" id="csv-upload" />
                    <label htmlFor="csv-upload" className="inline-block px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl cursor-pointer hover:bg-indigo-700">Select CSV File</label>
                    {message && <p className="text-lg font-bold text-indigo-600">{message}</p>}
                </div>
            )}
        </div>
    );
};

export default AddBook;
