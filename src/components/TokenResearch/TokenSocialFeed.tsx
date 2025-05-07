// CERBERUS Bot - Token Social Feed Component
// Created: 2025-05-06 15:51:38 UTC
// Author: CERBERUSCHAIN

import React from 'react';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'telegram' | 'discord' | 'reddit';
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  sentiment: number; // -1 to 1
  url: string;
}

interface TokenSocialFeedProps {
  socialData: {
    posts?: SocialPost[];
    metrics?: {
      twitterFollowers?: number;
      telegramMembers?: number;
      discordMembers?: number;
      sentimentScore?: number;
      postVolume24h?: number;
    };
  } | null;
  isLoading: boolean;
}

export const TokenSocialFeed: React.FC<TokenSocialFeedProps> = ({ socialData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-700"></div>
          <div className="mt-4 text-gray-500">Loading social data...</div>
        </div>
      </div>
    );
  }
  
  if (!socialData || !socialData.posts || socialData.posts.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No social media activity found for this token.</p>
      </div>
    );
  }
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        );
      case 'telegram':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.19.651-.946 4.432-1.334 5.856-.166.611-.329.785-.541.785-.466 0-.663-.306-1.021-.6-.565-.466-1.221-1.001-1.539-1.258-.883-.716-1.096-.883.239-2.149.432-.41 2.118-1.944 2.157-2.109.005-.022.01-.104-.04-.148s-.146-.041-.208-.024c-.089.024-1.557.986-4.403 2.889-.415.284-.792.422-1.13.416-.373-.008-1.089-.208-1.622-.38-.656-.209-1.176-.32-1.132-.674.022-.183.259-.371.711-.566 2.782-1.215 4.635-2.014 5.56-2.4 2.646-1.104 3.2-1.294 3.556-1.302.789-.017.665.484.747 1.664z" />
          </svg>
        );
      case 'discord':
        return (
          <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        );
      case 'reddit':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
          </svg>
        );
    }
  };
  
  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.5) return 'text-green-400';
    if (sentiment >= 0.1) return 'text-green-300';
    if (sentiment >= -0.1) return 'text-gray-400';
    if (sentiment >= -0.5) return 'text-red-300';
    return 'text-red-400';
  };
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Social Metrics Summary */}
      {socialData.metrics && (
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-medium mb-4">Social Media Presence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialData.metrics.twitterFollowers !== undefined && (
              <div className="bg-gray-700 rounded-lg p-4 flex items-center">
                <div className="p-2 bg-blue-900 bg-opacity-30 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Twitter</div>
                  <div className="font-medium">{socialData.metrics.twitterFollowers.toLocaleString()} Followers</div>
                </div>
              </div>
            )}
            
            {socialData.metrics.telegramMembers !== undefined && (
              <div className="bg-gray-700 rounded-lg p-4 flex items-center">
                <div className="p-2 bg-blue-900 bg-opacity-30 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.19.651-.946 4.432-1.334 5.856-.166.611-.329.785-.541.785-.466 0-.663-.306-1.021-.6-.565-.466-1.221-1.001-1.539-1.258-.883-.716-1.096-.883.239-2.149.432-.41 2.118-1.944 2.157-2.109.005-.022.01-.104-.04-.148s-.146-.041-.208-.024c-.089.024-1.557.986-4.403 2.889-.415.284-.792.422-1.13.416-.373-.008-1.089-.208-1.622-.38-.656-.209-1.176-.32-1.132-.674.022-.183.259-.371.711-.566 2.782-1.215 4.635-2.014 5.56-2.4 2.646-1.104 3.2-1.294 3.556-1.302.789-.017.665.484.747 1.664z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Telegram</div>
                  <div className="font-medium">{socialData.metrics.telegramMembers.toLocaleString()} Members</div>
                </div>
              </div>
            )}
            
            {socialData.metrics.discordMembers !== undefined && (
              <div className="bg-gray-700 rounded-lg p-4 flex items-center">
                <div className="p-2 bg-indigo-900 bg-opacity-30 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Discord</div>
                  <div className="font-medium">{socialData.metrics.discordMembers.toLocaleString()} Members</div>
                </div>
              </div>
            )}
            
            {socialData.metrics.sentimentScore !== undefined && (
              <div className="bg-gray-700 rounded-lg p-4 flex items-center">
                <div className={`p-2 ${
                  socialData.metrics.sentimentScore >= 0.2 
                    ? 'bg-green-900 bg-opacity-30' 
                    : socialData.metrics.sentimentScore <= -0.2
                      ? 'bg-red-900 bg-opacity-30'
                      : 'bg-gray-600'
                } rounded-lg mr-3`}>
                  <svg className={`w-6 h-6 ${
                    socialData.metrics.sentimentScore >= 0.2 
                      ? 'text-green-400' 
                      : socialData.metrics.sentimentScore <= -0.2
                        ? 'text-red-400'
                        : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {socialData.metrics.sentimentScore >= 0.2 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : socialData.metrics.sentimentScore <= -0.2 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Sentiment</div>
                  <div className={`font-medium ${getSentimentColor(socialData.metrics.sentimentScore)}`}>
                    {socialData.metrics.sentimentScore >= 0.5 ? 'Very Positive' :
                     socialData.metrics.sentimentScore >= 0.2 ? 'Positive' :
                     socialData.metrics.sentimentScore >= -0.2 ? 'Neutral' :
                     socialData.metrics.sentimentScore >= -0.5 ? 'Negative' : 'Very Negative'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Recent Posts */}
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Recent Social Media Posts</h3>
        <div className="space-y-4">
          {socialData.posts.map(post => (
            <div key={post.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {getPlatformIcon(post.platform)}
                  <span className="ml-2 font-medium">{post.author}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(post.timestamp).toLocaleString()}
                </div>
              </div>
              
              <p className="text-sm mb-3">{post.content}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex space-x-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    {post.likes}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                    {post.comments}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    {post.shares}
                  </span>
                </div>
                <div className={`flex items-center ${getSentimentColor(post.sentiment)}`}>
                  <span>Sentiment: </span>
                  <span className="ml-1">
                    {post.sentiment >= 0.5 ? 'Very Positive' :
                     post.sentiment >= 0.2 ? 'Positive' :
                     post.sentiment >= -0.2 ? 'Neutral' :
                     post.sentiment >= -0.5 ? 'Negative' : 'Very Negative'}
                  </span>
                </div>
              </div>
              
              <a 
                href={post.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-indigo-400 hover:text-indigo-300"
              >
                View Original Post →
              </a>
            </div>
          ))}
        </div>
        
        {/* View More Button */}
        <div className="text-center mt-4">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};