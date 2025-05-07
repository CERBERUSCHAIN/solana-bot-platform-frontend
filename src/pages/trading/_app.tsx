// CERBERUS Bot - App Component
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}