// CERBERUS Bot - Bot Service Implementation
// Created: 2025-05-06 03:24:45 UTC
// Author: CERBERUSCHAINNext

import { BotService } from '../BotService';
import { Bot, BotConfig, BotType, BotStatus, BotMetrics, BotTransaction } from '../../types/bot';
import axios from 'axios';

// WebSocket connection for real-time bot updates
class BotConnection {
  private ws: WebSocket | null = null;
  private callbacks: Array<(update: any) => void> = [];
  private reconnectTimeout: number = 1000; // Start with 1 second
  private isConnecting: boolean = false;
  private userId: string;
  
  constructor(userId: string) {
    this.userId = userId;
  }
  
  public connect() {
    if (this.ws || this.isConnecting) return;
    
    this.isConnecting = true;
    
    try {
      // Connect to WebSocket server
      this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_API_URL}/bots`);
      
      // Authentication and connection handling
      this.ws.onopen = () => {
        console.log('Bot WebSocket connected');
        this.reconnectTimeout = 1000; // Reset timeout on successful connection
        this.isConnecting = false;
        
        // Authenticate the connection
        const token = localStorage.getItem('cerberus_access_token');
        if (token && this.ws) {
          this.ws.send(JSON.stringify({
            type: 'auth',
            token,
            userId: this.userId
          }));
        }
      };
      
      // Handle incoming messages
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Notify all subscribers
          this.callbacks.forEach(callback => callback(data));
        } catch (error) {
          console.error('Error parsing bot update:', error);
        }
      };
      
      // Reconnect on close
      this.ws.onclose = () => {
        console.log('Bot WebSocket disconnected, reconnecting...');
        this.ws = null;
        this.isConnecting = false;
        
        // Exponential backoff for reconnection
        setTimeout(() => {
          this.connect();
          this.reconnectTimeout = Math.min(30000, this.reconnectTimeout * 1.5); // Cap at 30 seconds
        }, this.reconnectTimeout);
      };
      
      // Handle errors
      this.ws.onerror = (error) => {
        console.error('Bot WebSocket error:', error);
        this.ws?.close();
      };
    } catch (error) {
      console.error('Failed to connect to bot WebSocket:', error);
      this.isConnecting = false;
    }
  }
  
  public subscribe(callback: (update: any) => void): () => void {
    this.callbacks.push(callback);
    
    // Connect if not already connected
    if (!this.ws) {
      this.connect();
    }
    
    // Return unsubscribe function
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
      
      // Close the connection if there are no more subscribers
      if (this.callbacks.length === 0 && this.ws) {
        this.ws.close();
        this.ws = null;
      }
    };
  }
  
  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export class BotServiceImpl implements BotService {
  private connection: BotConnection | null = null;
  private userId: string;
  
  constructor(userId: string) {
    this.userId = userId;
  }
  
  /**
   * Get API headers with authentication
   */
  private getHeaders() {
    const token = localStorage.getItem('cerberus_access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
  
  /**
   * Get all bots for the current user
   */
  async getAllBots(): Promise<Bot[]> {
    try {
      const response = await axios.get(`/api/bots`, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error('Error fetching bots:', error);
      throw error;
    }
  }
  
  /**
   * Get bot by ID
   */
  async getBotById(botId: string): Promise<Bot> {
    try {
      const response = await axios.get(`/api/bots/${botId}`, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error(`Error fetching bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new bot
   */
  async createBot(config: BotConfig): Promise<Bot> {
    try {
      const response = await axios.post(`/api/bots`, config, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error('Error creating bot:', error);
      throw error;
    }
  }
  
  /**
   * Update bot configuration
   */
  async updateBot(botId: string, config: Partial<BotConfig>): Promise<Bot> {
    try {
      const response = await axios.put(`/api/bots/${botId}`, config, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error(`Error updating bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a bot
   */
  async deleteBot(botId: string): Promise<boolean> {
    try {
      const response = await axios.delete(`/api/bots/${botId}`, { headers: this.getHeaders() });
      return response.status === 200;
    } catch (error) {
      console.error(`Error deleting bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Start a bot
   */
  async startBot(botId: string): Promise<boolean> {
    try {
      const response = await axios.post(`/api/bots/${botId}/start`, {}, { headers: this.getHeaders() });
      return response.data.success;
    } catch (error) {
      console.error(`Error starting bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Stop a bot
   */
  async stopBot(botId: string): Promise<boolean> {
    try {
      const response = await axios.post(`/api/bots/${botId}/stop`, {}, { headers: this.getHeaders() });
      return response.data.success;
    } catch (error) {
      console.error(`Error stopping bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Pause a bot
   */
  async pauseBot(botId: string): Promise<boolean> {
    try {
      const response = await axios.post(`/api/bots/${botId}/pause`, {}, { headers: this.getHeaders() });
      return response.data.success;
    } catch (error) {
      console.error(`Error pausing bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get bot metrics
   */
  async getBotMetrics(botId: string, timespan: 'day' | 'week' | 'month' | 'all' = 'day'): Promise<BotMetrics> {
    try {
      const response = await axios.get(`/api/bots/${botId}/metrics?timespan=${timespan}`, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error(`Error fetching metrics for bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get bot transactions
   */
  async getBotTransactions(botId: string, limit = 50, offset = 0): Promise<BotTransaction[]> {
    try {
      const response = await axios.get(
        `/api/bots/${botId}/transactions?limit=${limit}&offset=${offset}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions for bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Subscribe to bot status updates
   */
  subscribeToBotUpdates(callback: (update: {botId: string, status: BotStatus, metrics?: Partial<BotMetrics>}) => void): () => void {
    // Initialize connection if needed
    if (!this.connection) {
      this.connection = new BotConnection(this.userId);
    }
    
    // Subscribe to updates
    return this.connection.subscribe(callback);
  }
  
  /**
   * Get bot types and their configurations
   */
  async getBotTypes(): Promise<Record<BotType, any>> {
    try {
      const response = await axios.get(`/api/bots/types`, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error('Error fetching bot types:', error);
      throw error;
    }
  }
  
  /**
   * Simulate bot performance based on historical data
   */
  async simulateBot(config: BotConfig, timespan: 'day' | 'week' | 'month'): Promise<BotMetrics> {
    try {
      const response = await axios.post(
        `/api/bots/simulate?timespan=${timespan}`,
        config,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error simulating bot:', error);
      throw error;
    }
  }
  
  /**
   * Assign wallet to bot
   */
  async assignWallet(botId: string, walletAddress: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `/api/bots/${botId}/wallet`, 
        { walletAddress },
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error(`Error assigning wallet to bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get logs for a bot
   */
  async getBotLogs(botId: string, limit = 100): Promise<Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'debug';
    message: string;
    data?: any;
  }>> {
    try {
      const response = await axios.get(
        `/api/bots/${botId}/logs?limit=${limit}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching logs for bot ${botId}:`, error);
      throw error;
    }
  }
}