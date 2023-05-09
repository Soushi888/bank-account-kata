<script lang="ts">
import { createEventDispatcher, getContext, onMount } from 'svelte';
import type { AppAgentClient, Record, EntryHash, AgentPubKey, DnaHash, ActionHash } from '@holochain/client';
import { decode } from '@msgpack/msgpack';
import { clientContext } from '../../contexts';
import type { Transfer } from './types';
import '@material/mwc-button';
import '@material/mwc-snackbar';
import type { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-slider';

let client: AppAgentClient = (getContext(clientContext) as any).getClient();

const dispatch = createEventDispatcher();

export let originalTransferHash!: ActionHash;

export let currentRecord!: Record;
let currentTransfer: Transfer = decode((currentRecord.entry as any).Present.entry) as Transfer;

let amount: number | undefined = currentTransfer.amount;

let errorSnackbar: Snackbar;

$: amount;
$: isTransferValid = true && true;

onMount(() => {
  if (currentRecord === undefined) {
    throw new Error(`The currentRecord input is required for the EditTransfer element`);
  }
  if (originalTransferHash === undefined) {
    throw new Error(`The originalTransferHash input is required for the EditTransfer element`);
  }
});

async function updateTransfer() {

  const transfer: Transfer = { 
    amount: amount!,
    from: currentTransfer.from,
    to: currentTransfer.to,
  };

  try {
    const updateRecord: Record = await client.callZome({
      cap_secret: null,
      role_name: 'bank',
      zome_name: 'bank_account',
      fn_name: 'update_transfer',
      payload: {
        original_transfer_hash: originalTransferHash,
        previous_transfer_hash: currentRecord.signed_action.hashed.hash,
        updated_transfer: transfer
      }
    });
  
    dispatch('transfer-updated', { actionHash: updateRecord.signed_action.hashed.hash });
  } catch (e) {
    errorSnackbar.labelText = `Error updating the transfer: ${e.data.data}`;
    errorSnackbar.show();
  }
}

</script>
<mwc-snackbar bind:this={errorSnackbar} leading>
</mwc-snackbar>
<div style="display: flex; flex-direction: column">
  <span style="font-size: 18px">Edit Transfer</span>
  
  <div style="margin-bottom: 16px">
    <div style="display: flex; flex-direction: row">
      <span style="margin-right: 4px">Amount</span>
    
      <mwc-slider value={ amount } on:input={e => { amount = e.detail.value; } } discrete></mwc-slider>
    </div>    
  </div>


  <div style="display: flex; flex-direction: row">
    <mwc-button
      outlined
      label="Cancel"
      on:click={() => dispatch('edit-canceled')}
      style="flex: 1; margin-right: 16px"
    ></mwc-button>
    <mwc-button 
      raised
      label="Save"
      disabled={!isTransferValid}
      on:click={() => updateTransfer()}
      style="flex: 1;"
    ></mwc-button>
  </div>
</div>
