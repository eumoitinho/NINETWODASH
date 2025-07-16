import { NextResponse } from 'next/server';
import { connectToDatabase, findClientBySlug } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { client } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    
    // Connect to database
    await connectToDatabase();
    
    // Find client by slug
    const clientData = await findClientBySlug(client);
    if (!clientData) {
      return NextResponse.json(
        { success: false, message: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Check if user has access to this client
    if (session.user.role !== 'admin' && session.user.clientSlug !== client) {
      return NextResponse.json(
        { success: false, message: 'Acesso negado a este cliente' },
        { status: 403 }
      );
    }

    // Check if Google Analytics is connected
    if (!clientData.googleAnalytics?.connected) {
      return NextResponse.json({
        success: true,
        data: getMockAnalyticsData(period),
        message: 'Google Analytics não conectado. Dados de demonstração.'
      });
    }

    // If connected, fetch real Google Analytics data
    try {
      const analyticsData = await fetchGoogleAnalyticsData(clientData, period);
      return NextResponse.json({
        success: true,
        data: analyticsData,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching Google Analytics data:', error);
      return NextResponse.json({
        success: true,
        data: getMockAnalyticsData(period),
        message: 'Erro ao buscar dados do Google Analytics. Dados de demonstração.'
      });
    }

  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function fetchGoogleAnalyticsData(clientData, period) {
  // TODO: Implement real Google Analytics 4 Data API integration
  // For now, return enhanced mock data
  return getMockAnalyticsData(period);
}

function getMockAnalyticsData(period) {
  // Calculate multiplier based on period
  const multiplier = period === '7d' ? 0.25 : period === '30d' ? 1 : 3;
  
  return {
    overview: {
      sessions: Math.floor(4820 * multiplier),
      users: Math.floor(3567 * multiplier),
      pageviews: Math.floor(12845 * multiplier),
      bounceRate: 58.3,
      avgSessionDuration: 185, // seconds
      conversions: Math.floor(42 * multiplier),
      conversionRate: 1.18,
      revenue: 8950.75 * multiplier
    },
    topPages: [
      { 
        page: '/produtos/categoria-a', 
        views: Math.floor(2340 * multiplier), 
        users: Math.floor(1890 * multiplier), 
        avgTime: 145 
      },
      { 
        page: '/landing-page-campanha', 
        views: Math.floor(1876 * multiplier), 
        users: Math.floor(1654 * multiplier), 
        avgTime: 220 
      },
      { 
        page: '/sobre-nos', 
        views: Math.floor(1234 * multiplier), 
        users: Math.floor(1001 * multiplier), 
        avgTime: 95 
      },
      { 
        page: '/contato', 
        views: Math.floor(987 * multiplier), 
        users: Math.floor(856 * multiplier), 
        avgTime: 78 
      },
      { 
        page: '/servicos', 
        views: Math.floor(745 * multiplier), 
        users: Math.floor(634 * multiplier), 
        avgTime: 165 
      }
    ],
    trafficSources: [
      { source: 'Google Ads', sessions: Math.floor(1820 * multiplier), percentage: 37.8 },
      { source: 'Facebook Ads', sessions: Math.floor(1156 * multiplier), percentage: 24.0 },
      { source: 'Busca Orgânica', sessions: Math.floor(965 * multiplier), percentage: 20.0 },
      { source: 'Direto', sessions: Math.floor(578 * multiplier), percentage: 12.0 },
      { source: 'Referência', sessions: Math.floor(301 * multiplier), percentage: 6.2 }
    ],
    demographics: {
      age: [
        { range: '18-24', percentage: 15.2 },
        { range: '25-34', percentage: 32.8 },
        { range: '35-44', percentage: 28.5 },
        { range: '45-54', percentage: 16.1 },
        { range: '55+', percentage: 7.4 }
      ],
      gender: [
        { gender: 'Feminino', percentage: 54.3 },
        { gender: 'Masculino', percentage: 45.7 }
      ]
    },
    devices: [
      { device: 'Mobile', sessions: Math.floor(2652 * multiplier), percentage: 55.0 },
      { device: 'Desktop', sessions: Math.floor(1735 * multiplier), percentage: 36.0 },
      { device: 'Tablet', sessions: Math.floor(433 * multiplier), percentage: 9.0 }
    ],
    goals: [
      { name: 'Formulário de Contato', completions: Math.floor(28 * multiplier), value: 150.0 },
      { name: 'Newsletter Signup', completions: Math.floor(67 * multiplier), value: 25.0 },
      { name: 'Download Material', completions: Math.floor(45 * multiplier), value: 50.0 },
      { name: 'Compra Online', completions: Math.floor(12 * multiplier), value: 245.0 }
    ]
  };
}