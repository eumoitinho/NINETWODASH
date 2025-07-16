import { NextRequest, NextResponse } from 'next/server';
import { createGoogleAdsClient, getDateRange } from '@/lib/google-ads';
import { withCache, generateCacheKey } from '@/lib/cache';
import type { APIResponse, CampaignMetrics, Campaign } from '@/types/dashboard';

// Client ID to Google Ads Customer ID mapping
const CLIENT_GOOGLE_ADS_MAPPING: Record<string, string> = {
  'catalisti-holding': process.env.GOOGLE_ADS_CATALISTI_ID || '',
  'abc-evo': process.env.GOOGLE_ADS_ABC_EVO_ID || '',
  'dr-victor-mauro': process.env.GOOGLE_ADS_DR_VICTOR_MAURO_ID || '',
  'dr-percio': process.env.GOOGLE_ADS_DR_PERCIO_ID || '',
  'cwtrends': process.env.GOOGLE_ADS_CWTRENDS_ID || '',
  'global-best-part': process.env.GOOGLE_ADS_GLOBAL_BEST_PART_ID || '',
  'lj-santos': process.env.GOOGLE_ADS_LJ_SANTOS_ID || '',
  'favretto-midia-exterior': process.env.GOOGLE_ADS_FAVRETTO_MIDIA_ID || '',
  'favretto-comunicacao-visual': process.env.GOOGLE_ADS_FAVRETTO_COMUNICACAO_ID || '',
  'mundial': process.env.GOOGLE_ADS_MUNDIAL_ID || '',
  'naframe': process.env.GOOGLE_ADS_NAFRAME_ID || '',
  'motin-films': process.env.GOOGLE_ADS_MOTIN_FILMS_ID || '',
  'naport': process.env.GOOGLE_ADS_NAPORT_ID || '',
  'autoconnect-prime': process.env.GOOGLE_ADS_AUTOCONNECT_PRIME_ID || '',
  'vtelco-networks': process.env.GOOGLE_ADS_VTELCO_NETWORKS_ID || '',
  'amitech': process.env.GOOGLE_ADS_AMITECH_ID || '',
  'hogrefe-construtora': process.env.GOOGLE_ADS_HOGREFE_CONSTRUTORA_ID || '',
  'colaco-engenharia': process.env.GOOGLE_ADS_COLACO_ENGENHARIA_ID || '',
  'pesados-web': process.env.GOOGLE_ADS_PESADOS_WEB_ID || '',
  'eleva-corpo-e-alma': process.env.GOOGLE_ADS_ELEVA_CORPO_ALMA_ID || '',
};

/**
 * GET /api/google-ads/[client]
 * Fetch Google Ads data for a specific client
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
    const type = searchParams.get('type') || 'summary'; // 'summary' | 'campaigns'
    const useCache = searchParams.get('cache') !== 'false';

    // Validate client
    const customerId = CLIENT_GOOGLE_ADS_MAPPING[client];
    if (!customerId) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Client '${client}' not found or not configured for Google Ads`,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
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
    if (!process.env.GOOGLE_ADS_DEVELOPER_TOKEN || 
        !process.env.GOOGLE_ADS_CLIENT_ID || 
        !process.env.GOOGLE_ADS_CLIENT_SECRET || 
        !process.env.GOOGLE_ADS_REFRESH_TOKEN) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'GOOGLE_ADS_CONFIG_MISSING',
        message: 'Google Ads API configuration is incomplete',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    // Get date range
    const dateRange = getDateRange(period);
    
    // Create Google Ads client
    const googleAdsClient = createGoogleAdsClient(customerId);

    // Generate cache key
    const cacheKey = generateCacheKey('campaign', client, { 
      type, 
      period, 
      from: dateRange.from, 
      to: dateRange.to 
    });

    // Define fetch function
    const fetchData = async () => {
      if (type === 'campaigns') {
        return await googleAdsClient.getCampaignData(dateRange.from, dateRange.to);
      } else {
        return await googleAdsClient.getSummaryMetrics(dateRange.from, dateRange.to);
      }
    };

    // Fetch data with cache
    let data;
    if (useCache) {
      data = await withCache('campaign', cacheKey, fetchData);
    } else {
      data = await fetchData();
    }

    return NextResponse.json<APIResponse<CampaignMetrics | Campaign[]>>({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    const { client } = await params;
    console.error(`Error fetching Google Ads data for client ${client}:`, error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error.code || 'GOOGLE_ADS_API_ERROR',
      message: error.message || 'Failed to fetch Google Ads data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * POST /api/google-ads/[client]/test-connection
 * Test Google Ads API connection for a specific client
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ client: string }> }
): Promise<NextResponse> {
  try {
    const { client } = await params;
    
    // Validate client
    const customerId = CLIENT_GOOGLE_ADS_MAPPING[client];
    if (!customerId) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Client '${client}' not found or not configured for Google Ads`,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Create Google Ads client and test connection
    const googleAdsClient = createGoogleAdsClient(customerId);
    const isConnected = await googleAdsClient.testConnection();

    return NextResponse.json<APIResponse<{ connected: boolean }>>({
      success: true,
      data: { connected: isConnected },
      message: isConnected ? 'Google Ads connection successful' : 'Google Ads connection failed',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    const { client } = await params;
    console.error(`Error testing Google Ads connection for client ${client}:`, error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'CONNECTION_TEST_FAILED',
      message: error.message || 'Failed to test Google Ads connection',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * Generate mock data for development
 */
function getMockData(client: string, type: string, period: '7d' | '30d' | '90d') {
  const baseMetrics = {
    impressions: 15000,
    clicks: 450,
    cost: 2500,
    conversions: 35,
    ctr: 3.0,
    cpc: 5.56,
    cpm: 166.67,
    conversionRate: 7.78,
    roas: 1.4,
  };

  if (type === 'campaigns') {
    return [
      {
        campaignId: 'google_ads_campaign_1',
        campaignName: `${client} - Search Campaign`,
        platform: 'google_ads',
        status: 'active',
        date: new Date().toISOString().split('T')[0],
        metrics: { ...baseMetrics, impressions: 8000, clicks: 250, cost: 1500 },
      },
      {
        campaignId: 'google_ads_campaign_2',
        campaignName: `${client} - Display Campaign`,
        platform: 'google_ads',
        status: 'active',
        date: new Date().toISOString().split('T')[0],
        metrics: { ...baseMetrics, impressions: 7000, clicks: 200, cost: 1000 },
      },
    ];
  }

  return baseMetrics;
}