import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'motion/react';
import { Search, Plus, Filter, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-600';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-600';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600';
      case 'REJECTED': return 'bg-red-50 text-red-600';
      case 'RETURNED': return 'bg-amber-50 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500">Manage and track your operational tasks.</p>
        </div>
        <button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
            />
          </div>
          <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-400 font-medium">Loading tasks...</td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-400 font-medium">No tasks found</td>
                </tr>
              ) : tasks.map((task: any) => (
                <tr key={task.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={`/tasks/${task.id}`} className="block">
                      <div className="font-bold text-gray-900">{task.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-medium truncate max-w-[200px]">{task.description || 'No description'}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-700">{task.createdBy?.name}</div>
                    <div className="text-xs text-gray-400">{task.createdBy?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/tasks/${task.id}`} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <ChevronRight size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
