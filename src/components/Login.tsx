"use client"
import { useWalletLogin } from '@lens-protocol/react-web';
import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function LoginButton() {
  const { execute: login } = useWalletLogin();
  const { isConnected, address, isConnecting, isDisconnected } = useAccount();
  const { connectors, connect, pendingConnector } = useConnect();
  const { disconnect, disconnectAsync } = useDisconnect();
  const { connectAsync } = useConnect({
    connector: connectors[1],
  });

  useEffect(() => {
    if (!isDisconnected) return;
  
    // if wagmi.connected set to true, then wagmi will not show modal
    // to reconnect user wallet, but instead will use prev connection
    // I found this example in this public repo: https://github.com/sumicet/web3auth-modal-wagmi
    const wagmiConnected = localStorage.getItem("wagmi.connected");
    const isWagmiConnected = wagmiConnected
      ? JSON.parse(wagmiConnected)
      : false;

    if (!isWagmiConnected) return;
    connect({ connector: connectors[1] });
  }, [connect, connectors]);

  console.log('>>>', isConnected, address, isConnecting, isDisconnected);

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();
    const signer = await connector?.getSigner();
    console.log(signer);
    await login(signer);
  };

  if (isConnected) {
    return (
      <button className='btn btn-primary' onClick={disconnect as any}>
        Connected
      </button>
    );
  } else {
    return (
      <button className='btn btn-primary' onClick={onLoginClick}>
        Connect
      </button>
    );
  }
}