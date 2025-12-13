import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserProfile {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
    role?: string;
}

export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                // If fetching fails, might be because profile creation trigger failed/lagged. 
                // We'll fallback to auth metadata
                console.warn('Profile fetch warning:', error);
                
                // Fallback: use user metadata
                setProfile({
                   id: user.id,
                   email: user.email,
                   role: user.user_metadata?.role || 'member'
                });
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return;
        try {
            setLoading(true);
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;
            
            // Optimistic update
            setProfile(prev => prev ? { ...prev, ...updates } : null);
            toast.success('Profil berhasil diperbarui');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Gagal memperbarui profil');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (file: File) => {
        if (!user) return;
        try {
            setLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`; // Just filename for clean bucket

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update Profile with new URL
            await updateProfile({ avatar_url: publicUrl });
            
            return publicUrl;
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            toast.error('Gagal upload foto: ' + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        updateProfile,
        uploadAvatar,
        refreshProfile: fetchProfile
    };
}
