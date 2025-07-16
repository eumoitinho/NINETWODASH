import { NextResponse } from 'next/server';
import { connectToDatabase, findClientBySlug } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { client } = await params;
    const { metrics, period, groupBy, filters } = await request.json();
    
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

    // Generate chart data based on metrics
    const chartData = await generateChartData(clientData, metrics, period, groupBy, filters);

    return NextResponse.json({
      success: true,
      data: chartData
    });

  } catch (error) {
    console.error('Error generating chart data:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function generateChartData(clientData, metrics, period, groupBy, filters) {
  // Calculate date range
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const data = [];
  
  // Base values for different metrics (simulated)
  const metricBase = {
    impressions: { base: 1000, variance: 500 },
    clicks: { base: 50, variance: 25 },
    cost: { base: 500, variance: 200 },
    conversions: { base: 10, variance: 5 },
    ctr: { base: 2.0, variance: 1.0 },
    cpc: { base: 15, variance: 8 },
    cpm: { base: 25, variance: 10 },
    sessions: { base: 800, variance: 300 },
    users: { base: 600, variance: 200 },
    pageviews: { base: 1500, variance: 600 },
    bounceRate: { base: 45, variance: 15 },
    roas: { base: 2.5, variance: 1.0 }
  };

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const entry = {
      date: date.toISOString().split('T')[0],
      formattedDate: date.toLocaleDateString('pt-BR', { 
        month: 'short', 
        day: 'numeric' 
      })
    };

    // Generate realistic data for each metric
    metrics.forEach(metricId => {
      const config = metricBase[metricId];
      if (config) {
        // Add some trending and seasonality
        const trend = (days - i) * 0.01; // Small upward trend
        const seasonality = Math.sin((i / 7) * Math.PI * 2) * 0.1; // Weekly pattern
        const random = (Math.random() - 0.5) * 0.3; // Random variation
        
        const multiplier = 1 + trend + seasonality + random;
        const value = Math.max(0, config.base + (Math.random() - 0.5) * config.variance * multiplier);
        
        entry[metricId] = Math.round(value * 100) / 100; // Round to 2 decimals
      }
    });

    data.push(entry);
  }

  return data;
}