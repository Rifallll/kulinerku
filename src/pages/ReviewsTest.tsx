import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/hooks/useReviews';
import { RatingDisplay } from '@/components/RatingDisplay';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewsList } from '@/components/ReviewsList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ReviewsTest() {
    const [foodId] = useState('rendang'); // Test with Rendang
    const foodName = 'Rendang';

    const { user } = useAuth();
    const { toast } = useToast();
    const { stats, addReview, getUserReview } = useReviews(foodId);
    const [userReview, setUserReview] = React.useState<any>(null);

    // Fetch user's existing review
    React.useEffect(() => {
        if (user && foodId) {
            getUserReview(foodId).then(setUserReview);
        }
    }, [user, foodId, getUserReview]);

    const handleSubmitReview = async (rating: number, reviewText: string) => {
        try {
            await addReview({
                food_id: foodId,
                food_name: foodName,
                rating,
                review_text: reviewText
            });
            const updated = await getUserReview(foodId);
            setUserReview(updated);
            toast({
                title: "Review Submitted! ✅",
                description: "Thank you for your review!",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to submit review",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/" className="text-sm text-gray-600 hover:text-primary inline-flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Page Title */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
                    <h1 className="text-4xl font-bold mb-2">🧪 Reviews System Test</h1>
                    <p className="text-blue-100">Testing Rating & Reviews for: <strong>{foodName}</strong></p>
                    <p className="text-sm mt-2 text-blue-200">
                        {user ? `✅ Logged in as: ${user.email}` : '❌ Not logged in'}
                    </p>
                </div>

                {/* Rating Display Test */}
                <div className="bg-white rounded-lg border p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">1. Rating Display Component</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Size: Small</p>
                            <RatingDisplay
                                averageRating={stats.averageRating}
                                totalReviews={stats.totalReviews}
                                size="sm"
                                showCount={true}
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Size: Medium</p>
                            <RatingDisplay
                                averageRating={stats.averageRating}
                                totalReviews={stats.totalReviews}
                                size="md"
                                showCount={true}
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Size: Large</p>
                            <RatingDisplay
                                averageRating={stats.averageRating}
                                totalReviews={stats.totalReviews}
                                size="lg"
                                showCount={true}
                            />
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm font-mono">
                            Average: {stats.averageRating} | Total: {stats.totalReviews}
                        </p>
                    </div>
                </div>

                {/* Review Form Test */}
                <div className="bg-white rounded-lg border p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">2. Review Form Component</h2>

                    {user ? (
                        !userReview ? (
                            <ReviewForm
                                foodId={foodId}
                                foodName={foodName}
                                onSubmit={handleSubmitReview}
                            />
                        ) : (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-800 font-medium">✅ You already reviewed this!</p>
                                <p className="text-sm text-green-600 mt-1">Check your review in the list below</p>
                            </div>
                        )
                    ) : (
                        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                            <p className="text-gray-700 font-medium mb-3">🔒 Login Required</p>
                            <Link to="/login">
                                <Button>Login to Review</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Reviews List Test */}
                <div className="bg-white rounded-lg border p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">3. Reviews List Component</h2>
                    <ReviewsList foodId={foodId} foodName={foodName} />
                </div>

                {/* Stats Breakdown */}
                <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-2xl font-bold mb-4">4. Statistics Breakdown</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span>⭐⭐⭐⭐⭐ (5 stars)</span>
                            <span className="font-bold">{stats.ratingBreakdown[5]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>⭐⭐⭐⭐ (4 stars)</span>
                            <span className="font-bold">{stats.ratingBreakdown[4]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>⭐⭐⭐ (3 stars)</span>
                            <span className="font-bold">{stats.ratingBreakdown[3]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>⭐⭐ (2 stars)</span>
                            <span className="font-bold">{stats.ratingBreakdown[2]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>⭐ (1 star)</span>
                            <span className="font-bold">{stats.ratingBreakdown[1]}</span>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold mb-2">📝 Test Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Login sebagai member</li>
                        <li>Submit review dengan rating & text</li>
                        <li>Lihat review muncul di list</li>
                        <li>Coba edit review (klik Edit button)</li>
                        <li>Coba delete review</li>
                        <li>Logout dan lihat → form hidden, list tetap visible</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
