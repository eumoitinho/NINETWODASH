"use client"

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface ClientAnalytics {
  client: {
    id: string
    name: string
    slug: string
  }
  summary: {
    totalImpressions: number
    totalClicks: number
    totalCost: number
    totalConversions: number
    ctr: number
    cpc: number
    cpm: number
  }
  campaigns: Array<{
    platform: string
    campaignName: string
    impressions: number
    clicks: number
    cost: number
    conversions: number
  }>
}

export default function ClientPortalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const [analytics, setAnalytics] = useState<ClientAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    // Verificar se é cliente e se tem acesso ao slug correto
    if (session.user.role === 'client' && session.user.clientSlug !== slug) {
      router.push(`/portal/${session.user.clientSlug}`)
      return
    }

    // Carregar dados do cliente
    const fetchClientData = async () => {
      try {
        const response = await fetch(`/api/dashboard/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data.data)
        } else {
          setError('Erro ao carregar dados do cliente')
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setError('Erro de conexão')
      } finally {
        setLoading(false)
      }
    }

    fetchClientData()
  }, [session, status, router, slug])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">
            <img 
              src="/ninetwo-logo.png" 
              alt="NINETWODASH" 
              className="h-16 mx-auto"
            />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h5 className="text-xl font-semibold mb-2">NINETWODASH</h5>
          <p className="text-muted-foreground">Carregando dados do cliente...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">
            <img 
              src="/ninetwo-logo.png" 
              alt="NINETWODASH" 
              className="h-16 mx-auto"
            />
          </div>
          <h5 className="text-xl font-semibold mb-2 text-red-600">Erro</h5>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!session || !analytics) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-2">{analytics.client.name}</h1>
                <p className="text-muted-foreground mb-6">Portal do Cliente - Analytics e Performance</p>
              </div>
              <SectionCards data={analytics} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={analytics} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}