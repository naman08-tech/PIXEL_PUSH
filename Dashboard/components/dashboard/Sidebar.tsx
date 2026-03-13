"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  History,
  FileText,
  Phone,
  ChevronLeft,
  ChevronRight,
  Activity,
  AlertTriangle,
  Zap,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Agent {
  name: string;
  status: "active" | "inactive";
  icon: React.ReactNode;
}

const agents: Agent[] = [
  { name: "Vitals Monitor Agent", status: "active", icon: <Activity className="w-4 h-4" /> },
  { name: "Risk Assessment Agent", status: "active", icon: <AlertTriangle className="w-4 h-4" /> },
  { name: "Emergency Response Agent", status: "active", icon: <Zap className="w-4 h-4" /> },
];

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "History", icon: History, active: false },
  { name: "Reports", icon: FileText, active: false },
  { name: "Emergency Contacts", icon: Phone, active: false },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0D1424] border-r border-border transition-all duration-300 z-40 flex flex-col",
        isCollapsed ? "w-16" : "w-[220px]"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-[#1E293B] border border-border rounded-full flex items-center justify-center hover:bg-[#00F5FF] hover:text-[#0A0F1E] transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Patient Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1E293B] border-2 border-[#00F5FF] flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-[#00F5FF]" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h3 className="font-semibold text-foreground truncate">John Doe</h3>
              <p className="text-xs text-muted-foreground">Age 45</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#1E293B] rounded-md p-2">
              <span className="text-muted-foreground">Blood</span>
              <p className="text-foreground font-semibold">B+</p>
            </div>
            <div className="bg-[#1E293B] rounded-md p-2">
              <span className="text-muted-foreground">Weight</span>
              <p className="text-foreground font-semibold">72kg</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              item.active
                ? "bg-[#00F5FF]/10 text-[#00F5FF] border-l-2 border-[#00F5FF]"
                : "text-muted-foreground hover:bg-[#1E293B] hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="text-sm">{item.name}</span>}
          </button>
        ))}
      </nav>

      {/* Agent Status Panel */}
      <div className="p-4 border-t border-border">
        {!isCollapsed && (
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            Agent Status
          </h4>
        )}
        <div className="space-y-2">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg bg-[#1E293B]",
                isCollapsed && "justify-center"
              )}
            >
              <div
                className={cn(
                  "shrink-0",
                  agent.status === "active" ? "text-[#00FF88]" : "text-[#FF4444]"
                )}
              >
                {agent.icon}
              </div>
              {!isCollapsed && (
                <>
                  <span className="text-xs text-foreground flex-1 truncate">
                    {agent.name.replace(" Agent", "")}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                      agent.status === "active"
                        ? "bg-[#00FF88]/20 text-[#00FF88]"
                        : "bg-[#FF4444]/20 text-[#FF4444]"
                    )}
                  >
                    {agent.status === "active" ? "Active" : "Inactive"}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
