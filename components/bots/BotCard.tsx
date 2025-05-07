import React from "react";

type BotCardProps = {
  bot: {
    id: string;
    name: string;
    type: string;
    tradingPair: string;
    exchange: string;
    status: "active" | "paused" | "stopped";
    profit?: number;
    profitPercentage?: number;
  };
  onClick?: (botId: string) => void;
};

export default function BotCard({ bot, onClick }: BotCardProps) {
  const handleClick = () => {
    if (onClick) onClick(bot.id);
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg p-4 shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={handleClick}
      data-cy="bot-card"
      data-bot-id={bot.id}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold" data-cy="bot-name">{bot.name}</h3>
        <span 
          className={`px-2 py-1 text-xs rounded ${
            bot.status === "active" ? "bg-green-500" : 
            bot.status === "paused" ? "bg-yellow-500" : "bg-red-500"
          }`}
          data-cy="bot-status"
        >
          {bot.status}
        </span>
      </div>
      
      <div className="text-gray-300 mb-3" data-cy="bot-pair">
        {bot.tradingPair} • {bot.exchange}
      </div>
      
      {bot.profit !== undefined && (
        <div className="flex justify-between mt-4">
          <span className="text-gray-400">Profit</span>
          <span 
            className={bot.profit >= 0 ? "text-green-400" : "text-red-400"}
            data-cy="bot-profit"
          >
            {bot.profit >= 0 ? '+' : ''}{bot.profit.toFixed(2)} USD
            {bot.profitPercentage && (
              <span className="text-xs ml-1">
                ({bot.profitPercentage >= 0 ? '+' : ''}{bot.profitPercentage.toFixed(2)}%)
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
