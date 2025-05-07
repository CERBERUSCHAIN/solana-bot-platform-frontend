// CERBERUS Bot - Bundle Bot Configuration Component
// Created: 2025-05-05 21:43:55 UTC
// Author: CERBERUSCHAIN

import React, { useState } from 'react';
import { useForm, Controller, FieldValues, ControllerRenderProps, FieldError } from 'react-hook-form';
import { Switch } from './ui/Switch';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';

interface BundleBotConfigProps {
  initialConfig?: BundleSettings;
  wallets: WalletInfo[];
  onSubmit: (config: BundleSettings) => Promise<void>;
  isLoading?: boolean;
}

interface WalletInfo {
  address: string;
  balance: number;
  label?: string;
}

export interface BundleSettings {
  tokenAddress: string;
  tokenName: string;
  distributeEvenly: boolean;
  randomizeOrder: boolean;
  totalBuyAmountSol: number;
  minDelayMs: number;
  maxDelayMs: number;
  transactionCount?: number;
  maxSlippage: number;
  jitoTipAmount: number;
  autoJito: boolean;
  profitTargetPercentage: number;
  stopLossPercentage: number;
  dex: string;
  autoSellProfit: boolean;
  autoSellLoss: boolean;
  walletConfigs?: Record<string, {
    address: string;
    buyAmountSol?: number;
    priority: number;
  }>;
}

// Define the type for react-hook-form field props
interface FieldProps {
  field: ControllerRenderProps<BundleSettings, any>;
  fieldState: {
    error?: FieldError;
  };
}

