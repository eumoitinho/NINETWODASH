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

    // Get reports from database
    // For now, return mock reports
    const reports = getMockReports(client);

    return NextResponse.json({
      success: true,
      data: reports,
      totalCount: reports.length
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

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
    const { type, period } = await request.json();
    
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

    // Generate new report
    const newReport = await generateReport(clientData, type, period);

    return NextResponse.json({
      success: true,
      data: newReport,
      message: 'Relatório gerado com sucesso'
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function generateReport(clientData, type, period) {
  const reportId = `report-${type}-${Date.now()}`;
  const now = new Date();
  const startDate = new Date(now);
  
  // Calculate period dates
  if (period.days) {
    startDate.setDate(now.getDate() - period.days);
  }

  const report = {
    id: reportId,
    name: `Relatório ${getReportTypeName(type)} - ${now.toLocaleDateString('pt-BR')}`,
    type: type,
    period: { 
      start: startDate.toISOString().split('T')[0], 
      end: now.toISOString().split('T')[0] 
    },
    status: 'ready',
    createdAt: now.toISOString(),
    summary: {
      totalInvestment: Math.random() * 10000 + 5000,
      totalLeads: Math.floor(Math.random() * 50 + 20),
      totalConversions: Math.floor(Math.random() * 20 + 5),
      averageCPC: Math.random() * 20 + 10,
      averageCTR: Math.random() * 3 + 0.5,
      roas: Math.random() * 2 + 1
    }
  };

  // TODO: Save report to database
  // await saveReportToDatabase(clientData._id, report);

  return report;
}

function getReportTypeName(type) {
  const types = {
    weekly: 'Semanal',
    monthly: 'Mensal',
    campaign: 'de Campanha',
    custom: 'Personalizado'
  };
  return types[type] || 'Personalizado';
}

function getMockReports(clientSlug) {
  return [
    {
      id: 'report-monthly-001',
      name: 'Relatório Mensal - Março 2024',
      type: 'monthly',
      period: { start: '2024-03-01', end: '2024-03-31' },
      status: 'ready',
      createdAt: '2024-04-01T00:00:00Z',
      summary: {
        totalInvestment: 8950.75,
        totalLeads: 42,
        totalConversions: 18,
        averageCPC: 12.45,
        averageCTR: 1.82,
        roas: 2.1
      }
    },
    {
      id: 'report-weekly-001',
      name: 'Relatório Semanal - Semana 14',
      type: 'weekly',
      period: { start: '2024-04-01', end: '2024-04-07' },
      status: 'ready',
      createdAt: '2024-04-08T00:00:00Z',
      summary: {
        totalInvestment: 2240.30,
        totalLeads: 12,
        totalConversions: 5,
        averageCPC: 14.80,
        averageCTR: 1.65,
        roas: 1.8
      }
    },
    {
      id: 'report-campaign-001',
      name: 'Relatório de Campanha - Lançamento Produto',
      type: 'campaign',
      period: { start: '2024-03-15', end: '2024-04-15' },
      status: 'ready',
      createdAt: '2024-04-16T00:00:00Z',
      summary: {
        totalInvestment: 5680.90,
        totalLeads: 28,
        totalConversions: 14,
        averageCPC: 11.20,
        averageCTR: 2.10,
        roas: 2.4
      }
    },
    {
      id: 'report-custom-001',
      name: 'Análise Personalizada - ROI por Plataforma',
      type: 'custom',
      period: { start: '2024-01-01', end: '2024-03-31' },
      status: 'processing',
      createdAt: '2024-04-15T00:00:00Z',
      summary: null
    }
  ];
}