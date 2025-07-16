import { NextRequest, NextResponse } from 'next/server';
import { withCache, generateCacheKey } from '../../../../lib/cache';
import type { 
  APIResponse, 
  ClientDashboardData, 
  CampaignMetrics, 
  Campaign, 
  Client,
  DashboardSummary 
} from '../../../../types/dashboard';

// Client configuration mapping
const CLIENT_CONFIG: Record<string, Client> = {
  'catalisti-holding': {
    id: 16,
    name: 'Catalisti Holding',
    email: 'contato@catalisti.com.br',
    status: 'active',
    ga4Connected: true,
    metaConnected: true,
    lastSync: new Date().toISOString(),
    monthlyBudget: 25000,
    avatar: '/assets/images/avatar/avatar1.png',
    tags: ['premium', 'holding'],
    googleAdsCustomerId: process.env.GOOGLE_ADS_CATALISTI_ID,
    facebookAdAccountId: process.env.FACEBOOK_CATALISTI_ID,
  },
  'abc-evo': {
    id: 1,
    name: 'ABC EVO',
    email: 'contato@abcevo.com.br',
    status: 'active',
    ga4Connected: true,
    metaConnected: true,
    lastSync: new Date().toISOString(),
    monthlyBudget: 15000,
    avatar: '/assets/images/avatar/avatar2.png',
    tags: ['tech', 'startup'],
    googleAdsCustomerId: process.env.GOOGLE_ADS_ABC_EVO_ID,
    facebookAdAccountId: process.env.FACEBOOK_ABC_EVO_ID,
  },
  'dr-victor-mauro': {
    id: 2,
    name: 'Dr. Victor Mauro',
    email: 'contato@drvictor.com.br',
    status: 'active',
    ga4Connected: true,
    metaConnected: true,
    lastSync: new Date().toISOString(),
    monthlyBudget: 8000,
    avatar: '/assets/images/avatar/avatar3.png',
    tags: ['healthcare', 'medical'],
    googleAdsCustomerId: process.env.GOOGLE_ADS_DR_VICTOR_MAURO_ID,
    facebookAdAccountId: process.env.FACEBOOK_DR_VICTOR_MAURO_ID,
  },
  // Add other clients as needed...
};

/**
 * GET /api/dashboard/[client]
 * Get consolidated dashboard data for a specific client
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
    const useCache = searchParams.get('cache') !== 'false';

    // Validate client
    const clientConfig = CLIENT_CONFIG[client];
    if (!clientConfig) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Client '${client}' not found`,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Check if mock data is enabled
    const useMockData = process.env.USE_MOCK_DATA === 'true';
    if (useMockData) {
      return NextResponse.json<APIResponse<ClientDashboardData>>({
        success: true,
        data: getMockDashboardData(clientConfig, period),
        message: 'Mock data returned (USE_MOCK_DATA=true)',
        timestamp: new Date().toISOString(),
      });
    }

    // Generate cache key
    const cacheKey = generateCacheKey('client', client, { 
      period,
      type: 'dashboard'
    });

    // Define fetch function
    const fetchData = async (): Promise<ClientDashboardData> => {
      const [googleAdsData, facebookAdsData] = await Promise.allSettled([
        fetchGoogleAdsData(client, period),
        fetchFacebookAdsData(client, period),
      ]);

      // Process results
      const googleMetrics = googleAdsData.status === 'fulfilled' ? googleAdsData.value : null;
      const facebookMetrics = facebookAdsData.status === 'fulfilled' ? facebookAdsData.value : null;

      // Combine campaigns from both platforms
      const allCampaigns: Campaign[] = [];
      if (googleMetrics?.campaigns) {
        allCampaigns.push(...googleMetrics.campaigns);
      }
      if (facebookMetrics?.campaigns) {
        allCampaigns.push(...facebookMetrics.campaigns);
      }

      // Calculate consolidated summary
      const summary = calculateConsolidatedSummary(
        googleMetrics?.summary,
        facebookMetrics?.summary
      );

      // Get date range
      const dateRange = getDateRange(period);

      return {
        client: clientConfig,
        dateRange,
        summary,
        campaigns: allCampaigns,
        lastUpdated: new Date().toISOString(),
        dataSource: {
          googleAds: googleAdsData.status === 'fulfilled',
          facebookAds: facebookAdsData.status === 'fulfilled',
          mock: false,
        },
      };
    };

    // Fetch data with cache
    let data: ClientDashboardData;
    if (useCache) {
      data = await withCache('client', cacheKey, fetchData);
    } else {
      data = await fetchData();
    }

    return NextResponse.json<APIResponse<ClientDashboardData>>({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    const { client } = await params;
    console.error(`Error fetching dashboard data for client ${client}:`, error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error.code || 'DASHBOARD_API_ERROR',
      message: error.message || 'Failed to fetch dashboard data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * Fetch Google Ads data from internal API
 */
