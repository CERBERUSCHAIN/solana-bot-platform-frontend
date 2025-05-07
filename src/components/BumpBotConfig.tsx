// CERBERUS Bot - Bump Bot Configuration Component
// Created: 2025-05-05 21:57:04 UTC
// Author: CERBERUSCHAIN

import React, { useState } from 'react';
import { useForm, Controller, FieldValues, ControllerRenderProps } from 'react-hook-form';
import { Switch } from './ui/Switch';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';

interface BumpBotConfigProps {
  initialConfig?: BumpSettings;
  wallets: WalletInfo[];
  onSubmit: (config: BumpSettings) => Promise<void>;
  isLoading?: boolean;
}

interface WalletInfo {
  address: string;
  balance: number;
  label?: string;
}

// Define the type for react-hook-form field props
interface FieldProps {
  field: ControllerRenderProps<BumpSettings, any>;
  fieldState: {
    error?: {
      message?: string;
    };
  };
}

export interface ScheduleWindow {
  startTime: string;
  endTime: string;
  days: number[];
}

export interface BumpSettings {
  tokenAddress: string;
  tokenName: string;
  totalAllocationSol: number;
  minTransactionAmountSol: number;
  maxTransactionAmountSol: number;
  minIntervalSeconds: number;
  maxIntervalSeconds: number;
  buySellRatio: number;
  maxSlippage: number;
  maintainPrice: boolean;
  targetPriceSol?: number;
  dex: string;
  useJito: boolean;
  jitoTipAmount: number;
  commentMessage?: string;
  scheduleType: 'continuous' | 'scheduled';
  scheduleWindows?: ScheduleWindow[];
  selectedWallets?: string[];
}

export const BumpBotConfig: React.FC<BumpBotConfigProps> = ({
  initialConfig,
  wallets,
  onSubmit,
  isLoading = false
}) => {
  const [selectedWallets, setSelectedWallets] = useState<string[]>(
    initialConfig?.selectedWallets || wallets.slice(0, 2).map(w => w.address)
  );
  
  const { control, handleSubmit, watch } = useForm<BumpSettings>({
    defaultValues: initialConfig || {
      tokenAddress: '',
      tokenName: '',
      totalAllocationSol: 1.0,
      minTransactionAmountSol: 0.01,
      maxTransactionAmountSol: 0.05,
      minIntervalSeconds: 300,
      maxIntervalSeconds: 1800,
      buySellRatio: 1.0,
      maxSlippage: 5.0,
      maintainPrice: false,
      dex: 'pump.fun',
      useJito: true,
      jitoTipAmount: 0.0005,
      scheduleType: 'continuous'
    }
  });
  
  const maintainPrice = watch('maintainPrice');
  const scheduleType = watch('scheduleType');
  
  const handleWalletToggle = (address: string) => {
    setSelectedWallets(prev => {
      if (prev.includes(address)) {
        return prev.filter(a => a !== address);
      } else {
        return [...prev, address];
      }
    });
  };
  
  const onFormSubmit = (data: BumpSettings) => {
    // Add selected wallets to the configuration
    data.selectedWallets = selectedWallets;
    onSubmit(data);
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Bump Bot Configuration</h2>
      
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
            <Label htmlFor="totalAllocationSol">Total Allocation (SOL)</Label>
            <Controller
              name="totalAllocationSol"
              control={control}
              rules={{ 
                required: "Amount is required",
                min: { value: 0.1, message: "Minimum 0.1 SOL" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="totalAllocationSol"
                    type="number"
                    step="0.1"
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minTransactionAmountSol">Min Transaction (SOL)</Label>
            <Controller
              name="minTransactionAmountSol"
              control={control}
              rules={{ 
                required: "Amount is required",
                min: { value: 0.001, message: "Minimum 0.001 SOL" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="minTransactionAmountSol"
                    type="number"
                    step="0.001"
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
            <Label htmlFor="maxTransactionAmountSol">Max Transaction (SOL)</Label>
            <Controller
              name="maxTransactionAmountSol"
              control={control}
              rules={{ 
                required: "Amount is required",
                min: { value: 0.001, message: "Minimum 0.001 SOL" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="maxTransactionAmountSol"
                    type="number"
                    step="0.001"
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
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minIntervalSeconds">Min Interval (seconds)</Label>
            <Controller
              name="minIntervalSeconds"
              control={control}
              rules={{ 
                required: "Interval is required",
                min: { value: 30, message: "Minimum 30 seconds" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="minIntervalSeconds"
                    type="number"
                    step="10"
                    className={fieldState.error ? "border-red-500" : ""}
                    {...field}
                    onChange={e => aria-label="Input field" field.onChange(parseInt(e.target.value))}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxIntervalSeconds">Max Interval (seconds)</Label>
            <Controller
              name="maxIntervalSeconds"
              control={control}
              rules={{ 
                required: "Interval is required",
                min: { value: 60, message: "Minimum 60 seconds" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="maxIntervalSeconds"
                    type="number"
                    step="10"
                    className={fieldState.error ? "border-red-500" : ""}
                    {...field}
                    onChange={e => aria-label="Input field" field.onChange(parseInt(e.target.value))}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buySellRatio">Buy/Sell Ratio</Label>
            <Controller
              name="buySellRatio"
              control={control}
              rules={{ 
                required: "Ratio is required",
                min: { value: 0.1, message: "Minimum 0.1" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="buySellRatio"
                    type="number"
                    step="0.1"
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
            <p className="text-xs text-gray-400">
              Ratio of buys to sells (1.0 = equal, 2.0 = twice as many buys)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxSlippage">Max Slippage (%)</Label>
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
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Controller
              name="maintainPrice"
              control={control}
              render={({ field }: FieldProps) => (
                <Switch
                  id="maintainPrice"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="maintainPrice">Maintain Token Price</Label>
          </div>
            
          {maintainPrice && (
            <div className="mt-2">
              <Label htmlFor="targetPriceSol">Target Price (SOL)</Label>
              <Controller
                name="targetPriceSol"
                control={control}
                rules={{ required: "Target price is required when price maintenance is enabled" }}
                render={({ field, fieldState }: FieldProps) => (
                  <>
                    <Input
                      id="targetPriceSol"
                      type="number"
                      step="0.0000001"
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
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scheduleType">Schedule Type</Label>
            <Controller
              name="scheduleType"
              control={control}
              render={({ field }: FieldProps) => (
                <Select
                  id="scheduleType"
                  options={[
                    { value: 'continuous', label: 'Run Continuously' },
                    { value: 'scheduled', label: 'Use Schedule Windows' }
                  ]}
                  {...field}
                /> aria-label="Selection field"
              )}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-8">
            <Controller
              name="useJito"
              control={control}
              render={({ field }: FieldProps) => (
                <Switch
                  id="useJito"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="useJito">Enable Anti-MEV (Jito)</Label>
          </div>
        </div>
        
        {scheduleType === 'scheduled' && (
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-sm font-medium text-white mb-2">Schedule Windows</h3>
            <p className="text-xs text-gray-400 mb-3">
              Define time windows when the bump bot should be active. For advanced scheduling, use the web dashboard.
            </p>
            {/* Schedule windows would be implemented here with time pickers and day selectors */}
            <div className="text-center text-gray-400 py-2">
              Schedule configuration is available in the web dashboard
            </div>
          </div>
        )}
        
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
