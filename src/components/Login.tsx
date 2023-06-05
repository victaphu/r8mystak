"use client"
import { useWalletLogin } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function LoginButton() {
  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect, disconnectAsync } = useDisconnect();
  const { connectAsync } = useConnect({
    connector: connectors[1],
  });
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