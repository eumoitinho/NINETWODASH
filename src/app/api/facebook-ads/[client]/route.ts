import { NextRequest, NextResponse } from 'next/server';
import { createFacebookAdsClient, getFacebookDateRange } from '@/lib/facebook-ads';
import { withCache, generateCacheKey } from '@/lib/cache';
import type { APIResponse, CampaignMetrics, Campaign } from '@/types/dashboard';

// Client ID to Facebook Ad Account ID mapping
const CLIENT_FACEBOOK_ADS_MAPPING: Record<string, { adAccountId: string; pixelId?: string }> = {
  'catalisti-holding': { 
    adAccountId: process.env.FACEBOOK_CATALISTI_ID || '',
    pixelId: process.env.FACEBOOK_CATALISTI_PIXEL_ID 
  },
  'abc-evo': { 
    adAccountId: process.env.FACEBOOK_ABC_EVO_ID || '',
    pixelId: process.env.FACEBOOK_ABC_EVO_PIXEL_ID 
  },
  'dr-victor-mauro': { 
    adAccountId: process.env.FACEBOOK_DR_VICTOR_MAURO_ID || '',
    pixelId: process.env.FACEBOOK_DR_VICTOR_MAURO_PIXEL_ID 
  },
  'dr-percio': { 
    adAccountId: process.env.FACEBOOK_DR_PERCIO_ID || '',
    pixelId: process.env.FACEBOOK_DR_PERCIO_PIXEL_ID 
  },
  'cwtrends': { 
    adAccountId: process.env.FACEBOOK_CWTRENDS_ID || '',
    pixelId: process.env.FACEBOOK_CWTRENDS_PIXEL_ID 
  },
  'global-best-part': { 
    adAccountId: process.env.FACEBOOK_GLOBAL_BEST_PART_ID || '',
    pixelId: process.env.FACEBOOK_GLOBAL_BEST_PART_PIXEL_ID 
  },
  'lj-santos': { 
    adAccountId: process.env.FACEBOOK_LJ_SANTOS_ID || '',
    pixelId: process.env.FACEBOOK_LJ_SANTOS_PIXEL_ID 
  },
  'favretto-midia-exterior': { 
    adAccountId: process.env.FACEBOOK_FAVRETTO_MIDIA_ID || '',
    pixelId: process.env.FACEBOOK_FAVRETTO_MIDIA_PIXEL_ID 
  },
  'favretto-comunicacao-visual': { 
    adAccountId: process.env.FACEBOOK_FAVRETTO_COMUNICACAO_ID || '',
    pixelId: process.env.FACEBOOK_FAVRETTO_COMUNICACAO_PIXEL_ID 
  },
  'mundial': { 
    adAccountId: process.env.FACEBOOK_MUNDIAL_ID || '',
    pixelId: process.env.FACEBOOK_MUNDIAL_PIXEL_ID 
  },
  'naframe': { 
    adAccountId: process.env.FACEBOOK_NAFRAME_ID || '',
    pixelId: process.env.FACEBOOK_NAFRAME_PIXEL_ID 
  },
  'motin-films': { 
    adAccountId: process.env.FACEBOOK_MOTIN_FILMS_ID || '',
    pixelId: process.env.FACEBOOK_MOTIN_FILMS_PIXEL_ID 
  },
  'naport': { 
    adAccountId: process.env.FACEBOOK_NAPORT_ID || '',
    pixelId: process.env.FACEBOOK_NAPORT_PIXEL_ID 
  },
  'autoconnect-prime': { 
    adAccountId: process.env.FACEBOOK_AUTOCONNECT_PRIME_ID || '',
    pixelId: process.env.FACEBOOK_AUTOCONNECT_PRIME_PIXEL_ID 
  },
  'vtelco-networks': { 
    adAccountId: process.env.FACEBOOK_VTELCO_NETWORKS_ID || '',
    pixelId: process.env.FACEBOOK_VTELCO_NETWORKS_PIXEL_ID 
  },
  'amitech': { 
    adAccountId: process.env.FACEBOOK_AMITECH_ID || '',
    pixelId: process.env.FACEBOOK_AMITECH_PIXEL_ID 
  },
  'hogrefe-construtora': { 
    adAccountId: process.env.FACEBOOK_HOGREFE_CONSTRUTORA_ID || '',
    pixelId: process.env.FACEBOOK_HOGREFE_CONSTRUTORA_PIXEL_ID 
  },
  'colaco-engenharia': { 
    adAccountId: process.env.FACEBOOK_COLACO_ENGENHARIA_ID || '',
    pixelId: process.env.FACEBOOK_COLACO_ENGENHARIA_PIXEL_ID 
  },
  'pesados-web': { 
    adAccountId: process.env.FACEBOOK_PESADOS_WEB_ID || '',
    pixelId: process.env.FACEBOOK_PESADOS_WEB_PIXEL_ID 
  },
  'eleva-corpo-e-alma': { 
    adAccountId: process.env.FACEBOOK_ELEVA_CORPO_ALMA_ID || '',
    pixelId: process.env.FACEBOOK_ELEVA_CORPO_ALMA_PIXEL_ID 
  },
};

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

    // Validate client
    const clientConfig = CLIENT_FACEBOOK_ADS_MAPPING[client];
    if (!clientConfig || !clientConfig.adAccountId) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Client '${client}' not found or not configured for Facebook Ads`,
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
      clientConfig.adAccountId, 
      clientConfig.pixelId
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
    
    // Validate client
    const clientConfig = CLIENT_FACEBOOK_ADS_MAPPING[client];
    if (!clientConfig || !clientConfig.adAccountId) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Client '${client}' not found or not configured for Facebook Ads`,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Create Facebook Ads client and test connection
    const facebookAdsClient = createFacebookAdsClient(
      clientConfig.adAccountId, 
      clientConfig.pixelId
    );
    const isConnected = await facebookAdsClient.testConnection();

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