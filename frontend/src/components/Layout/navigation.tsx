"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { Heart, BookOpen, BarChart3, Users, Menu, X, User, LogOut } from "lucide-react";
import { useHealthStore } from "../../lib/store";

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, clearStore } = useHealthStore();

    const navigation = [
        { name: "Home", href: "/", icon: Heart },
        { name: "Journal", href: "/journal", icon: BookOpen },
        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { name: "Community", href: "/community", icon: Users },
    ];

    const handleLogout = () => {
        clearStore();
        localStorage.removeItem("auth-token");
    };

    return (
        <nav className="bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 health-gradient rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground">HealthAI</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        window.location.hash.slice(1) === item.href
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-foreground">{user.name}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
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
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                                        window.location.hash.slice(1) === item.href
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        {user ? (
                            <div className="pt-4 border-t border-border">
                                <div className="px-3 py-2 text-sm text-muted-foreground">Signed in as {user.name}</div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-border space-y-2">
                                <Button variant="ghost" size="sm" className="w-full" asChild>
                                    <Link to="/login">Sign In</Link>
                                </Button>
                                <Button size="sm" className="w-full" asChild>
                                    <Link to="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}