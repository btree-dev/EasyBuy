const COINBASE_ONRAMP_CONFIG = {
  appId: import.meta.env.VITE_COINBASE_APP_ID || 'test_app',
  widgetParameters: {
    destinationWallets: [{
      address: import.meta.env.VITE_DESTINATION_ADDRESS || '0x0000000000000000000000000000000000000000',
      assets: ['ETH'],
    }],
  },
};

export async function initOnramp(amount: string) {
  try {
    // @ts-ignore - Coinbase SDK types not available
    const { CoinbaseOnrampSDK } = window;
    
    if (!CoinbaseOnrampSDK) {
      throw new Error("Coinbase Onramp SDK not loaded");
    }

    const instance = new CoinbaseOnrampSDK({
      ...COINBASE_ONRAMP_CONFIG,
      onSuccess: () => {
        return { status: 'completed' };
      },
      onExit: () => {
        return { status: 'failed' };
      },
      onEvent: (event: any) => {
        console.log('Onramp event:', event);
      },
    });

    await instance.init();
    await instance.open({
      presetCryptoAmount: amount,
      destinationAsset: 'ETH',
    });

    return instance;
  } catch (error) {
    console.error('Failed to initialize Coinbase Onramp:', error);
    throw error;
  }
}
