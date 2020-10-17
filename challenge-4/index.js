#!/usr/bin/env node
const { program } = require('commander');
const { ApiPromise, WsProvider } = require('@polkadot/api');

const pkg = require('./package.json');

program.version(pkg.version);

program
  .option('-b, --block <number>', 'block number to search');

program.parse(process.argv);

async function run() {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  let blockHeader;

  if (program.block) {
    const blockNumber = Number.parseInt(program.block);

    if (!Number.isNaN(blockNumber)) {
      const blockHash = await api.rpc.chain.getBlockHash(blockNumber);

      blockHeader = await api.rpc.chain.getHeader(blockHash);
    }
  }

  if (!blockHeader) {
    blockHeader = await api.rpc.chain.getHeader();
  }

  if (!blockHeader) {
    throw new Error('Unable to find the block header');
  }

  console.log(
`Block number: ${blockHeader.number}
Parent hash: ${blockHeader.parentHash}
State root: ${blockHeader.stateRoot}
Extrinsics root: ${blockHeader.extrinsicsRoot}`
  );
}

run().catch(e => console.error(e)).finally(() => process.exit());
