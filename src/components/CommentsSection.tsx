import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, X } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CommentItem } from './CommentItem';

interface CommentsSectionProps {
    foodId: string;
    foodName: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ foodId, foodName }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const { comments, loading, addComment, refreshComments } = useComments(foodId);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentText.trim()) {
            toast({
                title: "Error",
                description: "Comment cannot be empty",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await addComment(commentText.trim());
            setCommentText('');
            toast({
                title: "Comment Posted! 💬",
                description: "Your comment has been published"
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to post comment",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="h-7 w-7 text-indigo-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                    Discussion & Comments
                </h2>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                    {comments.length}
                </span>
            </div>

            {/* Comment Form (Member-Only) */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                        💬 Join the discussion about {foodName}
                    </label>
                    <Textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Share your thoughts, experience, or questions..."
                        className="min-h-[120px] resize-none mb-3 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                        maxLength={1000}
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            {commentText.length}/1000 characters
                        </span>
                        <div className="flex gap-2">
                            {commentText && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCommentText('')}
                                    disabled={isSubmitting}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Clear
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={!commentText.trim() || isSubmitting}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-6 bg-gradient-to-r from-gray-700 to-slate-800 border-2 border-gray-600 rounded-lg text-center">
                    <p className="text-white font-semibold mb-3">
                        🔒 Want to join the discussion?
                    </p>
                    <p className="text-sm text-gray-200 mb-4">
                        Login to share your thoughts and engage with the community
                    </p>
                    <Link to="/login">
                        <Button className="bg-white text-gray-900 hover:bg-gray-100">
                            Login to Comment
                        </Button>
                    </Link>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
                    <p className="text-gray-500 mt-3">Loading comments...</p>
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            foodId={foodId}
                            foodName={foodName}
                            onUpdate={refreshComments}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold mb-2">No comments yet</p>
                    <p className="text-sm text-gray-500">
                        Be the first to share your thoughts about {foodName}!
                    </p>
                </div>
            )}
        </div>
    );
};
