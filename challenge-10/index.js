#!/usr/bin/env node
const { program } = require('commander');
const axios = require('axios');

const pkg = require('./package.json');

program.version(pkg.version);

program
  .option('-p, --port <value>', 'sidecar server port', '8080')
  .option('-h, --host <value>', 'sidecar server host', '127.0.0.1')
  .option('-s, --ssl', 'enable https')
  .option('-d, --depth <value>', 'the number of eras to query for payouts of', '1')
  .requiredOption('-a, --account <value>', 'account to read pending payouts');

program.parse(process.argv);

async function run() {
  const baseUrl = `http${program.ssl ? 's' : ''}://${program.host}:${program.port}`;
  const { data } = await axios.get(`${baseUrl}/accounts/${program.account}/staking-payouts?depth=${program.depth}&unclaimedOnly=true`);

  const totalPendingPayouts = data.erasPayouts.reduce((pendingPayouts, { payouts } = {}) =>
    payouts ? pendingPayouts + payouts.reduce((acc, { claimed, nominatorStakingPayout } = {}) =>
      claimed ? acc : acc + (Number.parseInt(nominatorStakingPayout) || 0), 0) : pendingPayouts, 0);

  console.log(`Pending payouts: ${totalPendingPayouts}`);
}

run().catch(e => console.error(e)).finally(() => process.exit());
