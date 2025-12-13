import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Utensils,
    Soup,
    Coffee,
    Cookie,
    Flame,
    Fish,
    Drumstick,
    Pizza,
    Layers,
    Sparkles
} from 'lucide-react';

interface CategoryPillsProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

// Map UI Label -> Database Type
export const CATEGORIES = [
    { id: 'Hidangan Nasi', label: 'Nasi & Lontong', icon: Layers, dbValue: 'Hidangan Nasi' },
    { id: 'Sate', label: 'Aneka Sate', icon: Flame, dbValue: 'Sate' },
    { id: 'Sup & Soto', label: 'Soto & Sup', icon: Soup, dbValue: 'Sup & Soto' },
    { id: 'Olahan Ayam & Unggas', label: 'Ayam & Bebek', icon: Drumstick, dbValue: 'Olahan Ayam & Unggas' },
    { id: 'Mie & Pasta', label: 'Mie & Bakso', icon: Pizza, dbValue: 'Mie & Pasta' },
    { id: 'Jajanan & Makanan Ringan', label: 'Jajanan Pasar', icon: Cookie, dbValue: 'Jajanan & Makanan Ringan' },
    { id: 'Sambal & Saus', label: 'Sambal', icon: Utensils, dbValue: 'Sambal & Saus' },
];

const CategoryPills: React.FC<CategoryPillsProps> = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-full py-6 overflow-x-auto no-scrollbar mask-gradient relative">
            <div className="flex space-x-3 px-4 md:px-0 min-w-max">
                {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.dbValue;
                    const Icon = cat.icon;

                    return (
                        <motion.button
                            key={cat.id}
                            onClick={() => onSelectCategory(isSelected ? "Semua" : cat.dbValue)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "relative flex items-center space-x-2 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 border shadow-sm select-none",
                                isSelected
                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                    : "bg-white dark:bg-card hover:bg-muted text-muted-foreground border-border hover:border-primary/50"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isSelected ? "text-primary-foreground" : "text-primary")} />
                            <span>{cat.label}</span>

                            {isSelected && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className="absolute inset-0 bg-white/20 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryPills;
