
import React, { useEffect, useState } from 'react';
import { transactionService } from '../services/api';
import { Book, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-xl ${color} bg-opacity-10`}>
            <Icon size={32} />
        </div>
        <div>
            <p className="text-gray-500 font-medium text-lg">{title}</p>
            <h3 className="text-4xl font-bold mt-1">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        booksIssued: 0,
        overdueCount: 0,
        todayTransactions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await transactionService.getStats();
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center text-xl">Loading Dashboard...</div>;

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-extrabold text-gray-900">Library Summary</h1>
                <p className="text-gray-500 mt-2 text-lg">Quick overview of school library operations.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total Books" value={stats.totalBooks} icon={Book} color="bg-blue-500" />
                <StatCard title="Books Issued" value={stats.booksIssued} icon={CheckCircle} color="bg-green-500" />
                <StatCard title="Overdue Count" value={stats.overdueCount} icon={AlertTriangle} color="bg-red-500" />
                <StatCard title="Today's Transactions" value={stats.todayTransactions} icon={RefreshCw} color="bg-purple-500" />
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Today's Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition">Issue New Book</button>
                    <button className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition">Return a Book</button>
                    <button className="px-8 py-4 bg-gray-100 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-200 transition">Add Books</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
