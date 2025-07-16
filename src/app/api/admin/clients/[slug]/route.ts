import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { APIResponse } from '@/types/dashboard';

/**
 * GET /api/admin/clients/[slug]
 * Get a single client by slug
 */
export async function GET(
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

    const client = await prisma.client.findUnique({
      where: { slug },
      include: {
        clientTags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!client) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: 'Cliente não encontrado',
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Return client data with proper structure
    const clientData = {
      ...client,
      tags: client.clientTags.map(ct => ct.tag.name),
      portalSettings: {
        logoUrl: client.logoUrl,
        primaryColor: client.primaryColor,
        secondaryColor: client.secondaryColor,
        allowedSections: client.allowedSections,
        customDomain: client.customDomain,
      },
      googleAds: {
        connected: client.googleAdsConnected,
        customerId: client.googleAdsCustomerId,
        managerId: client.googleAdsManagerId,
        lastSync: client.googleAdsLastSync,
      },
      facebookAds: {
        connected: client.facebookAdsConnected,
        accountId: client.facebookAdsAccountId,
        pixelId: client.facebookPixelId,
        lastSync: client.facebookAdsLastSync,
      },
      googleAnalytics: {
        connected: client.googleAnalyticsConnected,
        propertyId: client.googleAnalyticsPropertyId,
        lastSync: client.googleAnalyticsLastSync,
      }
    };

    return NextResponse.json<APIResponse<any>>({
      success: true,
      data: clientData,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'FETCH_CLIENT_ERROR',
      message: error.message || 'Erro ao buscar cliente',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * PUT /api/admin/clients/[slug]
 * Update a client by slug
 */
export async function PUT(
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

    // Update client data
    const updatedClient = await prisma.client.update({
      where: { slug },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        status: body.status,
        monthlyBudget: body.monthlyBudget,
        avatar: body.avatar,
        tags: body.tags || [],
        
        // Portal settings
        logoUrl: body.portalSettings?.logoUrl,
        primaryColor: body.portalSettings?.primaryColor,
        secondaryColor: body.portalSettings?.secondaryColor,
        allowedSections: body.portalSettings?.allowedSections,
        customDomain: body.portalSettings?.customDomain,
        
        // Google Ads
        googleAdsConnected: body.googleAds?.connected,
        googleAdsCustomerId: body.googleAds?.customerId,
        googleAdsManagerId: body.googleAds?.managerId,
        googleAdsLastSync: body.googleAds?.connected ? new Date() : existingClient.googleAdsLastSync,
        
        // Facebook Ads
        facebookAdsConnected: body.facebookAds?.connected,
        facebookAdsAccountId: body.facebookAds?.accountId,
        facebookPixelId: body.facebookAds?.pixelId,
        facebookAdsLastSync: body.facebookAds?.connected ? new Date() : existingClient.facebookAdsLastSync,
        
        // Google Analytics
        googleAnalyticsConnected: body.googleAnalytics?.connected,
        googleAnalyticsPropertyId: body.googleAnalytics?.propertyId,
        googleAnalyticsLastSync: body.googleAnalytics?.connected ? new Date() : existingClient.googleAnalyticsLastSync,
      }
    });

    return NextResponse.json<APIResponse<any>>({
      success: true,
      data: updatedClient,
      message: 'Cliente atualizado com sucesso',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'UPDATE_CLIENT_ERROR',
      message: error.message || 'Erro ao atualizar cliente',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/clients/[slug]
 * Delete a client by slug
 */
export async function DELETE(
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

    // Delete client
    await prisma.client.delete({
      where: { slug }
    });

    return NextResponse.json<APIResponse<null>>({
      success: true,
      message: 'Cliente removido com sucesso',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao remover cliente:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'DELETE_CLIENT_ERROR',
      message: error.message || 'Erro ao remover cliente',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}