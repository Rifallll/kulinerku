import React, { useState } from "react";
import { ShoppingCart, Check, Trash2, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShoppingListProps {
    recipeName: string;
    ingredients: string[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ recipeName, ingredients }) => {
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
    const [isOpen, setIsOpen] = useState(false);

    const toggleItem = (index: number) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedItems(newChecked);
    };

    const clearAll = () => {
        setCheckedItems(new Set());
    };

    const checkAll = () => {
        setCheckedItems(new Set(ingredients.map((_, i) => i)));
    };

    const shareToWhatsApp = () => {
        const uncheckedItems = ingredients
            .filter((_, i) => !checkedItems.has(i))
            .map((ing, i) => `☐ ${ing}`)
            .join('\n');

        const checkedItemsList = ingredients
            .filter((_, i) => checkedItems.has(i))
            .map((ing) => `✓ ${ing}`)
            .join('\n');

        const message = `*Daftar Belanja: ${recipeName}*\n\n` +
            (uncheckedItems ? `*Belum dibeli:*\n${uncheckedItems}\n\n` : '') +
            (checkedItemsList ? `*Sudah dibeli:*\n${checkedItemsList}` : '');

        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const copyToClipboard = () => {
        const text = ingredients.map((ing, i) =>
            `${checkedItems.has(i) ? '✓' : '☐'} ${ing}`
        ).join('\n');

        navigator.clipboard.writeText(`Daftar Belanja: ${recipeName}\n\n${text}`);
        alert('Disalin ke clipboard!');
    };

    const progress = (checkedItems.size / ingredients.length) * 100;

    return (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-orange-100/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-orange-900">Daftar Belanja</h3>
                        <p className="text-xs text-orange-600">{checkedItems.size}/{ingredients.length} item</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-orange-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <svg
                        className={`h-5 w-5 text-orange-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Content */}
            {isOpen && (
                <div className="p-4 border-t border-orange-200">
                    {/* Actions */}
                    <div className="flex gap-2 mb-4">
                        <Button variant="outline" size="sm" onClick={checkAll} className="text-xs">
                            <Check className="h-3 w-3 mr-1" /> Semua
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearAll} className="text-xs">
                            <Trash2 className="h-3 w-3 mr-1" /> Reset
                        </Button>
                        <Button variant="outline" size="sm" onClick={copyToClipboard} className="text-xs">
                            <Copy className="h-3 w-3 mr-1" /> Salin
                        </Button>
                        <Button size="sm" onClick={shareToWhatsApp} className="text-xs bg-green-600 hover:bg-green-700">
                            <Share2 className="h-3 w-3 mr-1" /> WhatsApp
                        </Button>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {ingredients.map((ing, idx) => (
                            <label
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${checkedItems.has(idx)
                                        ? 'bg-green-100 line-through text-gray-400'
                                        : 'bg-white hover:bg-orange-50'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checkedItems.has(idx)}
                                    onChange={() => toggleItem(idx)}
                                    className="w-5 h-5 rounded border-2 border-orange-300 text-orange-500 focus:ring-orange-500"
                                />
                                <span className={checkedItems.has(idx) ? 'text-gray-400' : 'text-gray-700'}>
                                    {ing}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Footer */}
                    {checkedItems.size === ingredients.length && (
                        <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                            <p className="text-green-700 font-medium">🎉 Semua bahan sudah dibeli!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShoppingList;
