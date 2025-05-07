// CERBERUS Bot - Volume Bot Configuration Component
// Created: 2025-05-05 22:08:53 UTC
// Author: CERBERUSCHAIN1

import React, { useState } from 'react';
import { useForm, Controller, FieldValues, ControllerRenderProps } from 'react-hook-form';
import { Switch } from './ui/Switch';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';

interface VolumeBotConfigProps {
  initialConfig?: VolumeSettings;
  wallets: WalletInfo[];
  onSubmit: (config: VolumeSettings) => Promise<void>;
  isLoading?: boolean;
}

interface WalletInfo {
  address: string;
  balance: number;
  label?: string;
}

// Define the type for react-hook-form field props
interface FieldProps {
  field: ControllerRenderProps<VolumeSettings, any>;
  fieldState: {
    error?: {
      message?: string;
    };
  };
}

export interface VolumeSettings {
  tokenAddress: string;
  tokenName: string;
  totalAllocationSol: number;
  targetVolumeSol: number;
  campaignDurationHours: number;
  distributeEvenly: boolean;
  initialPumpPercentage: number;
  maxSlippage: number;
  maxTransactionSizeSol: number;
  dex: string;
  useJito: boolean;
  jitoTipAmount: number;
  randomizeWallets: boolean;
  allowSimultaneousTrades: boolean;
  selectedWallets?: string[];
}

export const VolumeBotConfig: React.FC<VolumeBotConfigProps> = ({
  initialConfig,
  wallets,
  onSubmit,
  isLoading = false
}) => {
  const [selectedWallets, setSelectedWallets] = useState<string[]>(
    initialConfig?.selectedWallets || wallets.slice(0, 3).map(w => w.address)
  );
  
  const { control, handleSubmit, watch } = useForm<VolumeSettings>({
    defaultValues: initialConfig || {
      tokenAddress: '',
      tokenName: '',
      totalAllocationSol: 3.0,
      targetVolumeSol: 30.0,
      campaignDurationHours: 24,
      distributeEvenly: true,
      initialPumpPercentage: 20,
      maxSlippage: 5.0,
      maxTransactionSizeSol: 0.25,
      dex: 'pump.fun',
      useJito: true,
      jitoTipAmount: 0.001,
      randomizeWallets: true,
      allowSimultaneousTrades: false
    }
  });
  
  const handleWalletToggle = (address: string) => {
    setSelectedWallets(prev => {
      if (prev.includes(address)) {
        return prev.filter(a => a !== address);
      } else {
        return [...prev, address];
      }
    });
  };
  
  const onFormSubmit = (data: VolumeSettings) => {
    // Add selected wallets to the configuration
    data.selectedWallets = selectedWallets;
    onSubmit(data);
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Volume Bot Configuration</h2>
      
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
                min: { value: 0.5, message: "Minimum 0.5 SOL" }
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
            <Label htmlFor="targetVolumeSol">Target 24h Volume (SOL)</Label>
            <Controller
              name="targetVolumeSol"
              control={control}
              rules={{ 
                required: "Volume is required",
                min: { value: 1, message: "Minimum 1 SOL" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="targetVolumeSol"
                    type="number"
                    step="1"
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
            <Label htmlFor="campaignDurationHours">Campaign Duration (hours)</Label>
            <Controller
              name="campaignDurationHours"
              control={control}
              rules={{ 
                required: "Duration is required",
                min: { value: 1, message: "Minimum 1 hour" },
                max: { value: 168, message: "Maximum 168 hours (7 days)" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="campaignDurationHours"
                    type="number"
                    step="1"
                    min="1"
                    max="168"
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
            <Label htmlFor="initialPumpPercentage">Initial Pump (%)</Label>
            <Controller
              name="initialPumpPercentage"
              control={control}
              rules={{
                min: { value: 0, message: "Minimum 0%" },
                max: { value: 100, message: "Maximum 100%" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="initialPumpPercentage"
                    type="number"
                    step="5"
                    min="0"
                    max="100"
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
            <p className="text-xs text-gray-400">
              Percentage of total allocation used for initial price pump
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxTransactionSizeSol">Max Transaction Size (SOL)</Label>
            <Controller
              name="maxTransactionSizeSol"
              control={control}
              rules={{ 
                required: "Transaction size is required",
                min: { value: 0.01, message: "Minimum 0.01 SOL" }
              }}
              render={({ field, fieldState }: FieldProps) => (
                <>
                  <Input
                    id="maxTransactionSizeSol"
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
        
        <div className="grid grid-cols-2 gap-4">
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
                  max="50"
                  {...field}
                  onChange={e => aria-label="Input field" field.onChange(parseFloat(e.target.value))}
                />
              )}
            />
          </div>
          
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
            <Label htmlFor="distributeEvenly">Distribute Trades Evenly</Label>
          </div>
          
          <div className="flex items-center space-x-2">
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="randomizeWallets"
              control={control}
              render={({ field }: FieldProps) => (
                <Switch
                  id="randomizeWallets"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="randomizeWallets">Randomize Wallet Usage</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Controller
              name="allowSimultaneousTrades"
              control={control}
              render={({ field }: FieldProps) => (
                <Switch
                  id="allowSimultaneousTrades"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="allowSimultaneousTrades">Allow Simultaneous Trades</Label>
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
