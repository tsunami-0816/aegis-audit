import { LayoutDashboard, FileText, ClipboardList, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/classNames';

export const Sidebar = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: '仪表盘', showForAdmin: true, showForUser: true },
    { path: '/submit', icon: FileText, label: '提交内容', showForAdmin: false, showForUser: true },
    { path: '/workorders', icon: ClipboardList, label: '审核工单', showForAdmin: true, showForUser: false },
    { path: '/profile', icon: User, label: '个人中心', showForAdmin: true, showForUser: true },
  ];

  const filteredItems = navItems.filter(item => isAdmin ? item.showForAdmin : item.showForUser);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-gray-50">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h1 className="text-xl font-bold text-white">AegisAudit</h1>
      </div>
      
      <nav className="space-y-1 p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.role === 'ADMIN' ? '管理员' : '普通用户'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
};
