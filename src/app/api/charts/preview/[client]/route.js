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

    // Generate preview data - same as chart data but smaller sample
    const previewData = await generatePreviewData(clientData, metrics, period, groupBy, filters);

    return NextResponse.json({
      success: true,
      data: previewData
    });

  } catch (error) {
    console.error('Error generating preview data:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function generatePreviewData(clientData, metrics, period, groupBy, filters) {
  // For preview, limit to last 15 days max
  const days = Math.min(period === '7d' ? 7 : period === '30d' ? 15 : 15, 15);
  const data = [];
  
  // Base values for different metrics (simulated with some variation for preview)
  const metricBase = {
    impressions: { base: 850, variance: 400 },
    clicks: { base: 45, variance: 20 },
    cost: { base: 420, variance: 180 },
    conversions: { base: 8, variance: 4 },
    ctr: { base: 1.8, variance: 0.8 },
    cpc: { base: 12, variance: 6 },
    cpm: { base: 22, variance: 8 },
    sessions: { base: 680, variance: 250 },
    users: { base: 510, variance: 180 },
    pageviews: { base: 1200, variance: 500 },
    bounceRate: { base: 42, variance: 12 },
    roas: { base: 2.2, variance: 0.8 }
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

    // Generate realistic preview data
    metrics.forEach(metricId => {
      const config = metricBase[metricId];
      if (config) {
        // Slight variation for preview
        const value = Math.max(0, config.base + (Math.random() - 0.5) * config.variance);
        entry[metricId] = Math.round(value * 100) / 100;
      }
    });

    data.push(entry);
  }

  return data;
}