async function fetchGoogleAdsData(client: string, period: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google-ads/${client}?period=${period}&type=summary`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.status}`);
    }

    const result = await response.json();
    return {
      summary: result.data,
      campaigns: [], // We'll fetch campaigns separately if needed
    };
  } catch (error) {
    console.error('Error fetching Google Ads data:', error);
    return null;
  }
}

/**
 * Fetch Facebook Ads data from internal API
 */
async function fetchFacebookAdsData(client: string, period: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/facebook-ads/${client}?period=${period}&type=summary`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Facebook Ads API error: ${response.status}`);
    }

    const result = await response.json();
    return {
      summary: result.data,
      campaigns: [], // We'll fetch campaigns separately if needed
    };
  } catch (error) {
    console.error('Error fetching Facebook Ads data:', error);
    return null;
  }
}

/**
 * Calculate consolidated summary from Google Ads and Facebook Ads data
 */
function calculateConsolidatedSummary(
  googleMetrics?: CampaignMetrics | null,
  facebookMetrics?: CampaignMetrics | null
): DashboardSummary {
  const google = googleMetrics || {
    impressions: 0, clicks: 0, cost: 0, conversions: 0,
    ctr: 0, cpc: 0, cpm: 0, conversionRate: 0, roas: 0
  };
  
  const facebook = facebookMetrics || {
    impressions: 0, clicks: 0, cost: 0, conversions: 0,
    ctr: 0, cpc: 0, cpm: 0, conversionRate: 0, roas: 0
  };

  const totalImpressions = google.impressions + facebook.impressions;
  const totalClicks = google.clicks + facebook.clicks;
  const totalCost = google.cost + facebook.cost;
  const totalConversions = google.conversions + facebook.conversions;

  return {
    totalImpressions,
    totalClicks,
    totalCost,
    totalConversions,
    // Weighted averages
    averageCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    averageCPC: totalClicks > 0 ? totalCost / totalClicks : 0,
    averageCPM: totalImpressions > 0 ? (totalCost / totalImpressions) * 1000 : 0,
    averageConversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    totalROAS: totalCost > 0 && totalConversions > 0 ? totalConversions / totalCost : 0,
    // Include individual metrics for backwards compatibility
    impressions: totalImpressions,
    clicks: totalClicks,
    cost: totalCost,
    conversions: totalConversions,
    ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    cpc: totalClicks > 0 ? totalCost / totalClicks : 0,
    cpm: totalImpressions > 0 ? (totalCost / totalImpressions) * 1000 : 0,
    conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    roas: totalCost > 0 && totalConversions > 0 ? totalConversions / totalCost : 0,
  };
}

/**
 * Get date range for the period
 */
function getDateRange(period: '7d' | '30d' | '90d') {
  const today = new Date();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const from = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));

  return {
    from: from.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
  };
}

/**
 * Generate mock dashboard data for development
 */
function getMockDashboardData(client: Client, period: '7d' | '30d' | '90d'): ClientDashboardData {
  const dateRange = getDateRange(period);
  
  // Mock metrics based on Catalisti Holding reference data
  const summary: DashboardSummary = {
    totalImpressions: 14923,
    totalClicks: 138,
    totalCost: 1996.65,
    totalConversions: 18,
    averageCTR: 0.92,
    averageCPC: 14.47,
    averageCPM: 133.80,
    averageConversionRate: 13.04,
    totalROAS: 1.35,
    impressions: 14923,
    clicks: 138,
    cost: 1996.65,
    conversions: 18,
    ctr: 0.92,
    cpc: 14.47,
    cpm: 133.80,
    conversionRate: 13.04,
    roas: 1.35,
  };

  const campaigns: Campaign[] = [
    {
      campaignId: 'google_search_campaign',
      campaignName: `${client.name} - Search Campaign`,
      platform: 'google_ads',
      status: 'active',
      date: dateRange.to,
      metrics: {
        impressions: 8500,
        clicks: 85,
        cost: 1200,
        conversions: 12,
        ctr: 1.0,
        cpc: 14.12,
        cpm: 141.18,
        conversionRate: 14.12,
        roas: 1.4,
      },
    },
    {
      campaignId: 'facebook_feed_campaign',
      campaignName: `${client.name} - Facebook Feed`,
      platform: 'facebook',
      status: 'active',
      date: dateRange.to,
      metrics: {
        impressions: 6423,
        clicks: 53,
        cost: 796.65,
        conversions: 6,
        ctr: 0.83,
        cpc: 15.03,
        cpm: 124.05,
        conversionRate: 11.32,
        roas: 1.25,
      },
    },
  ];

  return {
    client,
    dateRange,
    summary,
    campaigns,
    lastUpdated: new Date().toISOString(),
    dataSource: {
      googleAds: false,
      facebookAds: false,
      mock: true,
    },
  };
}