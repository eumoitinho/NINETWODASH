import { NextRequest, NextResponse } from 'next/server';
import { createFacebookAdsClient, getFacebookDateRange } from '@/lib/facebook-ads';
import { withCache, generateCacheKey } from '@/lib/cache';
import { connectToDatabase, Client } from '@/lib/mongodb';
import type { APIResponse, CampaignMetrics, Campaign } from '@/types/dashboard';

/**
 * GET /api/facebook-ads/[client]
 * Fetch Facebook Marketing API data for a specific client
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ client: string }> }
): Promise<NextResponse> {
  try {
    const { client } = await params;
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const period = (searchParams.get('period') as '7d' | '30d' | '90d') || '30d';
    const type = searchParams.get('type') || 'summary'; // 'summary' | 'campaigns' | 'insights' | 'creatives'
    const useCache = searchParams.get('cache') !== 'false';

    // Connect to database and get client configuration
    await connectToDatabase();
    const clientData = await (Client as any).findOne({ slug: client });
    
    if (!clientData) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Client '${client}' not found`,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Check if Facebook Ads is configured for this client
    if (!clientData.facebookAds?.accountId) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'FACEBOOK_ADS_NOT_CONFIGURED',
        message: `Facebook Ads not configured for client '${client}'`,
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Check if mock data is enabled
    const useMockData = process.env.USE_MOCK_DATA === 'true';
    if (useMockData) {
      return NextResponse.json<APIResponse<any>>({
        success: true,
        data: getMockData(client, type, period),
        message: 'Mock data returned (USE_MOCK_DATA=true)',
        timestamp: new Date().toISOString(),
      });
    }

    // Validate API configuration
    if (!process.env.FACEBOOK_APP_ID || 
        !process.env.FACEBOOK_APP_SECRET || 
        !process.env.FACEBOOK_ACCESS_TOKEN) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'FACEBOOK_ADS_CONFIG_MISSING',
        message: 'Facebook Marketing API configuration is incomplete',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    // Get date range
    const dateRange = getFacebookDateRange(period);
    
    // Create Facebook Ads client
    const facebookAdsClient = createFacebookAdsClient(
      clientData.facebookAds.accountId, 
      clientData.facebookAds.pixelId
    );

    // Generate cache key
    const cacheKey = generateCacheKey('campaign', client, { 
      type, 
      period, 
      from: dateRange.from, 
      to: dateRange.to,
      platform: 'facebook'
    });

    // Define fetch function based on type
    const fetchData = async () => {
      switch (type) {
        case 'campaigns':
          return await facebookAdsClient.getCampaignData(dateRange.from, dateRange.to);
        case 'insights':
          return await facebookAdsClient.getAdAccountInsights(dateRange.from, dateRange.to);
        case 'creatives':
          return await facebookAdsClient.getAdCreativesData(dateRange.from, dateRange.to);
        case 'pixel':
          return await facebookAdsClient.getPixelData(dateRange.from, dateRange.to);
        default:
          return await facebookAdsClient.getSummaryMetrics(dateRange.from, dateRange.to);
      }
    };

    // Fetch data with cache
    let data;
    if (useCache) {
      data = await withCache('campaign', cacheKey, fetchData);
    } else {
      data = await fetchData();
    }

    return NextResponse.json<APIResponse<CampaignMetrics | Campaign[] | any>>({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    const { client } = await params;
    console.error(`Error fetching Facebook Ads data for client ${client}:`, error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error.code || 'FACEBOOK_ADS_API_ERROR',
      message: error.message || 'Failed to fetch Facebook Ads data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * POST /api/facebook-ads/[client]/test-connection
 * Test Facebook Marketing API connection for a specific client
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ client: string }> }
): Promise<NextResponse> {
  try {
    const { client } = await params;
    
    // Connect to database and get client configuration
    await connectToDatabase();
    const clientData = await (Client as any).findOne({ slug: client });
    
    if (!clientData) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Client '${client}' not found`,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Check if Facebook Ads is configured for this client
    if (!clientData.facebookAds?.accountId) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'FACEBOOK_ADS_NOT_CONFIGURED',
        message: `Facebook Ads not configured for client '${client}'`,
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Create Facebook Ads client and test connection
    const facebookAdsClient = createFacebookAdsClient(
      clientData.facebookAds.accountId, 
      clientData.facebookAds.pixelId
    );
    const isConnected = await facebookAdsClient.testConnection();

    // Update connection status in database
    await (Client as any).updateOne(
      { slug: client },
      { 
        $set: { 
          'facebookAds.connected': isConnected,
          'facebookAds.lastSync': isConnected ? new Date() : null,
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json<APIResponse<{ connected: boolean }>>({
      success: true,
      data: { connected: isConnected },
      message: isConnected ? 'Facebook Ads connection successful' : 'Facebook Ads connection failed',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    const { client } = await params;
    console.error(`Error testing Facebook Ads connection for client ${client}:`, error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'CONNECTION_TEST_FAILED',
      message: error.message || 'Failed to test Facebook Ads connection',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * Generate mock data for development
 */
function getMockData(client: string, type: string, period: '7d' | '30d' | '90d') {
  const baseMetrics = {
    impressions: 12000,
    clicks: 380,
    cost: 1800,
    conversions: 28,
    ctr: 3.17,
    cpc: 4.74,
    cpm: 150.00,
    conversionRate: 7.37,
    roas: 1.56,
  };

  if (type === 'campaigns') {
    return [
      {
        campaignId: 'facebook_campaign_1',
        campaignName: `${client} - Facebook Feed Campaign`,
        platform: 'facebook',
        status: 'active',
        date: new Date().toISOString().split('T')[0],
        metrics: { ...baseMetrics, impressions: 7000, clicks: 220, cost: 1100 },
      },
      {
        campaignId: 'facebook_campaign_2',
        campaignName: `${client} - Instagram Stories Campaign`,
        platform: 'facebook',
        status: 'active',
        date: new Date().toISOString().split('T')[0],
        metrics: { ...baseMetrics, impressions: 5000, clicks: 160, cost: 700 },
      },
    ];
  }

  if (type === 'insights') {
    return [
      {
        device_platform: 'mobile',
        ...baseMetrics,
        impressions: 8000,
        clicks: 250,
        cost: 1200,
      },
      {
        device_platform: 'desktop',
        ...baseMetrics,
        impressions: 4000,
        clicks: 130,
        cost: 600,
      },
    ];
  }

  if (type === 'creatives') {
    return [
      {
        id: 'creative_1',
        name: `${client} - Creative A`,
        insights: {
          data: [{ ...baseMetrics, impressions: 6000, clicks: 190, cost: 900 }]
        }
      },
      {
        id: 'creative_2',
        name: `${client} - Creative B`,
        insights: {
          data: [{ ...baseMetrics, impressions: 6000, clicks: 190, cost: 900 }]
        }
      },
    ];
  }

  return baseMetrics;
}