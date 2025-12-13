import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Search, MoreHorizontal, Shield, UserX, UserCheck, User, Users, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
    id: string;
    email: string;
    role: 'admin' | 'member';
    is_banned: boolean;
    created_at: string;
}

export default function UserManager() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'member'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId: string, newRole: 'admin' | 'member') => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;
            toast.success(`User role updated to ${newRole}`);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role');
        }
    };

    const handleBanStatus = async (userId: string, isBanned: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_banned: isBanned })
                .eq('id', userId);

            if (error) throw error;
            toast.success(isBanned ? 'User banned successfully' : 'User unbanned successfully');
            setUsers(users.map(u => u.id === userId ? { ...u, is_banned: isBanned } : u));
        } catch (error) {
            console.error('Error updating ban status:', error);
            toast.error('Failed to update ban status');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all'
            ? true
            : statusFilter === 'banned' ? user.is_banned : !user.is_banned;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getInitials = (email: string) => {
        return email.substring(0, 2).toUpperCase();
    };

    // Stats Calculations
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const bannedCount = users.filter(u => u.is_banned).length;
    // Users in last 24h
    const newUsersCount = users.filter(u => {
        const date = new Date(u.created_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 1;
    }).length;


    const StatCard = ({ title, value, icon: Icon, description, colorClass }: any) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${colorClass}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-2">Manage your team members and control access.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={totalUsers}
                    icon={Users}
                    colorClass="text-blue-600"
                    description="All registered accounts"
                />
                <StatCard
                    title="Admins"
                    value={adminCount}
                    icon={Shield}
                    colorClass="text-purple-600"
                    description="Users with full access"
                />
                <StatCard
                    title="New (24h)"
                    value={newUsersCount}
                    icon={UserPlus}
                    colorClass="text-green-600"
                    description="Joined recently"
                />
                <StatCard
                    title="Banned"
                    value={bannedCount}
                    icon={AlertCircle}
                    colorClass="text-red-600"
                    description="Restricted accounts"
                />
            </div>

            <Card className="border-t-4 border-t-blue-600 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div>
                            <CardTitle>User Directory</CardTitle>
                            <CardDescription>
                                A list of all users including their name, role, and access status.
                            </CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by email..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={(val: any) => setRoleFilter(val)}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="banned">Banned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-[300px]">User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <UserX className="h-8 w-8 text-gray-300" />
                                                    <p>No users found matching your filters.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt={user.email} />
                                                            <AvatarFallback className="text-xs text-blue-700 font-bold">
                                                                {getInitials(user.email)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm text-gray-900">
                                                                {user.email}
                                                                {user.id === currentUser?.id && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">YOU</span>}
                                                            </span>
                                                            <span className="text-xs text-gray-500 font-mono truncate max-w-[150px]">
                                                                ID: {user.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                                                        className={user.role === 'admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'}
                                                    >
                                                        {user.role === 'admin' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                                                        {user.role.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`h-2.5 w-2.5 rounded-full ${user.is_banned ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                                        <span className={`text-sm font-medium ${user.is_banned ? 'text-red-600' : 'text-green-700'}`}>
                                                            {user.is_banned ? 'Banned' : 'Active'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="text-sm text-gray-500 cursor-help border-b border-dotted border-gray-300">
                                                                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{format(new Date(user.created_at), 'PPP pp')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />

                                                            {user.role === 'member' ? (
                                                                <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'admin')} className="text-purple-600 focus:text-purple-700 focus:bg-purple-50">
                                                                    <Shield className="mr-2 h-4 w-4" /> Make Admin
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'member')} className="text-gray-600 focus:text-gray-700 focus:bg-gray-50">
                                                                    <User className="mr-2 h-4 w-4" /> Demote Member
                                                                </DropdownMenuItem>
                                                            )}

                                                            <DropdownMenuSeparator />

                                                            {user.is_banned ? (
                                                                <DropdownMenuItem onClick={() => handleBanStatus(user.id, false)} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                                                                    <UserCheck className="mr-2 h-4 w-4" /> Unban Access
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem onClick={() => handleBanStatus(user.id, true)} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                                                    <UserX className="mr-2 h-4 w-4" /> Ban Access
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
