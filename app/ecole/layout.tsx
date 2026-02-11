'use client'

import React from "react"

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function EcoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'ecole') {
      router.push('/')
    }
  }, [user, router])

  if (!user || user.role !== 'ecole') {
    return null
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>
}
