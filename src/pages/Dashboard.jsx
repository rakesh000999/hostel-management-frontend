import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ClipboardList, Clock, CheckCircle2, XCircle, Users } from 'lucide-react';
import { getDashboardStats, getTotalStudentsCount } from '../api/dashboardApi';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalStudents: 0,
        totalStudentRequests: 0,
        pendingStudentRequests: 0,
        approvedStudentRequests: 0,
        rejectedStudentRequests: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError('');
                const [dashboardResult, totalStudentsResult] = await Promise.allSettled([
                    getDashboardStats(),
                    getTotalStudentsCount(),
                ]);

                const response = dashboardResult.status === 'fulfilled' ? dashboardResult.value : {};
                const totalStudents = totalStudentsResult.status === 'fulfilled' ? totalStudentsResult.value : 0;

                setStats({
                    totalStudents: Number(response?.totalStudents || totalStudents || 0),
                    totalStudentRequests: Number(response?.totalStudentRequests || 0),
                    pendingStudentRequests: Number(response?.pendingStudentRequests || 0),
                    approvedStudentRequests: Number(response?.approvedStudentRequests || 0),
                    rejectedStudentRequests: Number(response?.rejectedStudentRequests || 0)
                });
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const cards = [
        {
            title: 'Total Students',
            count: stats.totalStudents,
            icon: Users,
            color: 'bg-sky-600',
            action: () => navigate('/students')
        },
        {
            title: 'Total Student Requests',
            count: stats.totalStudentRequests,
            icon: ClipboardList,
            color: 'bg-blue-600',
            action: () => navigate('/pending-requests')
        },
        {
            title: 'Pending Student Requests',
            count: stats.pendingStudentRequests,
            icon: Clock,
            color: 'bg-amber-600',
            action: () => navigate('/pending-requests')
        },
        {
            title: 'Approved Student Requests',
            count: stats.approvedStudentRequests,
            icon: CheckCircle2,
            color: 'bg-emerald-600',
            action: () => navigate('/pending-requests')
        },
        {
            title: 'Rejected Student Requests',
            count: stats.rejectedStudentRequests,
            icon: XCircle,
            color: 'bg-red-600',
            action: () => navigate('/pending-requests')
        }
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
                <p className="text-gray-600 mt-2">Student request overview from live backend metrics.</p>
            </div>

            {error && (
                <div className="mb-6 p-3 rounded bg-red-100 text-red-700">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <button
                            type="button"
                            key={index}
                            onClick={card.action}
                            className="text-left bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">
                                        {loading ? '...' : card.count}
                                    </p>
                                </div>
                                <div className={`${card.color} p-4 rounded-lg`}>
                                    <Icon className="text-white" size={26} />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
