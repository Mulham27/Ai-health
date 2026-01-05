"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { Heart, BookOpen, BarChart3, Users, Menu, X, User, LogOut, Settings, Home } from "lucide-react";
import { useHealthStore } from "../../lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, clearStore } = useHealthStore();
    const location = useLocation();

    const navigation = [
        { name: "Home", href: "/", icon: Home },
        { name: "Journal", href: "/journal", icon: BookOpen },
        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { name: "Community", href: "/community", icon: Users },
    ];

    const isActive = (href: string) => {
        const path = location.pathname;
        if (href === "/") return path === "/";
        return path.startsWith(href);
    };

    const handleLogout = () => {
        clearStore();
        localStorage.removeItem("auth-token");
        setIsOpen(false);
    };

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                HealthAI
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        active
                                            ? "text-primary bg-primary/10 shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2 h-10 px-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{user.name || "User"}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/settings" className="flex items-center cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/login">Sign In</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link to="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="h-10 w-10 p-0">
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                    <div className="h-full flex flex-col">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    HealthAI
                                </span>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-10 w-10 p-0">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Mobile Navigation Items */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                            active
                                                ? "text-primary bg-primary/10 shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${active ? "bg-primary/20" : "bg-muted"}`}>
                                            <Icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
                                        </div>
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile User Section */}
                        <div className="border-t border-border p-4 space-y-3 bg-muted/30">
                            {user ? (
                                <>
                                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-card">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/settings"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-foreground hover:bg-accent transition-colors w-full"
                                    >
                                        <div className="p-2 rounded-lg bg-muted">
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <span>Settings</span>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={handleLogout}
                                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <div className="p-2 rounded-lg bg-muted mr-3">
                                            <LogOut className="w-5 h-5" />
                                        </div>
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Button variant="outline" size="lg" className="w-full" asChild>
                                        <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                                    </Button>
                                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600" asChild>
                                        <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
