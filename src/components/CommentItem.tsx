import React, { useState } from 'react';
import { Heart, Reply, Edit2, Trash2, User, MoreVertical } from 'lucide-react';
import { useComments, Comment } from '@/hooks/useComments';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentItemProps {
    comment: Comment;
    foodId: string;
    foodName: string;
    depth?: number;
    onUpdate: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    foodId,
    foodName,
    depth = 0,
    onUpdate
}) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const { addComment, updateComment, deleteComment, toggleLike } = useComments(foodId);

    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [editText, setEditText] = useState(comment.comment_text);
    const [showReplies, setShowReplies] = useState(true);

    const isOwnComment = user?.id === comment.user_id;
    const maxDepth = 3;
    const canReply = depth < maxDepth - 1;

    const handleLike = async () => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to like comments",
                variant: "destructive"
            });
            return;
        }

        try {
            await toggleLike(comment.id);
            onUpdate();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to like comment",
                variant: "destructive"
            });
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            await addComment(replyText.trim(), comment.id);
            setReplyText('');
            setIsReplying(false);
            onUpdate();
            toast({
                title: "Reply Posted!",
                description: "Your reply has been published"
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to post reply",
                variant: "destructive"
            });
        }
    };

    const handleEdit = async () => {
        if (!editText.trim()) return;

        try {
            await updateComment(comment.id, editText.trim());
            setIsEditing(false);
            onUpdate();
            toast({
                title: "Comment Updated",
                description: "Your comment has been updated"
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update comment",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await deleteComment(comment.id);
            onUpdate();
            toast({
                title: "Comment Deleted",
                description: "Your comment has been removed"
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete comment",
                variant: "destructive"
            });
        }
    };

    return (
        <div className={`${depth > 0 ? 'ml-8 md:ml-12' : ''}`}>
            <div className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">
                                {comment.user_name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                {comment.is_edited && ' (edited)'}
                            </p>
                        </div>
                    </div>

                    {isOwnComment && !isEditing && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Comment Content */}
                {isEditing ? (
                    <div className="mb-3">
                        <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="mb-2"
                            maxLength={1000}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleEdit}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => {
                                setIsEditing(false);
                                setEditText(comment.comment_text);
                            }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700 mb-3 leading-relaxed">
                        {comment.comment_text}
                    </p>
                )}

                {/* Comment Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 text-sm font-medium transition-colors ${comment.isLiked
                                ? 'text-red-600'
                                : 'text-gray-500 hover:text-red-600'
                            }`}
                    >
                        <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-red-600' : ''}`} />
                        {comment.likes_count > 0 && comment.likes_count}
                    </button>

                    {canReply && user && !isEditing && (
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                            <Reply className="h-4 w-4" />
                            Reply
                        </button>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {isReplying && (
                    <form onSubmit={handleReply} className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="mb-2"
                            maxLength={1000}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button type="submit" size="sm" disabled={!replyText.trim()}>
                                Post Reply
                            </Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => {
                                setIsReplying(false);
                                setReplyText('');
                            }}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            {/* Nested Replies */}
            {showReplies && comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            foodId={foodId}
                            foodName={foodName}
                            depth={depth + 1}
                            onUpdate={onUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
