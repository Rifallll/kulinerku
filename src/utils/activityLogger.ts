import { supabase } from '@/lib/supabase';

type ActionType = 'LOGIN' | 'VIEW_FOOD' | 'SEARCH' | 'REVIEW' | 'ADD_FOOD' | 'EDIT_FOOD' | 'DELETE_FOOD' | 'FAVORITE' | 'OTHER';

export const logActivity = async (actionType: ActionType, details: any = {}) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        // We log even if user is null (anonymous activity), but ideally we want user_id if available.
        // The RLS policy I wrote allows public insert, or we can restricting it. 
        // If not authenticated, user_id will be null.

        await supabase.from('user_activities').insert({
            user_id: user?.id || null,
            activity_type: actionType, // Updated to match DB schema
            details: details,
        });
    } catch (error) {
        console.error('Error logging activity:', error);
        // Don't crash the app just because logging failed
    }
};
