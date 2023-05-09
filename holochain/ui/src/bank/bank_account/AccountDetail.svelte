<script lang="ts">
import { createEventDispatcher, onMount, getContext } from 'svelte';
import '@material/mwc-circular-progress';
import { decode } from '@msgpack/msgpack';
import type { Record, ActionHash, AppAgentClient, EntryHash, AgentPubKey, DnaHash } from '@holochain/client';
import { clientContext } from '../../contexts';
import type { Account } from './types';
import '@material/mwc-circular-progress';
import type { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-snackbar';
import '@material/mwc-icon-button';
import EditAccount from './EditAccount.svelte'; 

const dispatch = createEventDispatcher();

export let accountHash: ActionHash;

let client: AppAgentClient = (getContext(clientContext) as any).getClient();

let loading = true;
let error: any = undefined;

let record: Record | undefined;
let account: Account | undefined;

let editing = false;

let errorSnackbar: Snackbar;
  
$: editing,  error, loading, record, account;

onMount(async () => {
  if (accountHash === undefined) {
    throw new Error(`The accountHash input is required for the AccountDetail element`);
  }
  await fetchAccount();
});

async function fetchAccount() {
  loading = true;
  error = undefined;
  record = undefined;
  account = undefined;
  
  try {
    record = await client.callZome({
      cap_secret: null,
      role_name: 'bank',
      zome_name: 'bank_account',
      fn_name: 'get_account',
      payload: accountHash,
    });
    if (record) {
      account = decode((record.entry as any).Present.entry) as Account;
    }
  } catch (e) {
    error = e;
  }

  loading = false;
}

async function deleteAccount() {
  try {
    await client.callZome({
      cap_secret: null,
      role_name: 'bank',
      zome_name: 'bank_account',
      fn_name: 'delete_account',
      payload: accountHash,
    });
    dispatch('account-deleted', { accountHash: accountHash });
  } catch (e: any) {
    errorSnackbar.labelText = `Error deleting the account: ${e.data.data}`;
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
<span>Error fetching the account: {error.data.data}</span>
{:else if editing}
<EditAccount
  originalAccountHash={ accountHash}
  currentRecord={record}
  on:account-updated={async () => {
    editing = false;
    await fetchAccount()
  } }
  on:edit-canceled={() => { editing = false; } }
></EditAccount>
{:else}

<div style="display: flex; flex-direction: column">
  <div style="display: flex; flex-direction: row">
    <span style="flex: 1"></span>
    <mwc-icon-button style="margin-left: 8px" icon="edit" on:click={() => { editing = true; } }></mwc-icon-button>
    <mwc-icon-button style="margin-left: 8px" icon="delete" on:click={() => deleteAccount()}></mwc-icon-button>
  </div>

  <div style="display: flex; flex-direction: row; margin-bottom: 16px">
    <span style="margin-right: 4px"><strong>Name:</strong></span>
    <span style="white-space: pre-line">{ account.name }</span>
  </div>

  <div style="display: flex; flex-direction: row; margin-bottom: 16px">
    <span style="margin-right: 4px"><strong>Balance:</strong></span>
    <span style="white-space: pre-line">{ account.balance }</span>
  </div>

</div>
{/if}

