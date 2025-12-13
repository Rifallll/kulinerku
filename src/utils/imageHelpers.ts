export const processImageUrl = (url: string): string => {
    if (!url) return 'https://placehold.co/400x300?text=No+Image';

    // Handle Google Drive Links
    if (url.includes('drive.google.com')) {
        // Extract ID
        // Format 1: https://drive.google.com/file/d/VIDEO_ID/view?usp=sharing
        // Format 2: https://drive.google.com/open?id=VIDEO_ID
        let id = '';
        const parts = url.split('/');
        if (url.includes('/file/d/')) {
            const index = parts.indexOf('d');
            if (index > -1 && index + 1 < parts.length) {
                id = parts[index + 1];
            }
        } else if (url.includes('id=')) {
            id = url.split('id=')[1].split('&')[0];
        }

        if (id) {
            // Return direct download/view link
            return `https://drive.google.com/uc?export=view&id=${id}`;
        }
    }

    // Handle other known issues or pass through
    return url;
};
