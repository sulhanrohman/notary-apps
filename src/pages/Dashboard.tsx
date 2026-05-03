import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'motion/react';
import { Copy, Clock, CheckCircle2, AlertCircle, ExternalLink, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    attention: 0,
  });

  useEffect(() => {
    api.get('/tasks').then(res => {
      const data = res.data;
      setTasks(data);
      setStats({
        total: data.length,
        pending: data.filter((t: any) => t.status === 'SUBMITTED' || t.status === 'RETURNED').length,
        completed: data.filter((t: any) => t.status === 'APPROVED').length,
        attention: data.filter((t: any) => t.status === 'REJECTED').length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Tasks', value: stats.total, icon: Copy, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Attention Needed', value: stats.attention, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-7 rounded-[22px] border border-slate-100 shadow-sm flex items-start justify-between"
          >
            <div>
              <div className="text-[13px] font-bold text-slate-400 uppercase tracking-wide mb-2">{card.label}</div>
              <div className="text-3xl font-extrabold text-slate-800">{card.value}</div>
            </div>
            <div className={`${card.bg} ${card.color} p-2.5 rounded-xl`}>
              <card.icon size={22} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task Queue Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Active Task Queue</h3>
          <span className="text-xs font-bold text-slate-400 uppercase">{tasks.length} Total</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tasks.slice(0, 4).map((task: any, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-white p-7 rounded-[22px] border border-slate-100 shadow-sm flex flex-col group hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  task.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                  task.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-600' :
                  task.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {task.status === 'SUBMITTED' ? 'READY FOR REVIEW' : task.status}
                </span>
                <div className="text-right">
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Due Date</div>
                  <div className="text-[11px] font-bold text-slate-800">May 5, 2026</div>
                </div>
              </div>

              <div className="flex-1 mb-6">
                <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">
                  {task.description || 'No description provided for this operational task.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold ring-2 ring-white">
                    {task.createdBy?.name?.[0] || 'U'}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{task.createdBy?.name || 'Unknown Agent'}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                    <ExternalLink size={18} />
                  </button>
                  <Link 
                    to={`/tasks/${task.id}`}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {tasks.length === 0 && (
            <div className="lg:col-span-2 py-20 text-center bg-white rounded-[22px] border border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No active tasks in queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
