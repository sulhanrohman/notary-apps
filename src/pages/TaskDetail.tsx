import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'motion/react';
import { ArrowLeft, Check, X, RotateCcw, Send, Calendar, User, FileText, Activity } from 'lucide-react';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionComment, setActionComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      // Note: Backend findAll filters by tenant, but we should have a getOne endpoint
      // For now I'll just find it in the list
      const res = await api.get('/tasks');
      const found = res.data.find((t: any) => t.id === id);
      setTask(found);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const performAction = async (action: string) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/tasks/${id}/action`, { action, comment: actionComment });
      setActionComment('');
      fetchTask();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading task details...</div>;
  if (!task) return <div className="text-center py-20 text-gray-400">Task not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/tasks')}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-medium"
      >
        <ArrowLeft size={18} />
        <span>Back to Tasks</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <FileText size={120} />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Task Details</span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-400 font-medium">{task.id}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{task.title}</h1>
          <p className="text-gray-500 max-w-xl text-lg leading-relaxed">{task.description || 'No description provided.'}</p>
          
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <User size={14} />
              </div>
              <div>
                <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Assigned to</div>
                <div className="text-gray-900 font-bold">{task.assignedTo?.name || 'Unassigned'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <Calendar size={14} />
              </div>
              <div>
                <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Created on</div>
                <div className="text-gray-900 font-bold">{new Date(task.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:text-right relative z-10 flex flex-col md:items-end gap-3">
          <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Status</div>
          <div className={`inline-flex px-4 py-2 rounded-2xl text-sm font-extrabold uppercase tracking-tight ${
            task.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 
            task.status === 'REJECTED' ? 'bg-red-500 text-white' :
            task.status === 'SUBMITTED' ? 'bg-blue-600 text-white' :
            'bg-gray-200 text-gray-700'
          }`}>
            {task.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Actions */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" />
              Actions
            </h2>
            
            <textarea
              placeholder="Add a comment for your action..."
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500/10 transition-all font-medium min-h-[100px]"
              value={actionComment}
              onChange={(e) => setActionComment(e.target.value)}
            ></textarea>

            <div className="flex flex-wrap gap-3">
              {task.status === 'DRAFT' && (
                <button
                  disabled={isSubmitting}
                  onClick={() => performAction('SUBMIT')}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10"
                >
                  <Send size={18} />
                  Submit Task
                </button>
              )}

              {task.status === 'SUBMITTED' && (
                <>
                  <button
                    disabled={isSubmitting}
                    onClick={() => performAction('APPROVE')}
                    className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
                  >
                    <Check size={18} />
                    Approve
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => performAction('REJECT')}
                    className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-500/10"
                  >
                    <X size={18} />
                    Reject
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => performAction('RETURN')}
                    className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10"
                  >
                    <RotateCcw size={18} />
                    Return
                  </button>
                </>
              )}
            </div>
            
            {['APPROVED', 'REJECTED', 'RETURNED'].includes(task.status) && (
              <p className="text-center text-gray-400 text-sm font-medium italic">
                No further actions available for this task status.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Task Info</div>
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-gray-400 font-medium">Bank Name</span>
                  <span className="text-sm text-gray-900 font-bold">{task.bankName || '-'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-gray-400 font-medium">Case Type</span>
                  <span className="text-sm text-gray-900 font-bold">{task.caseType || '-'}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
