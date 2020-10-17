import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

import './App.css';

function App() {
  const [api, setApi] = useState(null);
  const [blockHeader, setBlockHeader] = useState(null);

  useEffect(() => {
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');

    ApiPromise.create({ provider: wsProvider }).then(setApi);
  }, []);

  useEffect(() => {
    if (api) {
      const unsubscribePromise = api.rpc.chain.subscribeNewHeads(setBlockHeader);

      return () => unsubscribePromise.then(unsubscribe => unsubscribe());
    }
  }, [api]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Polkadot latest block info</h1>
        {blockHeader && (
          <div>
            <p>Block number: {blockHeader.number.toString()}</p>
            <p>Parent hash: {blockHeader.parentHash.toString()}</p>
            <p>State root: {blockHeader.stateRoot.toString()}</p>
            <p>Extrinsics root: {blockHeader.extrinsicsRoot.toString()}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
