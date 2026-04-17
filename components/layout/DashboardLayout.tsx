"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Logo from '@/components/shared/Logo'
import { LayoutDashboard, Users, UserCircle, LogOut, Menu, X, Settings, Briefcase, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'admin' | 'staff' | 'user' | 'co_admin'
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const menuItems = {
    admin: [
      { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
      { label: 'Lead CRM', icon: Users, path: '/admin/leads' },
      { label: 'Service Tickets', icon: Settings, path: '/admin/service' },
      { label: 'Notifications', icon: Activity, path: '/admin/notifications' },
    ],
    user: [
      { label: 'My Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Energy Savings', icon: Activity, path: '/dashboard/savings' },
      { label: 'Service Requests', icon: Settings, path: '/dashboard/service' },
      { label: 'Profile', icon: UserCircle, path: '/dashboard/profile' },
    ],
    staff: [
      { label: 'Job List', icon: Briefcase, path: '/staff' },
      { label: 'Active Tasks', icon: Activity, path: '/staff/tasks' },
      { label: 'My Profile', icon: UserCircle, path: '/staff/profile' },
    ],
    co_admin: [
       { label: 'Operations', icon: LayoutDashboard, path: '/co-admin' },
       { label: 'Leads', icon: Users, path: '/co-admin/leads' },
    ]
  }

  const currentMenu = menuItems[role] || menuItems.user
  const isAgent = ['admin', 'staff', 'co_admin'].includes(role)

  return (
    <div className={`min-h-screen flex overflow-hidden ${isAgent ? 'bg-[#020617] text-slate-100 selection:bg-primary-500/30' : 'bg-[#070b14] text-white'}`}>
      
      {/* Background Decor for Admin */}
      {isAgent && <div className="absolute inset-0 bg-[linear-gradient(to_right,#fbbf2405_1px,transparent_1px),linear-gradient(to_bottom,#fbbf2405_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />}

      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col w-72 border-r shrink-0 relative z-20 ${isAgent ? 'bg-[#0a0f1c] border-primary-500/10 shadow-[4px_0_24px_rgba(251,191,36,0.02)]' : 'border-white/5 bg-[#0a0f1c]/50 backdrop-blur-xl'}`}>
        <div className="p-8">
          <Logo size="sm" />
          <div className={`mt-8 px-3 py-1 border rounded-full inline-block ${isAgent ? 'bg-primary-500/10 border-primary-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isAgent ? 'text-primary-400' : 'text-emerald-400'}`}>
               {role.replace('_', ' ')} Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {currentMenu.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
                  isActive 
                    ? (isAgent ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20')
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top bar (Mobile Header) */}
        <header className={`lg:hidden flex items-center justify-between p-4 border-b relative z-20 ${isAgent ? 'bg-[#0a0f1c] border-primary-500/10' : 'bg-[#0a0f1c] border-white/10'}`}>
          <Logo size="sm" />
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile Slide-over Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0a0f1c] p-6 animate-slide-in-left" onClick={e => e.stopPropagation()}>
               {/* Mobile sidebar content same as desktop but simpler */}
               <Logo size="sm" className="mb-8" />
               <nav className="space-y-4">
                  {currentMenu.map((item) => (
                    <Link key={item.path} href={item.path} className="flex items-center gap-3 text-slate-300 font-bold p-2">{item.label}</Link>
                  ))}
                  <button onClick={handleSignOut} className="flex items-center gap-3 text-red-400 font-bold p-2 mt-8"><LogOut size={20} /> Sign Out</button>
               </nav>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          {children}
        </div>
      </main>
    </div>
  )
}
