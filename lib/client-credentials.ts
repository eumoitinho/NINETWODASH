/**
 * Client Credentials Management for NINETWODASH
 * Handles secure storage and retrieval of API credentials for each client
 */

import { connectToDatabase, Client } from './mongodb';
import { encryptCredentials, decryptCredentials } from './encryption';
import { createGoogleAdsClient } from './google-ads';
import { createFacebookAdsClient } from './facebook-ads';
import { createGoogleAnalyticsClient } from './google-analytics';

// Types for credentials
export interface GoogleAdsCredentials {
  developerId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string;
}

export interface FacebookAdsCredentials {
  appId: string;
  appSecret: string;
  accessToken: string;
  adAccountId: string;
  pixelId?: string;
}

export interface GoogleAnalyticsCredentials {
  propertyId: string;
  viewId?: string;
  serviceAccountKey?: any;
  clientEmail?: string;
  privateKey?: string;
}

/**
 * Save Google Ads credentials for a client
 */
export async function saveGoogleAdsCredentials(
  clientId: string,
  credentials: GoogleAdsCredentials
): Promise<boolean> {
  try {
    await connectToDatabase();
    
    // Encrypt credentials
    const encryptedCredentials = encryptCredentials(credentials);
    
    // Update client
    await Client.findByIdAndUpdate(clientId, {
      'googleAds.customerId': credentials.customerId,
      'googleAds.encryptedCredentials': encryptedCredentials,
      'googleAds.connected': false, // Will be tested separately
      updatedAt: new Date(),
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar credenciais Google Ads:', error);
    return false;
  }
}

/**
 * Save Facebook Ads credentials for a client
 */
export async function saveFacebookAdsCredentials(
  clientId: string,
  credentials: FacebookAdsCredentials
): Promise<boolean> {
  try {
    await connectToDatabase();
    
    // Encrypt credentials
    const encryptedCredentials = encryptCredentials(credentials);
    
    // Update client
    await Client.findByIdAndUpdate(clientId, {
      'facebookAds.adAccountId': credentials.adAccountId,
      'facebookAds.pixelId': credentials.pixelId,
      'facebookAds.encryptedCredentials': encryptedCredentials,
      'facebookAds.connected': false, // Will be tested separately
      updatedAt: new Date(),
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar credenciais Facebook Ads:', error);
    return false;
  }
}

/**
 * Save Google Analytics credentials for a client
 */
export async function saveGoogleAnalyticsCredentials(
  clientId: string,
  credentials: GoogleAnalyticsCredentials
): Promise<boolean> {
  try {
    await connectToDatabase();
    
    // Encrypt credentials
    const encryptedCredentials = encryptCredentials(credentials);
    
    // Update client
    await Client.findByIdAndUpdate(clientId, {
      'googleAnalytics.propertyId': credentials.propertyId,
      'googleAnalytics.viewId': credentials.viewId,
      'googleAnalytics.encryptedCredentials': encryptedCredentials,
      'googleAnalytics.connected': false, // Will be tested separately
      updatedAt: new Date(),
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar credenciais Google Analytics:', error);
    return false;
  }
}

/**
 * Get Google Ads credentials for a client
 */
export async function getGoogleAdsCredentials(clientId: string): Promise<GoogleAdsCredentials | null> {
  try {
    await connectToDatabase();
    
    const client = await Client.findById(clientId);
    if (!client?.googleAds?.encryptedCredentials) {
      return null;
    }
    
    const credentials = decryptCredentials(client.googleAds.encryptedCredentials);
    return credentials as GoogleAdsCredentials;
  } catch (error) {
    console.error('Erro ao obter credenciais Google Ads:', error);
    return null;
  }
}

/**
 * Get Facebook Ads credentials for a client
 */
export async function getFacebookAdsCredentials(clientId: string): Promise<FacebookAdsCredentials | null> {
  try {
    await connectToDatabase();
    
    const client = await Client.findById(clientId);
    if (!client?.facebookAds?.encryptedCredentials) {
      return null;
    }
    
    const credentials = decryptCredentials(client.facebookAds.encryptedCredentials);
    return credentials as FacebookAdsCredentials;
  } catch (error) {
    console.error('Erro ao obter credenciais Facebook Ads:', error);
    return null;
  }
}

/**
 * Get Google Analytics credentials for a client
 */
export async function getGoogleAnalyticsCredentials(clientId: string): Promise<GoogleAnalyticsCredentials | null> {
  try {
    await connectToDatabase();
    
    const client = await Client.findById(clientId);
    if (!client?.googleAnalytics?.encryptedCredentials) {
      return null;
    }
    
    const credentials = decryptCredentials(client.googleAnalytics.encryptedCredentials);
    return credentials as GoogleAnalyticsCredentials;
  } catch (error) {
    console.error('Erro ao obter credenciais Google Analytics:', error);
    return null;
  }
}

/**
 * Test Google Ads connection for a client
 */
export async function testGoogleAdsConnection(clientId: string): Promise<boolean> {
  try {
    const credentials = await getGoogleAdsCredentials(clientId);
    if (!credentials) {
      return false;
    }
    
    // Create temporary client with these credentials
    const tempClient = createGoogleAdsClient(credentials.customerId, credentials);
    const isConnected = await tempClient.testConnection();
    
    // Update connection status
    await Client.findByIdAndUpdate(clientId, {
      'googleAds.connected': isConnected,
      'googleAds.lastSync': isConnected ? new Date() : null,
    });
    
    return isConnected;
  } catch (error) {
    console.error('Erro ao testar conexão Google Ads:', error);
    return false;
  }
}

/**
 * Test Facebook Ads connection for a client
 */
export async function testFacebookAdsConnection(clientId: string): Promise<boolean> {
  try {
    const credentials = await getFacebookAdsCredentials(clientId);
    if (!credentials) {
      return false;
    }
    
    // Create temporary client with these credentials
    const tempClient = createFacebookAdsClient(credentials.adAccountId, credentials.pixelId, credentials);
    const isConnected = await tempClient.testConnection();
    
    // Update connection status
    await Client.findByIdAndUpdate(clientId, {
      'facebookAds.connected': isConnected,
      'facebookAds.lastSync': isConnected ? new Date() : null,
    });
    
    return isConnected;
  } catch (error) {
    console.error('Erro ao testar conexão Facebook Ads:', error);
    return false;
  }
}

/**
 * Test Google Analytics connection for a client
 */
export async function testGoogleAnalyticsConnection(clientId: string): Promise<boolean> {
  try {
    const credentials = await getGoogleAnalyticsCredentials(clientId);
    if (!credentials) {
      return false;
    }
    
    // Create temporary client with these credentials
    const tempClient = createGoogleAnalyticsClient(credentials.propertyId, credentials.viewId, credentials);
    const isConnected = await tempClient.testConnection();
    
    // Update connection status
    await Client.findByIdAndUpdate(clientId, {
      'googleAnalytics.connected': isConnected,
      'googleAnalytics.lastSync': isConnected ? new Date() : null,
    });
    
    return isConnected;
  } catch (error) {
    console.error('Erro ao testar conexão Google Analytics:', error);
    return false;
  }
}

/**
 * Test all connections for a client
 */
export async function testAllConnections(clientId: string): Promise<{
  googleAds: boolean;
  facebookAds: boolean;
  googleAnalytics: boolean;
}> {
  const [googleAds, facebookAds, googleAnalytics] = await Promise.allSettled([
    testGoogleAdsConnection(clientId),
    testFacebookAdsConnection(clientId),
    testGoogleAnalyticsConnection(clientId),
  ]);
  
  return {
    googleAds: googleAds.status === 'fulfilled' ? googleAds.value : false,
    facebookAds: facebookAds.status === 'fulfilled' ? facebookAds.value : false,
    googleAnalytics: googleAnalytics.status === 'fulfilled' ? googleAnalytics.value : false,
  };
}

/**
 * Remove credentials for a client (security cleanup)
 */
export async function removeClientCredentials(clientId: string, platform?: 'googleAds' | 'facebookAds' | 'googleAnalytics'): Promise<boolean> {
  try {
    await connectToDatabase();
    
    const updateData: any = {};
    
    if (!platform || platform === 'googleAds') {
      updateData['googleAds.encryptedCredentials'] = null;
      updateData['googleAds.connected'] = false;
    }
    
    if (!platform || platform === 'facebookAds') {
      updateData['facebookAds.encryptedCredentials'] = null;
      updateData['facebookAds.connected'] = false;
    }
    
    if (!platform || platform === 'googleAnalytics') {
      updateData['googleAnalytics.encryptedCredentials'] = null;
      updateData['googleAnalytics.connected'] = false;
    }
    
    updateData.updatedAt = new Date();
    
    await Client.findByIdAndUpdate(clientId, updateData);
    return true;
  } catch (error) {
    console.error('Erro ao remover credenciais:', error);
    return false;
  }
}

/**
 * Get client API status
 */
export async function getClientAPIStatus(clientId: string): Promise<{
  googleAds: { connected: boolean; customerId?: string; lastSync?: Date };
  facebookAds: { connected: boolean; adAccountId?: string; lastSync?: Date };
  googleAnalytics: { connected: boolean; propertyId?: string; lastSync?: Date };
}> {
  try {
    await connectToDatabase();
    
    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    
    return {
      googleAds: {
        connected: client.googleAds?.connected || false,
        customerId: client.googleAds?.customerId,
        lastSync: client.googleAds?.lastSync,
      },
      facebookAds: {
        connected: client.facebookAds?.connected || false,
        adAccountId: client.facebookAds?.adAccountId,
        lastSync: client.facebookAds?.lastSync,
      },
      googleAnalytics: {
        connected: client.googleAnalytics?.connected || false,
        propertyId: client.googleAnalytics?.propertyId,
        lastSync: client.googleAnalytics?.lastSync,
      },
    };
  } catch (error) {
    console.error('Erro ao obter status das APIs:', error);
    throw error;
  }
}