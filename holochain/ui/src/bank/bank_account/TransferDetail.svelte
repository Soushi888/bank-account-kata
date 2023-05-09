<script lang="ts">
import { createEventDispatcher, onMount, getContext } from 'svelte';
import '@material/mwc-circular-progress';
import { decode } from '@msgpack/msgpack';
import type { Record, ActionHash, AppAgentClient, EntryHash, AgentPubKey, DnaHash } from '@holochain/client';
import { clientContext } from '../../contexts';
import type { Transfer } from './types';
import '@material/mwc-circular-progress';
import type { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-snackbar';
import '@material/mwc-icon-button';
import EditTransfer from './EditTransfer.svelte'; 

const dispatch = createEventDispatcher();

export let transferHash: ActionHash;

let client: AppAgentClient = (getContext(clientContext) as any).getClient();

let loading = true;
let error: any = undefined;

let record: Record | undefined;
let transfer: Transfer | undefined;

let editing = false;

let errorSnackbar: Snackbar;
  
$: editing,  error, loading, record, transfer;

onMount(async () => {
  if (transferHash === undefined) {
    throw new Error(`The transferHash input is required for the TransferDetail element`);
  }
  await fetchTransfer();
});

async function fetchTransfer() {
  loading = true;
  error = undefined;
  record = undefined;
  transfer = undefined;
  
  try {
    record = await client.callZome({
      cap_secret: null,
      role_name: 'bank',
      zome_name: 'bank_account',
      fn_name: 'get_transfer',
      payload: transferHash,
    });
    if (record) {
      transfer = decode((record.entry as any).Present.entry) as Transfer;
    }
  } catch (e) {
    error = e;
  }

  loading = false;
}

async function deleteTransfer() {
  try {
    await client.callZome({
      cap_secret: null,
      role_name: 'bank',
      zome_name: 'bank_account',
      fn_name: 'delete_transfer',
      payload: transferHash,
    });
    dispatch('transfer-deleted', { transferHash: transferHash });
  } catch (e: any) {
    errorSnackbar.labelText = `Error deleting the transfer: ${e.data.data}`;
    errorSnackbar.show();
  }
}
</script>

<mwc-snackbar bind:this={errorSnackbar} leading>
</mwc-snackbar>

{#if loading}
<div style="display: flex; flex: 1; align-items: center; justify-content: center">
  <mwc-circular-progress indeterminate></mwc-circular-progress>
</div>
{:else if error}
<span>Error fetching the transfer: {error.data.data}</span>
{:else if editing}
<EditTransfer
  originalTransferHash={ transferHash}
  currentRecord={record}
  on:transfer-updated={async () => {
    editing = false;
    await fetchTransfer()
  } }
  on:edit-canceled={() => { editing = false; } }
></EditTransfer>
{:else}

<div style="display: flex; flex-direction: column">
  <div style="display: flex; flex-direction: row">
    <span style="flex: 1"></span>
    <mwc-icon-button style="margin-left: 8px" icon="edit" on:click={() => { editing = true; } }></mwc-icon-button>
    <mwc-icon-button style="margin-left: 8px" icon="delete" on:click={() => deleteTransfer()}></mwc-icon-button>
  </div>

  <div style="display: flex; flex-direction: row; margin-bottom: 16px">
    <span style="margin-right: 4px"><strong>Amount:</strong></span>
    <span style="white-space: pre-line">{ transfer.amount }</span>
  </div>

</div>
{/if}

