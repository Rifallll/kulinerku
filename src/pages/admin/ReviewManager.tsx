import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Search, Star, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Review {
    id: string;
    user_id: string;
    food_id: string;
    food_name: string;
    rating: number;
    review_text?: string;
    user_email?: string;
    user_name?: string;
    created_at: string;
}

export default function ReviewManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState<string>('all');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('food_reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('food_reviews')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Review deleted successfully');
            setReviews(reviews.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.food_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.review_text?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;

        return matchesSearch && matchesRating;
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Review Manager</h1>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            All Reviews ({filteredReviews.length})
                        </CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search food, user, or text..."
                                    className="pl-9 w-[250px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={ratingFilter} onValueChange={setRatingFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Filter Rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Ratings</SelectItem>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="1">1 Star</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Food Item</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead className="w-[40%]">Review</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReviews.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                No reviews found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredReviews.map((review) => (
                                            <TableRow key={review.id}>
                                                <TableCell className="whitespace-nowrap text-xs text-gray-500">
                                                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {review.food_name || 'Unknown Food'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{review.user_name || 'Anonymous'}</span>
                                                        <span className="text-xs text-gray-400">{review.user_email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={review.rating >= 4 ? 'default' : review.rating >= 3 ? 'secondary' : 'destructive'} className="gap-1">
                                                        {review.rating} <Star className="h-3 w-3 fill-current" />
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm text-gray-600 line-clamp-2" title={review.review_text}>
                                                        {review.review_text || <span className="italic text-gray-400">No text provided</span>}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(review.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
