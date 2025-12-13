import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Comment {
    id: string;
    food_id: string;
    food_name: string;
    user_id: string;
    user_email: string;
    user_name: string;
    comment_text: string;
    parent_id: string | null;
    is_edited: boolean;
    edited_at: string | null;
    likes_count: number;
    created_at: string;
    updated_at: string;
    replies?: Comment[];
    isLiked?: boolean;
}

export function useComments(foodId?: string) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch comments for a food
    const fetchComments = useCallback(async (targetFoodId: string) => {
        try {
            const { data, error } = await supabase
                .from('food_comments')
                .select('*')
                .eq('food_id', targetFoodId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Build comment tree
            const commentTree = buildCommentTree(data || []);

            // Check which comments are liked by current user
            if (user) {
                const commentsWithLikes = await checkUserLikes(commentTree);
                setComments(commentsWithLikes);
            } else {
                setComments(commentTree);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Build nested comment structure
    const buildCommentTree = (flatComments: Comment[]): Comment[] => {
        const commentMap = new Map<string, Comment>();
        const rootComments: Comment[] = [];

        // First pass: create map
        flatComments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, replies: [] });
        });

        // Second pass: build tree
        flatComments.forEach(comment => {
            const commentNode = commentMap.get(comment.id)!;
            if (comment.parent_id) {
                const parent = commentMap.get(comment.parent_id);
                if (parent) {
                    parent.replies = parent.replies || [];
                    parent.replies.push(commentNode);
                }
            } else {
                rootComments.push(commentNode);
            }
        });

        return rootComments;
    };

    // Check which comments user has liked
    const checkUserLikes = async (commentList: Comment[]): Promise<Comment[]> => {
        if (!user) return commentList;

        const commentIds = getAllCommentIds(commentList);

        try {
            const { data } = await supabase
                .from('comment_likes')
                .select('comment_id')
                .eq('user_id', user.id)
                .in('comment_id', commentIds);

            const likedIds = new Set(data?.map(l => l.comment_id) || []);

            return markLikedComments(commentList, likedIds);
        } catch (error) {
            console.error('Error checking likes:', error);
            return commentList;
        }
    };

    // Helper: get all comment IDs recursively
    const getAllCommentIds = (commentList: Comment[]): string[] => {
        const ids: string[] = [];
        commentList.forEach(comment => {
            ids.push(comment.id);
            if (comment.replies) {
                ids.push(...getAllCommentIds(comment.replies));
            }
        });
        return ids;
    };

    // Helper: mark liked comments
    const markLikedComments = (commentList: Comment[], likedIds: Set<string>): Comment[] => {
        return commentList.map(comment => ({
            ...comment,
            isLiked: likedIds.has(comment.id),
            replies: comment.replies ? markLikedComments(comment.replies, likedIds) : []
        }));
    };

    // Add new comment or reply (Optimistic)
    const addComment = async (text: string, parentId?: string) => {
        if (!user || !foodId) throw new Error('Must be logged in');

        // 1. Optimistic Update
        const tempId = 'temp-' + Date.now();
        const optimisticComment: Comment = {
            id: tempId,
            food_id: foodId,
            food_name: '',
            user_id: user.id,
            user_email: user.email!,
            user_name: user.email?.split('@')[0] || 'Anonymous',
            comment_text: text,
            parent_id: parentId || null,
            is_edited: false,
            edited_at: null,
            likes_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            replies: []
        };

        // Manually update local state tree
        setComments(prev => {
            const newTree = JSON.parse(JSON.stringify(prev)); // Deep copy
            if (parentId) {
                // Helper to find and append reply
                const appendReply = (nodes: Comment[]) => {
                    for (const node of nodes) {
                        if (node.id === parentId) {
                            node.replies = node.replies || [];
                            node.replies.push(optimisticComment);
                            return true;
                        }
                        if (node.replies && appendReply(node.replies)) return true;
                    }
                    return false;
                };
                appendReply(newTree);
                return newTree;
            } else {
                return [optimisticComment, ...newTree];
            }
        });

        try {
            const { data, error } = await supabase
                .from('food_comments')
                .insert({
                    food_id: foodId,
                    food_name: '',
                    user_id: user.id,
                    user_email: user.email,
                    user_name: user.email?.split('@')[0] || 'Anonymous',
                    comment_text: text,
                    parent_id: parentId || null
                })
                .select()
                .single();

            if (error) throw error;

            // 2. Validate/Replace with real data
            // Simple approach: re-fetch to ensure consistency (background)
            // Or better: swap the temp ID with real ID in local state
            await fetchComments(foodId);
            return data;

        } catch (error) {
            console.error('Error adding comment:', error);
            // 3. Rollback
            await fetchComments(foodId);
            throw error;
        }
    };

    // Update comment
    const updateComment = async (commentId: string, text: string) => {
        if (!user) throw new Error('Must be logged in');

        try {
            const { error } = await supabase
                .from('food_comments')
                .update({
                    comment_text: text,
                    is_edited: true,
                    edited_at: new Date().toISOString()
                })
                .eq('id', commentId)
                .eq('user_id', user.id);

            if (error) throw error;

            // Refresh comments
            if (foodId) await fetchComments(foodId);
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    };

    // Delete comment
    const deleteComment = async (commentId: string) => {
        if (!user) throw new Error('Must be logged in');

        try {
            const { error } = await supabase
                .from('food_comments')
                .delete()
                .eq('id', commentId)
                .eq('user_id', user.id);

            if (error) throw error;

            // Refresh comments
            if (foodId) await fetchComments(foodId);
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    };

    // Toggle like on comment
    const toggleLike = async (commentId: string) => {
        if (!user) throw new Error('Must be logged in');

        try {
            // Check if already liked
            const { data: existingLike } = await supabase
                .from('comment_likes')
                .select('id')
                .eq('comment_id', commentId)
                .eq('user_id', user.id)
                .single();

            if (existingLike) {
                // Unlike
                await supabase
                    .from('comment_likes')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', user.id);

                // Decrement count
                await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
            } else {
                // Like
                await supabase
                    .from('comment_likes')
                    .insert({
                        comment_id: commentId,
                        user_id: user.id
                    });

                // Increment count
                await supabase.rpc('increment_comment_likes', { comment_id: commentId });
            }

            // Refresh comments
            if (foodId) await fetchComments(foodId);
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    };

    // Load data on mount
    useEffect(() => {
        if (foodId) {
            fetchComments(foodId);
        } else {
            setLoading(false);
        }
    }, [foodId, fetchComments]);

    return {
        comments,
        loading,
        addComment,
        updateComment,
        deleteComment,
        toggleLike,
        refreshComments: () => foodId && fetchComments(foodId)
    };
}
