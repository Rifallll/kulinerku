import { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { processImageUrl } from '@/utils/imageHelpers';
import { migrateBestFoods } from '@/utils/migrateBestFoods';
import { updateFoodOrigins } from '@/utils/updateOriginsList';
import { removeDuplicateFoods } from '@/utils/removeDuplicates';
import { clearAllFoods } from '@/utils/clearFoods';
import { resetBestFoodsStatus } from '@/utils/resetBestFoods';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, Search, Database, MapPin, Award } from 'lucide-react';

export default function FoodManager() {
    const [foods, setFoods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        rating: '4.0',
        image: '', // Can be URL or Google Drive link
        category: 'Makanan',
        origin: ''
    });

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('food_items')
            .select('*')
            .order('name', { ascending: true }); // Sort by name to easily find items

        if (data) setFoods(data);
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            setLoading(true);
            const { error: uploadError } = await supabase.storage
                .from('food-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('food-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image: data.publicUrl });
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Error uploading image");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const processedImage = processImageUrl(formData.image);

            const payload = {
                name: formData.name,
                description: formData.description,
                imageUrl: processedImage,
                type: formData.category,
                origin: formData.origin,
                rating: formData.rating ? parseFloat(formData.rating) : 4.0 // Default rating
            };

            if (editingFood) {
                const { error } = await supabase
                    .from('food_items')
                    .update(payload)
                    .eq('id', editingFood.id);
                if (error) throw error;
                toast.success('Food updated successfully');
            } else {
                const { error } = await supabase
                    .from('food_items')
                    .insert(payload);
                if (error) throw error;
                toast.success('Food created successfully');
            }

            setIsDialogOpen(false);
            resetForm();
            fetchFoods();
        } catch (error) {
            toast.error('Failed to save food');
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const { error } = await supabase
                .from('food_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Deleted successfully');
            setFoods(foods.filter(f => f.id !== id));
        } catch (e) {
            toast.error('Failed to delete');
        }
    };

    const openEdit = (food: any) => {
        setEditingFood(food);
        setFormData({
            name: food.name || '',
            description: food.description || '',
            rating: food.rating?.toString() || '4.0',
            image: food.imageUrl || '',
            category: food.type || 'Makanan',
            origin: food.origin || ''
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingFood(null);
        setFormData({ name: '', description: '', rating: '4.0', image: '', category: 'Makanan', origin: '' });
    };

    const filteredFoods = foods.filter(f =>
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.origin?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleBest = async (food: any) => {
        const newValue = food.mostIconic === 'STAR' ? null : 'STAR';
        const { error } = await supabase
            .from('food_items')
            .update({ mostIconic: newValue })
            .eq('id', food.id);

        if (error) {
            toast.error("Failed to update status");
        } else {
            toast.success(newValue ? "Added to Best Foods" : "Removed from Best Foods");
            // Optimistic update
            setFoods(foods.map(f => f.id === food.id ? { ...f, mostIconic: newValue } : f));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Food Manager</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => updateFoodOrigins().then(fetchFoods)}>
                        <MapPin className="mr-2" size={16} /> Fix Origins
                    </Button>
                    <Button variant="outline" onClick={() => removeDuplicateFoods().then(fetchFoods)}>
                        <Trash2 className="mr-2 text-red-500" size={16} /> Clean Duplicates
                    </Button>
                    <Button variant="outline" onClick={() => migrateBestFoods().then(fetchFoods)}>
                        <Database className="mr-2" size={16} /> Import 50 Best
                    </Button>
                    <Button variant="outline" onClick={() => {
                        if (confirm("Clear the Best Foods list? (This keeps the food, just unstars them)")) {
                            resetBestFoodsStatus().then(fetchFoods);
                        }
                    }}>
                        <Award className="mr-2" size={16} /> Clear Best List
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        if (confirm("Are you sure? This will delete ALL food items!")) {
                            clearAllFoods().then(fetchFoods);
                        }
                    }}>
                        <Trash2 className="mr-2" size={16} /> Reset Database
                    </Button>
                    <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                        <Plus className="mr-2" size={16} /> Add New Food
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2 bg-white p-2 rounded shadow-sm border">
                <Search className="text-gray-400" />
                <Input
                    placeholder="Search foods..."
                    className="border-none focus-visible:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFoods.map((food) => (
                        <Card key={food.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video w-full bg-gray-100 relative">
                                <img
                                    src={food.imageUrl || 'https://placehold.co/400x300'}
                                    alt={food.name}
                                    className="object-contain w-full h-full p-1"
                                />
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    <Button
                                        size="sm"
                                        variant={food.mostIconic === 'STAR' ? "default" : "secondary"}
                                        className={food.mostIconic === 'STAR' ? "bg-yellow-500 hover:bg-yellow-600" : "bg-white/80 hover:bg-white"}
                                        onClick={() => handleToggleBest(food)}
                                        title="Toggle Best Food"
                                    >
                                        <Award size={14} className={food.mostIconic === 'STAR' ? "fill-white text-white" : "text-gray-600"} />
                                    </Button>
                                    <Button size="sm" variant="secondary" onClick={() => openEdit(food)}>
                                        <Pencil size={14} />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(food.id)}>
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex justify-between">
                                    <span className="truncate">{food.name}</span>
                                    <span className="text-sm font-normal bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                        ★ {food.rating ? food.rating.toFixed(1) : 'N/A'}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 line-clamp-2">{food.description || 'No description'}</p>
                                <div className="mt-2 text-xs text-gray-400">
                                    {food.origin} • {food.category || food.type}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )
            }

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle>{editingFood ? 'Edit Food' : 'Add New Food'}</DialogTitle>
                        <DialogDescription>
                            {editingFood ? 'Update the details of the existing food item.' : 'Fill in the details to create a new food item.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Food Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Makanan</option>
                                    <option>Minuman</option>
                                    <option>Jajanan</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Origin</label>
                                <Input
                                    value={formData.origin}
                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                    placeholder="e.g. Jawa Barat"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rating (0-5)</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Image URL / Drive Link</label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                                <div className="relative w-10 h-10 flex-shrink-0">
                                    <Input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        title="Upload from Device"
                                    />
                                    <Button variant="outline" size="icon" type="button" className="w-full h-full">
                                        <Plus size={16} />
                                    </Button>
                                    {loading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20"><Loader2 className="animate-spin w-4 h-4" /></div>}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">
                                Paste a URL or click the + button to upload an image from your device.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}
