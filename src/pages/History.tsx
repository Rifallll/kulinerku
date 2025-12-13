import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFoodHistory, ViewedFood } from '@/hooks/useFoodHistory';
import { OptimizedImage } from '@/components/OptimizedImage';
import { fixImageUrl } from '@/utils/fixImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash2, Search, Loader2, Info } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function History() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { fetchAllHistory, clearHistory } = useFoodHistory();
    const { toast } = useToast();

    const [history, setHistory] = useState<ViewedFood[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadHistory();
    }, [user, navigate]);

    const loadHistory = async () => {
        setLoading(true);
        const data = await fetchAllHistory(searchQuery);
        setHistory(data);
        setLoading(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadHistory();
    };

    const handleClearHistory = async () => {
        try {
            await clearHistory();
            setHistory([]);
            toast({
                title: "Riwayat Dihapus",
                description: "Semua riwayat penjelajahan Anda telah dibersihkan.",
            });
        } catch (error) {
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat menghapus riwayat.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link to="/dashboard">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h1 className="text-xl font-bold text-gray-900">Riwayat Makanan</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari makanan yang pernah dilihat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </form>

                    {history.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus Semua Riwayat
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus semua riwayat?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tindakan ini tidak dapat dibatalkan. Semua data riwayat penjelajahan makanan Anda akan dihapus permanen.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleClearHistory} className="bg-red-500 hover:bg-red-600 border-none text-white">
                                        Ya, Hapus Semua
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : history.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {history.map((item) => (
                            <Link
                                key={item.id}
                                to={`/food/${item.food_id}`}
                                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block h-full flex flex-col"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                    <OptimizedImage
                                        src={fixImageUrl(item.food_name, item.food_image)}
                                        alt={item.food_name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
                                        <Info className="h-3 w-3 mr-1" />
                                        Dilihat {item.view_count}x
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="text-xs text-gray-500 mb-1 flex justify-between">
                                        <span>{item.food_region || 'Indonesia'}</span>
                                        <span>{new Date(item.last_viewed_at).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {item.food_name}
                                    </h3>
                                    <p className="text-sm text-gray-500 capitalize">{item.food_category}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery ? "Tidak ditemukan" : "Belum ada riwayat"}
                        </h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            {searchQuery
                                ? `Tidak ada makanan yang cocok dengan "${searchQuery}" di riwayat Anda.`
                                : "Mulai jelajahi makanan nusantara untuk melihat riwayat perjalanan kuliner Anda di sini."}
                        </p>
                        {!searchQuery && (
                            <Button asChild>
                                <Link to="/map">Mulai Menjelajah</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
