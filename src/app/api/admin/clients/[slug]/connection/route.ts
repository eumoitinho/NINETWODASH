import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { APIResponse } from '@/types/dashboard';

/**
 * POST /api/admin/clients/[slug]/connection
 * Update platform connection status
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await request.json();
    const { platform, connected, lastSync, connectionData } = body;

    // Validate platform
    if (!['googleAds', 'facebookAds', 'googleAnalytics'].includes(platform)) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'INVALID_PLATFORM',
        message: 'Plataforma inválida',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { slug }
    });

    if (!existingClient) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: 'Cliente não encontrado',
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Prepare update data based on platform
    let updateData: any = {};
    
    if (platform === 'googleAds') {
      updateData = {
        googleAdsConnected: connected,
        googleAdsLastSync: connected ? new Date(lastSync) : null,
        ...(connectionData?.customerId && { googleAdsCustomerId: connectionData.customerId }),
        ...(connectionData?.managerId && { googleAdsManagerId: connectionData.managerId }),
      };
    } else if (platform === 'facebookAds') {
      updateData = {
        facebookAdsConnected: connected,
        facebookAdsLastSync: connected ? new Date(lastSync) : null,
        ...(connectionData?.accountId && { facebookAdsAccountId: connectionData.accountId }),
        ...(connectionData?.pixelId && { facebookPixelId: connectionData.pixelId }),
      };
    } else if (platform === 'googleAnalytics') {
      updateData = {
        googleAnalyticsConnected: connected,
        googleAnalyticsLastSync: connected ? new Date(lastSync) : null,
        ...(connectionData?.propertyId && { googleAnalyticsPropertyId: connectionData.propertyId }),
      };
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json<APIResponse<any>>({
      success: true,
      data: updatedClient,
      message: `Conexão ${platform} atualizada com sucesso`,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao atualizar conexão:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'UPDATE_CONNECTION_ERROR',
      message: error.message || 'Erro ao atualizar conexão',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}