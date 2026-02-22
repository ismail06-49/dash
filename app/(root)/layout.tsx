"use client";

import Image from "next/image";
import Logo from "@/public/logo.png";
import { LayoutDashboard, Plus, FileText, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";

export default function HomeLayout({
    children,
    }: Readonly<{
    children: React.ReactNode;
    }>) {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard" },
        { icon: Plus, label: "Add Record" },
        { icon: FileText, label: "Records" },
        { icon: BarChart3, label: "Reports" },
    ];

    return (
        <div className="flex h-screen">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden fixed top-4 left-4 ${isOpen ? 'bg-transparent text-transparent' : 'bg-sidebar text-sidebar-foreground'} z-50 p-2 rounded-lg`}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <nav className={`fixed md:relative top-0 left-0 h-screen md:h-auto w-3/4 md:w-1/4 bg-sidebar text-sidebar-foreground p-6 overflow-y-auto border-r border-sidebar-border transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} z-40`}>
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <Image src={Logo} alt="Logo" className="aspect-square w-12" />
                        <h1 className="text-2xl font-bold sm:block">Poultry Tracker</h1>
                    </div>
                </div>
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-all duration-200">
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto w-full md:w-3/4">{children}</div>
        </div>
    );
    }
