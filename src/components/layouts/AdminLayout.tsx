import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Database,
    MapPin,
    Utensils,
    Activity,
    LogOut,
    Menu,
    MessageSquare,
    User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const { signOut } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-10`}
            >
                <div className="p-4 flex items-center justify-between border-b border-slate-700">
                    {isSidebarOpen && <h1 className="font-bold text-xl text-yellow-500">AdminPanel</h1>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-700 rounded">
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${isActive('/admin/dashboard') ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        >
                            <LayoutDashboard className="mr-2" size={20} />
                            {isSidebarOpen && "Dashboard"}
                        </Button>
                    </Link>

                    <Link to="/admin/foods">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${isActive('/admin/foods') ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        >
                            <Utensils className="mr-2" size={20} />
                            {isSidebarOpen && "Food Manager"}
                        </Button>
                    </Link>

                    <Link to="/admin/reviews">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${isActive('/admin/reviews') ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        >
                            <MessageSquare className="mr-2" size={20} />
                            {isSidebarOpen && "Reviews"}
                        </Button>
                    </Link>

                    <Link to="/admin/users">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${isActive('/admin/users') ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        >
                            <UserIcon className="mr-2" size={20} />
                            {isSidebarOpen && "Users"}
                        </Button>
                    </Link>

                    <Link to="/update-origins">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${isActive('/update-origins') ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        >
                            <MapPin className="mr-2" size={20} />
                            {isSidebarOpen && "Origin Updater"}
                        </Button>
                    </Link>

                    <Link to="/consolidate-provinces">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${isActive('/consolidate-provinces') ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        >
                            <Activity className="mr-2" size={20} />
                            {isSidebarOpen && "Consolidator"}
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <Button variant="destructive" className="w-full justify-start" onClick={() => signOut()}>
                        <LogOut className="mr-2" size={20} />
                        {isSidebarOpen && "Logout"}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 transition-all duration-300`}>
                {children}
            </main>
        </div>
    );
};
