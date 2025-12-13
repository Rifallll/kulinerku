import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

interface RandomFoodButtonProps {
    foods: { id: string; name: string }[];
}

export function RandomFoodButton({ foods }: RandomFoodButtonProps) {
    const navigate = useNavigate();
    const [isSpinning, setIsSpinning] = useState(false);

    const handleClick = () => {
        if (foods.length === 0) return;

        setIsSpinning(true);

        // Shuffle animation
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * foods.length);
            const randomFood = foods[randomIndex];
            setIsSpinning(false);
            navigate(`/food/${randomFood.id}`);
        }, 500);
    };

    return (
        <Button
            onClick={handleClick}
            size="lg"
            className="fixed bottom-6 right-6 rounded-full shadow-lg px-6 py-6 z-40 hover:scale-110 transition-all duration-200"
            disabled={isSpinning}
        >
            <Shuffle className={`h-5 w-5 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Kejutkan Saya!</span>
            <span className="sm:hidden">🎲</span>
        </Button>
    );
}
