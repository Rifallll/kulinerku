"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Menu, Database, ChevronDown, Brain, Heart, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlobalSearch from "./GlobalSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { count } = useFavorites();
  const { profile } = useProfile();
  const { user, isAdmin, signOut } = useAuth();

  const handleCategorySelect = (category: string) => {
    navigate(`/?category=${category}`);
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm font-sans">
      <div className="w-full flex flex-wrap min-h-[50px] items-center justify-between px-4 md:px-6 py-2 gap-y-2">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-primary flex items-center">
            Kulineran
          </Link>

        </div>

        {/* Search Bar - Restored */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <GlobalSearch />
        </div>



        <nav className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-sm rounded-full hover:bg-amber-200 hover:text-primary transition-colors duration-300">
            <Link to="/best-food"><span>Makanan Terbaik</span></Link>
          </Button>

          <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-sm rounded-full hover:bg-amber-200 hover:text-primary transition-colors duration-300">
            <Link to="/regions"><span>Daerah</span></Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-sm rounded-full hover:bg-pink-200 hover:text-pink-600 transition-colors duration-300 relative">
            <Link to="/favorites" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>Favorit</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="group flex items-center h-8 px-4 text-sm font-medium rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20">
                <span>Kategori</span>
                <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform duration-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px] p-2 rounded-xl shadow-xl border-border/50 backdrop-blur-sm bg-white/90 dark:bg-black/90 animate-in fade-in zoom-in-95 duration-200">
              <DropdownMenuItem
                onClick={() => handleCategorySelect("Makanan")}
                className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary font-medium p-2"
              >
                🍴 Makanan
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCategorySelect("Minuman")}
                className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary font-medium p-2"
              >
                🥤 Minuman
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-sm rounded-full hover:bg-amber-200 hover:text-primary transition-colors duration-300">
            <Link to="/recipes"><span>Resep</span></Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-sm rounded-full hover:bg-amber-200 hover:text-primary transition-colors duration-300">
            <Link to="/map"><span>Peta</span></Link>
          </Button>
          {user && (
            <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-sm rounded-full hover:bg-indigo-200 hover:text-indigo-600 transition-colors duration-300">
              <Link to="/dashboard" className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full hover:bg-amber-200 hover:text-primary transition-colors duration-300">
            <Link to="/analytics" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
            </Link>
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full hover:bg-amber-200 hover:text-primary transition-colors duration-300">
              <Link to="/supabase-data">
                <span><Database className="h-4 w-4" /></span>
              </Link>
            </Button>
          )}

          {/* Auth Button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {profile?.full_name && <p className="font-medium">{profile.full_name}</p>}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild className="h-8 px-4 rounded-full">
              <Link to="/login" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                <span>Masuk</span>
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {/* User Icon for Mobile - Visible directly on Header */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {profile?.full_name && <p className="font-medium">{profile.full_name}</p>}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <SheetDescription className="sr-only">
                Menu navigasi utama untuk perangkat mobile
              </SheetDescription>
              {/* ... Content can remain standard size for mobile sheet ... */}
              <div className="flex flex-col space-y-4 p-4">
                <Link to="/" className="text-2xl font-bold text-primary mb-4">
                  Kulineran
                </Link>
                <Link to="/best-food" className="text-lg font-medium hover:text-primary">
                  <span>Makanan Terbaik 2026</span>
                </Link>

                <Link to="/regions" className="text-lg font-medium hover:text-primary">
                  <span>Daerah</span>
                </Link>
                {/* Dropdown Kategori untuk Mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start text-lg font-medium hover:text-primary pl-0">
                      <span>Kategori</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[calc(100%-2rem)]">
                    <DropdownMenuItem onClick={() => { handleCategorySelect("All"); }}>
                      Semua
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleCategorySelect("Makanan"); }}>
                      Makanan
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleCategorySelect("Minuman"); }}>
                      Minuman
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link to="/recipes" className="text-lg font-medium hover:text-primary">
                  <span>Resep</span>
                </Link>
                <Link to="/map" className="text-lg font-medium hover:text-primary">
                  <span>Peta</span>
                </Link>

                <Link to="/analytics" className="text-lg font-medium hover:text-purple-600 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  <span>Dashboard AI</span>
                </Link>

                {isAdmin && (
                  <Link to="/supabase-data" className="text-lg font-medium hover:text-primary">
                    <span>Data Supabase</span>
                  </Link>
                )}

                {/* Login Button for Mobile (Logout is in User Menu now) */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  {/* Login/Logout for Mobile */}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    {user ? (
                      <div className="flex flex-col space-y-3">
                        <Link to="/settings" className="flex items-center gap-2 text-lg font-medium hover:text-primary">
                          <User className="h-5 w-5" />
                          <span>Settings Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                          }}
                          className="flex items-center gap-2 text-lg font-medium text-red-600 hover:text-red-700 w-full text-left"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    ) : (
                      <Link to="/login" className="flex items-center gap-2 text-lg font-medium text-black hover:text-gray-700">
                        <LogIn className="h-5 w-5" />
                        <span>Masuk</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;