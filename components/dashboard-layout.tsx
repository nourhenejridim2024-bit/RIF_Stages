'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { mockNotifications } from '@/lib/mock-data'
import {
  Building2,
  LayoutDashboard,
  FileText,
  FileCheck,
  ClipboardList,
  Users,
  UserPlus,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Award,
  BarChart3,
  Shield,
} from 'lucide-react'
import type { UserRole } from '@/lib/types'

interface NavItem {
  label: string
  href: string
  icon: typeof LayoutDashboard
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  stagiaire: [
    { label: 'Tableau de bord', href: '/stagiaire', icon: LayoutDashboard },
    { label: 'Ma candidature', href: '/stagiaire/candidature', icon: FileText },
    { label: 'Convention', href: '/stagiaire/convention', icon: FileCheck },
    { label: 'Onboarding', href: '/stagiaire/onboarding', icon: ClipboardList },
    { label: 'Évaluation', href: '/stagiaire/evaluation', icon: Award },
  ],
  tuteur: [
    { label: 'Tableau de bord', href: '/tuteur', icon: LayoutDashboard },
    { label: 'Mes stagiaires', href: '/tuteur/stagiaires', icon: Users },
    { label: 'Onboarding', href: '/tuteur/onboarding', icon: ClipboardList },
    { label: 'Évaluations', href: '/tuteur/evaluations', icon: Award },
  ],
  rh: [
    { label: 'Tableau de bord', href: '/rh', icon: LayoutDashboard },
    { label: 'Candidatures', href: '/rh/candidatures', icon: FileText },
    { label: 'Analyse CV', href: '/rh/candidatures-analyse', icon: BarChart3 },
    { label: 'Conventions', href: '/rh/conventions', icon: FileCheck },
    { label: 'Utilisateurs', href: '/rh/utilisateurs', icon: Users },
  ],
  admin: [
    { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
    { label: 'Candidats acceptes', href: '/admin/candidats', icon: UserPlus },
    { label: 'Universités', href: '/admin/universites', icon: Building2 },
    { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
    { label: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
    { label: 'Parametres', href: '/admin/parametres', icon: Settings },
    { label: 'Logs', href: '/admin/logs', icon: BarChart3 },
  ],
  universite: [
    { label: 'Tableau de bord', href: '/universite', icon: LayoutDashboard },
    { label: 'Stagiaires', href: '/universite/stagiaires', icon: Users },
    { label: 'Conventions', href: '/universite/conventions', icon: FileText },
    { label: 'Rapports', href: '/universite/rapports', icon: BarChart3 },
  ],
  ecole: [
    { label: 'Tableau de bord', href: '/ecole', icon: LayoutDashboard },
    { label: 'Stagiaires', href: '/ecole/stagiaires', icon: Users },
  ],
}

const roleLabels: Record<UserRole, string> = {
  stagiaire: 'Stagiaire',
  tuteur: 'Tuteur',
  rh: 'Ressources Humaines',
  admin: 'Administrateur',
  universite: 'Université',
  ecole: 'École',
}

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) {
    return null
  }

  const navItems = navItemsByRole[user.role]
  const notifications = mockNotifications.filter(n => n.userId === user.id && !n.lu)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getInitials = () => {
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-7 w-7 text-sidebar-primary" />
              <span className="font-semibold text-lg">RIF-Stages</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Fermer le menu</span>
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== `/${user.role}` && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {roleLabels[user.role]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <Badge
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        variant="destructive"
                      >
                        {notifications.length}
                      </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Aucune nouvelle notification
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <DropdownMenuItem key={notif.id} className="p-3 cursor-pointer">
                        <div>
                          <p className="text-sm">{notif.contenu}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.date}</p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block text-sm font-medium">
                      {user.prenom}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p>{user.prenom} {user.nom}</p>
                      <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
