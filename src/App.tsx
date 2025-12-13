import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageLoadingSkeleton } from "./components/LoadingSkeleton";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Lazy load all route components for code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BestFood = lazy(() => import("./pages/BestFood"));
const Recipes = lazy(() => import("./pages/Recipes"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const MapPage = lazy(() => import("./pages/MapPage"));
const Regions = lazy(() => import("./pages/Regions"));
const FoodDetail = lazy(() => import("./pages/FoodDetail"));
const SupabaseData = lazy(() => import("./pages/SupabaseData"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const OriginUpdater = lazy(() => import("./pages/OriginUpdater"));
const DataInspector = lazy(() => import("./pages/DataInspector"));
const ProvinceConsolidator = lazy(() => import("./pages/ProvinceConsolidator"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ReviewsTest = lazy(() => import("./pages/ReviewsTest"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const History = lazy(() => import("./pages/History"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));

// Admin Components
import { AdminLayout } from "./components/layouts/AdminLayout";
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const FoodManager = lazy(() => import("./pages/admin/FoodManager"));
const ReviewManager = lazy(() => import("./pages/admin/ReviewManager"));
const UserManager = lazy(() => import("./pages/admin/UserManager")); // Lazy load User Manager

// Configure React Query with optimized caching for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection time (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Only retry failed requests once
      refetchOnMount: false, // Don't refetch on component mount if data is fresh
    },
  },
});


const App = () => (
  <React.Fragment>
    <Toaster />
    <Sonner />
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">
                <Suspense fallback={<PageLoadingSkeleton />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/settings" element={<ProfileSettings />} />

                    <Route path="/best-food" element={<BestFood />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/regions" element={<Regions />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/food/:id" element={<FoodDetail />} />
                    <Route path="/reviews-test" element={<ReviewsTest />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/history" element={<History />} />


                    {/* Admin-only routes */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout>
                            <AdminDashboard />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/foods"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout>
                            <FoodManager />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/reviews"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout>
                            <ReviewManager />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout>
                            <UserManager />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/supabase-data"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout>
                            <SupabaseData />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/update-origins"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout>
                            <OriginUpdater />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inspect-data"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout>
                            <DataInspector />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/consolidate-provinces"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout>
                            <ProvinceConsolidator />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.Fragment>
);

export default App;