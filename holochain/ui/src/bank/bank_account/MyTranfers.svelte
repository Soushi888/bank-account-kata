<script lang="ts">
import { onMount, getContext } from 'svelte';
import '@material/mwc-circular-progress';
import type { EntryHash, Record, AgentPubKey, ActionHash, AppAgentClient, NewEntryAction } from '@holochain/client';
import { clientContext } from '../../contexts';
import TransferDetail from './TransferDetail.svelte';
import type { BankAccountSignal } from './types';

export let author: AgentPubKey;

let client: AppAgentClient = (getContext(clientContext) as any).getClient();

let hashes: Array<ActionHash> | undefined;
let loading = true;
let error: any = undefined;

$: hashes, loading, error;

onMount(async () => {
    if (author === undefined) {
      throw new Error(`The author input is required for the MyTranfers element`);
    }


  await fetchTransfers();
  client.on('signal', signal => {
    if (signal.zome_name !== 'bank_account') return;
    const payload = signal.payload as BankAccountSignal;
    if (payload.type !== 'EntryCreated') return;
    if (payload.app_entry.type !== 'Transfer') return;
    if (author.toString() !== client.myPubKey.toString()) return;
    hashes = [...hashes, payload.action.hashed.hash];
  });
});

async function fetchTransfers() {
  try {
    const records = await client.callZome({
      cap_secret: null,
      role_name: 'bank',
      zome_name: 'bank_account',
      fn_name: 'get_my_tranfers',
      payload: author,
    });
    hashes = records.map(r => r.signed_action.hashed.hash);
  } catch (e) {
    error = e;
  }
  loading = false;
}

</script>

{#if loading}
<div style="display: flex; flex: 1; align-items: center; justify-content: center">
  <mwc-circular-progress indeterminate></mwc-circular-progress>
</div>
{:else if error}
<span>Error fetching the transfers: {error.data.data}.</span>
{:else if hashes.length === 0}
<span>No transfers found for this author.</span>
{:else}
<div style="display: flex; flex-direction: column">
  {#each hashes as hash}
    <div style="margin-bottom: 8px;">
      <TransferDetail transferHash={hash}  on:transfer-deleted={() => fetchTransfers()}></TransferDetail>
    </div>
  {/each}
</div>
{/if}

