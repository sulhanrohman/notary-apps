import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, LogOut, User, Bell, Search, Filter, Plus, Languages, CheckSquare, Users, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  onLogout: () => void;
}

export default function Layout({ onLogout }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: ClipboardList },
    { path: '/approvals', label: 'Approvals', icon: CheckSquare },
    { path: '/team', label: 'Team', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a3a8a] text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-inner">
            <div className="w-5 h-5 border-2 border-white rounded-md flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">NotaryFlow</h1>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white/15 text-white shadow-lg' 
                    : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 shrink-0">
              <span className="font-bold text-sm">B</span>
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold truncate">Banking Agent Sarah</div>
              <div className="text-[11px] text-blue-200/60 font-medium">Member</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-blue-100/70 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Operational Dashboard</h2>
          
          <div className="flex items-center gap-6">
             <div className="bg-slate-100 rounded-lg flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors">
                <Languages size={18} className="text-slate-500" />
                <span className="text-[13px] font-bold text-slate-700 uppercase">En-Us</span>
             </div>
             
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-slate-100 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                />
             </div>

             <div className="flex items-center gap-4">
               <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
               </button>
               <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                  <Filter size={20} />
               </button>
             </div>

             <button className="bg-[#2563eb] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] font-bold text-sm shadow-md shadow-blue-500/20">
                <Plus size={18} />
                <span>Assign Task</span>
             </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-[1400px] mx-auto p-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