export const BundleBotConfig: React.FC<BundleBotConfigProps> = ({
  initialConfig,
  wallets,
  onSubmit,
  isLoading = false
}) => {
  const [selectedWallets, setSelectedWallets] = useState<string[]>(
    initialConfig?.walletConfigs 
      ? Object.keys(initialConfig.walletConfigs) 
      : wallets.slice(0, 5).map(w => w.address)
  );
  
  const { control, handleSubmit, watch } = useForm<BundleSettings>({
    defaultValues: initialConfig || {
      tokenAddress: '',
      tokenName: '',
      distributeEvenly: true,
      randomizeOrder: false,
      totalBuyAmountSol: 0.5,
      minDelayMs: 500,
      maxDelayMs: 2000,
      maxSlippage: 10,
      jitoTipAmount: 0.001,
      autoJito: true,
      profitTargetPercentage: 50,
      stopLossPercentage: 20,
      dex: 'pump.fun',
      autoSellProfit: true,
      autoSellLoss: true
    }
  });
  
  const distributeEvenly = watch('distributeEvenly');
  
  const handleWalletToggle = (address: string) => {
    setSelectedWallets(prev => {
      if (prev.includes(address)) {
        return prev.filter(a => a !== address);
      } else {
        return [...prev, address];
      }
    });
  };
  
  const onFormSubmit = (data: BundleSettings) => {
    // Add selected wallets to the configuration
    if (!data.walletConfigs) {
      data.walletConfigs = {};
    }
    
    // Add wallets to config with priorities
    selectedWallets.forEach((address, index) => {
      data.walletConfigs![address] = {
        address,
        priority: index,
        buyAmountSol: distributeEvenly ? undefined : data.totalBuyAmountSol / selectedWallets.length
      };
    });
    
    onSubmit(data);
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Bundle Bot Configuration</h2>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tokenAddress">Token Address</Label>
            <Controller
              name="tokenAddress"
              control={control}
              rules={{ required: "Token address is required" }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="tokenAddress"
                    placeholder="Enter token address"
                    className={fieldState.error ? "border-red-500" : ""}
                    {...field}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tokenName">Token Name</Label>
            <Controller
              name="tokenName"
              control={control}
              render={({ field }: FieldProps) => (
                <Input
                  id="tokenName"
                  placeholder="Enter token name"
                  {...field}
                />
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalBuyAmountSol">Total Buy Amount (SOL)</Label>
            <Controller
              name="totalBuyAmountSol"
              control={control}
              rules={{ 
                required: "Amount is required",
                min: { value: 0.01, message: "Minimum 0.01 SOL" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="totalBuyAmountSol"
                    type="number"
                    step="0.01"
                    className={fieldState.error ? "border-red-500" : ""}
                    {...field}
                    onChange={e => aria-label="Input field" field.onChange(parseFloat(e.target.value))}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dex">Trading Platform</Label>
            <Controller
              name="dex"
              control={control}
              render={({ field }: FieldProps) => (
                <Select
                  id="dex"
                  options={[
                    { value: 'pump.fun', label: 'Pump.fun' },
                    { value: 'raydium', label: 'Raydium' },
                    { value: 'moonshot', label: 'Moonshot' }
                  ]}
                  {...field}
                /> aria-label="Selection field"
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minDelayMs">Min Delay (ms)</Label>
            <Controller
              name="minDelayMs"
              control={control}
              render={({ field }: FieldProps) => (
                <Input
                  id="minDelayMs"
                  type="number"
                  step="100"
                  min="0"
                  {...field}
                  onChange={e => aria-label="Input field" field.onChange(parseInt(e.target.value))}
                />
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxDelayMs">Max Delay (ms)</Label>
            <Controller
              name="maxDelayMs"
              control={control}
              render={({ field }: FieldProps) => (
                <Input
                  id="maxDelayMs"
                  type="number"
                  step="100"
                  min="0"
                  {...field}
                  onChange={e => aria-label="Input field" field.onChange(parseInt(e.target.value))}
                />
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxSlippage">Slippage (%)</Label>
            <Controller
              name="maxSlippage"
              control={control}
              render={({ field }: FieldProps) => (
                <Input
                  id="maxSlippage"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  {...field}
                  onChange={e => aria-label="Input field" field.onChange(parseFloat(e.target.value))}
                />
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jitoTipAmount">Jito Tip (SOL)</Label>
            <Controller
              name="jitoTipAmount"
              control={control}
              render={({ field }: FieldProps) => (
                <Input
                  id="jitoTipAmount"
                  type="number"
                  step="0.0001"
                  min="0"
                  {...field}
                  onChange={e => aria-label="Input field" field.onChange(parseFloat(e.target.value))}
                />
              )}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-8">
            <Controller
              name="autoJito"
              control={control}
              render={({ field }: FieldProps) => (
                <Switch
                  id="autoJito"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="autoJito">Enable Anti-MEV (Jito)</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="distributeEvenly"
              control={control}
              render={({ field }: FieldProps) => (
                <Switch
                  id="distributeEvenly"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="distributeEvenly">Distribute Funds Evenly</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Controller
              name="randomizeOrder"
              control={control}
              render={({ field }: FieldProps) => (
                <Switch
                  id="randomizeOrder"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="randomizeOrder">Randomize Buy Order</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profitTargetPercentage">Take Profit (%)</Label>
            <Controller
              name="profitTargetPercentage"
              control={control}
              render={({ field }: FieldProps) => (
                <Input
                  id="profitTargetPercentage"
                  type="number"
                  step="1"
                  min="1"
                  {...field}
                  onChange={e => aria-label="Input field" field.onChange(parseInt(e.target.value))}
                />
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stopLossPercentage">Stop Loss (%)</Label>
            <Controller
              name="stopLossPercentage"
              control={control}
              render={({ field }: FieldProps) => (
                <Input
                  id="stopLossPercentage"
                  type="number"
                  step="1"
                  min="1"
                  {...field}
                  onChange={e => aria-label="Input field" field.onChange(parseInt(e.target.value))}
                />
              )}
            />
          </div>
          
          <div className="space-y-2 flex items-center space-x-4 pt-8">
            <div className="flex items-center">
              <Controller
                name="autoSellProfit"
                control={control}
                render={({ field }: FieldProps) => (
                  <Switch
                    id="autoSellProfit"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="autoSellProfit" className="ml-2">Auto TP</Label>
            </div>
            
            <div className="flex items-center">
              <Controller
                name="autoSellLoss"
                control={control}
                render={({ field }: FieldProps) => (
                  <Switch
                    id="autoSellLoss"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="autoSellLoss" className="ml-2">Auto SL</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-md font-semibold">Select Wallets ({selectedWallets.length} selected)</h3>
          <div className="max-h-60 overflow-y-auto bg-gray-900 rounded p-2">
            {wallets.length === 0 ? (
              <p className="text-gray-400 p-2">No wallets available. Please add wallets first.</p>
            ) : (
              wallets.map(wallet => (
                <div 
                  key={wallet.address} 
                  className={`flex justify-between items-center p-2 hover:bg-gray-700 rounded cursor-pointer ${
                    selectedWallets.includes(wallet.address) ? 'bg-gray-700' : ''
                  }`}
                  onClick={() => handleWalletToggle(wallet.address)}
                >
                  <div>
                    <div className="font-mono text-sm text-gray-300">
                      {wallet.label || wallet.address.substring(0, 8) + '...' + wallet.address.slice(-4)}
                    </div>
                    <div className="text-xs text-gray-400">{wallet.balance} SOL</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedWallets.includes(wallet.address)} 
                    onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" {}} // Handled by parent div click
                    className="h-4 w-4 accent-indigo-500"
                    aria-label={`Select wallet ${wallet.label || wallet.address}`}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={isLoading || selectedWallets.length === 0}
          >
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </div>
  );
};
