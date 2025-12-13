"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Star,
  Trash2,
  PlusCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Grid3x3,
  List,
  Download,
  Upload,
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { seedSupabaseWithDummyData } from "@/utils/seedDummyData";
import { fixImageUrl } from "@/utils/fixImage";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FoodItem {
  id: string;
  name: string;
  type: string;
  origin: string;
  rating: number;
  description: string;
  imageUrl: string;
  mostIconic?: string;
  created_at?: string;
}

type ViewMode = "grid" | "list";
type SortOption = "name" | "rating" | "date" | "origin";

const SupabaseData = () => {
  const queryClient = useQueryClient();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<"single" | "bulk" | "all">("single");
  const [targetId, setTargetId] = useState<string>("");


  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const [isSeedingDummyData, setIsSeedingDummyData] = useState(false);

  const [newFood, setNewFood] = useState<Omit<FoodItem, "id">>({
    name: "",
    type: "Makanan",
    origin: "",
    rating: 4.0,
    description: "",
    imageUrl: "",
    mostIconic: "",
  });

  // Fetch food items from Supabase
  const {
    data: foods = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FoodItem[], Error>({
    queryKey: ["supabaseFoods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("food_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FoodItem[];
    },
    retry: 3,

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: isAutoRefresh ? 5000 : false, // Auto refresh every 5s if enabled
  });

  // Get unique types and origins for filters
  const uniqueTypes = useMemo(() => {
    const types = new Set(foods.map((food) => food.type));
    return Array.from(types).sort();
  }, [foods]);

  const uniqueOrigins = useMemo(() => {
    const origins = new Set(foods.map((food) => food.origin));
    return Array.from(origins).sort();
  }, [foods]);

  // Filter and sort logic
  const filteredAndSortedFoods = useMemo(() => {
    let result = [...foods];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (food) =>
          food.name.toLowerCase().includes(term) ||
          food.type.toLowerCase().includes(term) ||
          food.origin.toLowerCase().includes(term) ||
          food.description.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((food) => food.type === typeFilter);
    }

    // Origin filter
    if (originFilter !== "all") {
      result = result.filter((food) => food.origin === originFilter);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "date":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case "origin":
          return a.origin.localeCompare(b.origin);
        default:
          return 0;
      }
    });

    return result;
  }, [foods, searchTerm, typeFilter, originFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedFoods.length / itemsPerPage);
  const paginatedFoods = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedFoods.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedFoods, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, originFilter, sortBy]);

  // Mutation to add a new food item
  const addFoodMutation = useMutation<FoodItem, Error, Omit<FoodItem, "id">>({
    mutationFn: async (newFood) => {
      const { data, error } = await supabase
        .from("food_items")
        .insert([newFood])
        .select()
        .single();
      if (error) throw error;
      return data as FoodItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabaseFoods"] });
      showSuccess("Item makanan berhasil ditambahkan!");
      setNewFood({
        name: "",
        type: "Makanan",
        origin: "",
        rating: 4.0,
        description: "",
        imageUrl: "",
        mostIconic: "",
      });
    },
    onError: (err) => {
      showError(`Gagal menambahkan item: ${err.message}`);
    },
  });

  // Mutation to delete food items
  const deleteFoodMutation = useMutation<void, Error, string[]>({
    mutationFn: async (ids) => {
      const { error } = await supabase.from("food_items").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["supabaseFoods"] });
      setSelectedIds(new Set());
      showSuccess(`${ids.length} item berhasil dihapus!`);
    },
    onError: (err) => {
      console.error("Delete error:", err);

      // Check if it's a permission/RLS error
      if (err.message.includes("row-level security") ||
        err.message.includes("permission denied") ||
        err.message.includes("policy")) {
        showError(
          "Gagal menghapus: Tidak ada permission. " +
          "Silakan buka Supabase Dashboard → SQL Editor dan jalankan script RLS policy fix. " +
          "Lihat file 'supabase_fix_delete_permissions.sql' di project folder."
        );
      } else {
        showError(`Gagal menghapus item: ${err.message}`);
      }
    },
  });

  // Mutation to delete all items
  const deleteAllMutation = useMutation<void, Error>({
    mutationFn: async () => {
      const { error } = await supabase
        .from("food_items")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabaseFoods"] });
      setSelectedIds(new Set());
      showSuccess("Semua item berhasil dihapus!");
    },
    onError: (err) => {
      console.error("Delete all error:", err);

      // Check if it's a permission/RLS error
      if (err.message.includes("row-level security") ||
        err.message.includes("permission denied") ||
        err.message.includes("policy")) {
        showError(
          "Gagal menghapus semua data: Tidak ada permission. " +
          "Silakan buka Supabase Dashboard → SQL Editor dan jalankan script RLS policy fix. " +
          "Lihat file 'supabase_fix_delete_permissions.sql' di project folder."
        );
      } else {
        showError(`Gagal menghapus semua item: ${err.message}`);
      }
    },
  });

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFood((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newFood.name.trim()) {
      showError("Nama makanan wajib diisi!");
      return;
    }
    if (!newFood.origin.trim()) {
      showError("Asal daerah wajib diisi!");
      return;
    }
    if (newFood.rating < 0 || newFood.rating > 5) {
      showError("Rating harus antara 0-5!");
      return;
    }

    addFoodMutation.mutate(newFood);
  };

  const handleSeedDummyData = async () => {
    setIsSeedingDummyData(true);
    try {
      await seedSupabaseWithDummyData();
      queryClient.invalidateQueries({ queryKey: ["supabaseFoods"] });
      showSuccess("Data dummy berhasil ditambahkan!");
    } catch (err: unknown) {
      showError(`Gagal menambahkan data dummy: ${(err as Error).message}`);
    } finally {
      setIsSeedingDummyData(false);
    }
  };

  const handleDeleteClick = (type: "single" | "bulk" | "all", id?: string) => {
    setDeleteTarget(type);
    setTargetId(id || "");
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget === "all") {
      deleteAllMutation.mutate();
    } else if (deleteTarget === "bulk") {
      deleteFoodMutation.mutate(Array.from(selectedIds));
    } else if (deleteTarget === "single" && targetId) {
      deleteFoodMutation.mutate([targetId]);
    }
    setShowDeleteDialog(false);
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedFoods.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedFoods.map((f) => f.id)));
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setOriginFilter("all");
    setSortBy("name");
  };

  const isAnyOperationActive =
    isSeedingDummyData ||
    addFoodMutation.isPending ||
    deleteFoodMutation.isPending ||
    deleteAllMutation.isPending;

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Memuat data makanan...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle className="text-destructive">Error Memuat Data</CardTitle>
            </div>
            <CardDescription>
              Terjadi kesalahan saat memuat data dari Supabase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-destructive/10 p-4 rounded-md">
              <p className="text-sm font-mono text-destructive">
                {error?.message || "Unknown error"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Coba Lagi
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reload Halaman
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-foreground">
          Kelola Data Makanan Supabase
        </h1>
        <p className="text-muted-foreground text-lg">
          Tambah, edit, dan kelola data makanan Indonesia
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        <Button
          onClick={handleSeedDummyData}
          disabled={isAnyOperationActive}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isSeedingDummyData ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menambahkan...
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Tambah Data
            </>
          )}
        </Button>

        <Button
          onClick={() => handleDeleteClick("all")}
          disabled={isAnyOperationActive || foods.length === 0}
          variant="destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus Semua Data
        </Button>

        {selectedIds.size > 0 && (
          <Button
            onClick={() => handleDeleteClick("bulk")}
            disabled={isAnyOperationActive}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus {selectedIds.size} Terpilih
          </Button>
        )}


        <Button
          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          variant={isAutoRefresh ? "secondary" : "outline"}
          className="ml-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
          {isAutoRefresh ? "Auto Refresh: ON" : "Auto Refresh: OFF"}
        </Button>
      </div>

      <Separator className="mb-8" />

      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Pencarian & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label htmlFor="search">Cari Makanan</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari nama, jenis, atau daerah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <Label htmlFor="typeFilter">Jenis</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="typeFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Origin Filter */}
            <div>
              <Label htmlFor="originFilter">Asal Daerah</Label>
              <Select value={originFilter} onValueChange={setOriginFilter}>
                <SelectTrigger id="originFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Daerah</SelectItem>
                  {uniqueOrigins.map((origin) => (
                    <SelectItem key={origin} value={origin}>
                      {origin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="sortBy">Urutkan:</Label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger id="sortBy" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nama (A-Z)</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  <SelectItem value="date">Terbaru</SelectItem>
                  <SelectItem value="origin">Asal (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="viewMode">Tampilan:</Label>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button variant="ghost" onClick={clearFilters} size="sm">
              <XCircle className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Menampilkan {filteredAndSortedFoods.length} dari {foods.length} item
            </p>
            {selectedIds.size > 0 && (
              <p className="font-medium text-primary">
                {selectedIds.size} item terpilih
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Food Item Form */}
        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Tambah Makanan Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">
                  Nama Makanan <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newFood.name}
                  onChange={handleChange}
                  placeholder="Contoh: Rendang"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">
                  Jenis <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newFood.type}
                  onValueChange={(value) =>
                    setNewFood((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Makanan">Makanan</SelectItem>
                    <SelectItem value="Minuman">Minuman</SelectItem>
                    <SelectItem value="Snack">Snack</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="origin">
                  Asal Daerah <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="origin"
                  name="origin"
                  value={newFood.origin}
                  onChange={handleChange}
                  placeholder="Contoh: Sumatera Barat"
                  required
                />
              </div>

              <div>
                <Label htmlFor="rating">
                  Rating (0-5) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={newFood.rating}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">URL Gambar</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={newFood.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="description">
                  Deskripsi <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newFood.description}
                  onChange={handleChange}
                  placeholder="Deskripsikan makanan ini..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="mostIconic">Paling Ikonik (Opsional)</Label>
                <Input
                  id="mostIconic"
                  name="mostIconic"
                  value={newFood.mostIconic || ""}
                  onChange={handleChange}
                  placeholder="Contoh: Padang Panjang"
                />
              </div>

              <Button
                type="submit"
                disabled={isAnyOperationActive}
                className="w-full"
              >
                {addFoodMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambahkan Makanan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Food Items List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daftar Makanan</CardTitle>
                {paginatedFoods.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSelectAll}
                    disabled={isAnyOperationActive}
                  >
                    {selectedIds.size === paginatedFoods.length
                      ? "Batalkan Semua"
                      : "Pilih Semua"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredAndSortedFoods.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    {foods.length === 0
                      ? "Belum ada data makanan"
                      : "Tidak ada hasil yang sesuai"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {foods.length === 0
                      ? "Tambahkan makanan baru atau seed data dummy"
                      : "Coba ubah filter pencarian Anda"}
                  </p>
                </div>
              )}

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedFoods.map((food) => (
                    <div
                      key={food.id}
                      className={`border rounded-lg p-4 transition-all ${selectedIds.has(food.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                        }`}
                    >
                      <div className="flex gap-4">
                        <Checkbox
                          checked={selectedIds.has(food.id)}
                          onCheckedChange={() => toggleSelection(food.id)}
                          disabled={isAnyOperationActive}
                        />

                        <img
                          src={fixImageUrl(food.name, food.imageUrl)}
                          alt={food.name}
                          className="h-20 w-20 object-cover rounded-md flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = fixImageUrl(food.name, "");
                          }}
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg truncate">
                            {food.name}
                          </h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">{food.type}</Badge>
                            <Badge variant="outline">{food.origin}</Badge>
                          </div>
                          <div className="flex items-center text-yellow-500 text-sm mt-2">
                            {Array.from({ length: Math.floor(food.rating) }).map(
                              (_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              )
                            )}
                            <span className="ml-1 text-foreground">
                              {food.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteClick("single", food.id)}
                          disabled={isAnyOperationActive}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {paginatedFoods.map((food) => (
                    <div
                      key={food.id}
                      className={`flex items-center gap-4 p-3 border rounded-lg transition-all ${selectedIds.has(food.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                        }`}
                    >
                      <Checkbox
                        checked={selectedIds.has(food.id)}
                        onCheckedChange={() => toggleSelection(food.id)}
                        disabled={isAnyOperationActive}
                      />

                      <img
                        src={fixImageUrl(food.name, food.imageUrl)}
                        alt={food.name}
                        className="h-16 w-16 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = fixImageUrl(food.name, "");
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{food.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {food.description}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Badge variant="secondary">{food.type}</Badge>
                        <Badge variant="outline">{food.origin}</Badge>
                      </div>

                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        {food.rating.toFixed(1)}
                      </div>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClick("single", food.id)}
                        disabled={isAnyOperationActive}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="itemsPerPage">Items per page:</Label>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(v) => {
                        setItemsPerPage(parseInt(v));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger id="itemsPerPage" className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Halaman {currentPage} dari {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget === "all"
                ? "Apakah Anda yakin ingin menghapus SEMUA data makanan? Tindakan ini tidak dapat dibatalkan."
                : deleteTarget === "bulk"
                  ? `Apakah Anda yakin ingin menghapus ${selectedIds.size} item yang dipilih?`
                  : "Apakah Anda yakin ingin menghapus item ini?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SupabaseData;