<script lang="ts">
import { createEventDispatcher, getContext, onMount } from 'svelte';
import type { AppAgentClient, Record, EntryHash, AgentPubKey, ActionHash, DnaHash } from '@holochain/client';
import { clientContext } from '../../contexts';
import type { Transfer } from './types';
import '@material/mwc-button';
import '@material/mwc-snackbar';
import type { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-slider';

let client: AppAgentClient = (getContext(clientContext) as any).getClient();

const dispatch = createEventDispatcher();

export let from!: EntryHash;

export let to!: EntryHash;


let amount: number = 0;

let errorSnackbar: Snackbar;

$: from, to, amount;
$: isTransferValid = true && true;

onMount(() => {
  if (from === undefined) {
    throw new Error(`The from input is required for the CreateTransfer element`);
  }
  if (to === undefined) {
    throw new Error(`The to input is required for the CreateTransfer element`);
  }
});

async function createTransfer() {  
  const transferEntry: Transfer = { 
    from: from!,
    to: to!,
    amount: amount!,
  };
  
  try {
    const record: Record = await client.callZome({
      cap_secret: null,
      role_name: 'bank',
      zome_name: 'bank_account',
      fn_name: 'create_transfer',
      payload: transferEntry,
    });
    dispatch('transfer-created', { transferHash: record.signed_action.hashed.hash });
  } catch (e) {
    errorSnackbar.labelText = `Error creating the transfer: ${e.data.data}`;
    errorSnackbar.show();
  }
}

</script>
<mwc-snackbar bind:this={errorSnackbar} leading>
</mwc-snackbar>
<div style="display: flex; flex-direction: column">
  <span style="font-size: 18px">Create Transfer</span>
  

  <div style="margin-bottom: 16px">
    <div style="display: flex; flex-direction: row">
      <span style="margin-right: 4px">Amount</span>
    
      <mwc-slider value={ amount } on:input={e => { amount = e.detail.value; } } discrete></mwc-slider>
    </div>          
  </div>
            

  <mwc-button 
    raised
    label="Create Transfer"
    disabled={!isTransferValid}
    on:click={() => createTransfer()}
  ></mwc-button>
</div>
