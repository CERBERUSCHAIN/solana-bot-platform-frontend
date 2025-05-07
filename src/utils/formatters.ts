// CERBERUS Bot - Formatting Utilities
// Created: 2025-05-05 22:23:27 UTC
// Author: CERBERUSCHAINNext

/**
 * Format a number as a SOL amount
 */
export function formatSOL(value: number): string {
    return `${value.toFixed(3)} SOL`;
  }
  
  /**
   * Format a date as a time since string (e.g. "5 minutes", "2 hours")
   */
  export function formatTimeSince(dateString: string): string {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000; // years
    
    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000; // months
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400; // days
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600; // hours
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60; // minutes
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  }