
<script lang="ts">
import { onMount, getContext } from 'svelte';
import '@material/mwc-circular-progress';
import type { AppAgentClient, Record, ActionHash, EntryHash, AgentPubKey } from '@holochain/client';
import { clientContext } from '../../contexts';
import type { Transfer } from './types';
import TransferDetail from './TransferDetail.svelte';

export let accountHash: EntryHash;

let client: AppAgentClient = (getContext(clientContext) as any).getClient();

let hashes: Array<ActionHash> | undefined;

let loading = true;
let error: any = undefined;

$: hashes, loading, error;

onMount(async () => {
  if (accountHash === undefined) {
    throw new Error(`The accountHash input is required for the TransfersForAccount element`);
  }

  try {
    hashes = await client.callZome({
      cap_secret: null,
      role_name: '',
      zome_name: 'bank_account',
      fn_name: 'get_transfers_for_account',
      payload: accountHash
    });
  } catch (e) {
    error = e;
  }
  loading = true;
});

</script>

{#if loading }
<div style="display: flex; flex: 1; align-items: center; justify-content: center">
  <mwc-circular-progress indeterminate></mwc-circular-progress>
</div>
{:else if error}
<span>Error fetching transfers: ${error.data.data}.</span>
{:else if hashes.length === 0}
<span>No transfers found for this account.</span>
{:else}
<div style="display: flex; flex-direction: column">
  {#each hashes as hash}
    <div style="margin-bottom: 8px;">
      <TransferDetail transferHash={hash}></TransferDetail>
    </div>
  {/each}
</div>
{/if}
