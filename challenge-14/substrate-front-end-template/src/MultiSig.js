import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function MultiSig ({ accountPair }) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);

  const [formState, setFormState] = useState({
    addressTo: null,
    amount: null,
    signatories: '',
    threshold: null,
    maxWeight: null
  });

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));

  const { addressTo, amount, signatories, threshold, maxWeight } = formState;

  const parsedSignatories = signatories.split(',').map(i => i.trim());

  const attrs = {
    palletRpc: 'multisig',
    callable: 'asMulti',
    inputParams: [
      threshold,
      parsedSignatories,
      null,
      api.tx.balances.transfer(addressTo, amount),
      false,
      maxWeight
    ],
    paramFields: [true, true, { optional: true }, true, true, true]
  };

  return (
    <Grid.Column width={8}>
      <h1>MultiSig</h1>
      <Form>
        <Form.Field>
          <Input
            fluid
            label='To'
            type='text'
            placeholder='address'
            state='addressTo'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Amount'
            type='number'
            state='amount'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Other signatories'
            type='text'
            placeholder='addresses'
            state='signatories'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Threshold'
            type='number'
            state='threshold'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Max weight'
            type='number'
            state='maxWeight'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Submit'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={attrs}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
