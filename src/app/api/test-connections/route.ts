import { NextRequest, NextResponse } from 'next/server';
import { createGoogleAdsClient } from '@/lib/google-ads';
import { createFacebookAdsClient, validateFacebookToken } from '@/lib/facebook-ads';
import { getCacheStats } from '@/lib/cache';
import type { APIResponse } from '@/types/dashboard';

interface ConnectionTestResult {
  service: string;
  connected: boolean;
  error?: string;
  details?: any;
}

interface SystemStatus {
  connections: ConnectionTestResult[];
  cache: any;
  environment: {
    nodeEnv: string;
    useMockData: boolean;
    debugApiCalls: boolean;
  };
  timestamp: string;
}

/**
 * GET /api/test-connections
 * Test all API connections and system status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const connections: ConnectionTestResult[] = [];
  
  try {
    // Test Google Ads API configuration
    const googleAdsResult = await testGoogleAdsConnection();
    connections.push(googleAdsResult);
    
    // Test Facebook Marketing API configuration
    const facebookAdsResult = await testFacebookAdsConnection();
    connections.push(facebookAdsResult);
    
    // Get cache statistics
    const cacheStats = getCacheStats();
    
    // System status
    const systemStatus: SystemStatus = {
      connections,
      cache: cacheStats,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        useMockData: process.env.USE_MOCK_DATA === 'true',
        debugApiCalls: process.env.DEBUG_API_CALLS === 'true',
      },
      timestamp: new Date().toISOString(),
    };
    
    // Determine overall success
    const allConnected = connections.every(conn => conn.connected);
    
    return NextResponse.json<APIResponse<SystemStatus>>({
      success: allConnected,
      data: systemStatus,
      message: allConnected 
        ? 'All connections successful' 
        : 'Some connections failed - check details',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Error testing connections:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'CONNECTION_TEST_ERROR',
      message: error.message || 'Failed to test connections',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * Test Google Ads API connection
 */
async function testGoogleAdsConnection(): Promise<ConnectionTestResult> {
  try {
    // Check if configuration exists
    const hasConfig = !!(
      process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
      process.env.GOOGLE_ADS_CLIENT_ID &&
      process.env.GOOGLE_ADS_CLIENT_SECRET &&
      process.env.GOOGLE_ADS_REFRESH_TOKEN
    );
    
    if (!hasConfig) {
      return {
        service: 'Google Ads API',
        connected: false,
        error: 'Missing configuration',
        details: {
          hasDeveloperToken: !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          hasClientId: !!process.env.GOOGLE_ADS_CLIENT_ID,
          hasClientSecret: !!process.env.GOOGLE_ADS_CLIENT_SECRET,
          hasRefreshToken: !!process.env.GOOGLE_ADS_REFRESH_TOKEN,
        }
      };
    }
    
    // Test with Catalisti Holding customer ID if available
    const customerId = process.env.GOOGLE_ADS_CATALISTI_ID;
    if (!customerId) {
      return {
        service: 'Google Ads API',
        connected: false,
        error: 'No test customer ID configured (GOOGLE_ADS_CATALISTI_ID)',
        details: { hasConfig: true }
      };
    }
    
    // Create client and test connection
    const googleAdsClient = createGoogleAdsClient(customerId);
    const isConnected = await googleAdsClient.testConnection();
    
    return {
      service: 'Google Ads API',
      connected: isConnected,
      details: {
        customerId,
        hasConfig: true,
      }
    };
    
  } catch (error: any) {
    return {
      service: 'Google Ads API',
      connected: false,
      error: error.message,
      details: { hasConfig: true }
    };
  }
}

/**
 * Test Facebook Marketing API connection
 */
async function testFacebookAdsConnection(): Promise<ConnectionTestResult> {
  try {
    // Check if configuration exists
    const hasConfig = !!(
      process.env.FACEBOOK_APP_ID &&
      process.env.FACEBOOK_APP_SECRET &&
      process.env.FACEBOOK_ACCESS_TOKEN
    );
    
    if (!hasConfig) {
      return {
        service: 'Facebook Marketing API',
        connected: false,
        error: 'Missing configuration',
        details: {
          hasAppId: !!process.env.FACEBOOK_APP_ID,
          hasAppSecret: !!process.env.FACEBOOK_APP_SECRET,
          hasAccessToken: !!process.env.FACEBOOK_ACCESS_TOKEN,
        }
      };
    }
    
    // Validate access token first
    const tokenValid = await validateFacebookToken(process.env.FACEBOOK_ACCESS_TOKEN!);
    if (!tokenValid) {
      return {
        service: 'Facebook Marketing API',
        connected: false,
        error: 'Invalid or expired access token',
        details: { hasConfig: true, tokenValid: false }
      };
    }
    
    // Test with Catalisti Holding ad account ID if available
    const adAccountId = process.env.FACEBOOK_CATALISTI_ID;
    if (!adAccountId) {
      return {
        service: 'Facebook Marketing API',
        connected: false,
        error: 'No test ad account ID configured (FACEBOOK_CATALISTI_ID)',
        details: { hasConfig: true, tokenValid: true }
      };
    }
    
    // Create client and test connection
    const facebookAdsClient = createFacebookAdsClient(adAccountId);
    const isConnected = await facebookAdsClient.testConnection();
    
    return {
      service: 'Facebook Marketing API',
      connected: isConnected,
      details: {
        adAccountId,
        hasConfig: true,
        tokenValid: true,
      }
    };
    
  } catch (error: any) {
    return {
      service: 'Facebook Marketing API',
      connected: false,
      error: error.message,
      details: { hasConfig: true }
    };
  }
}

/**
 * POST /api/test-connections/clear-cache
 * Clear all caches
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { clearAllCaches } = await import('../../../../lib/cache');
    
    clearAllCaches();
    
    return NextResponse.json<APIResponse<{ cleared: boolean }>>({
      success: true,
      data: { cleared: true },
      message: 'All caches cleared successfully',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Error clearing caches:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'CACHE_CLEAR_ERROR',
      message: error.message || 'Failed to clear caches',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}