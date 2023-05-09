<script lang="ts">
import { createEventDispatcher, getContext, onMount } from 'svelte';
import type { AppAgentClient, Record, EntryHash, AgentPubKey, DnaHash, ActionHash } from '@holochain/client';
import { decode } from '@msgpack/msgpack';
import { clientContext } from '../../contexts';
import type { Account } from './types';
import '@material/mwc-button';
import '@material/mwc-snackbar';
import type { Snackbar } from '@material/mwc-snackbar';

import '@material/mwc-slider';
import '@material/mwc-textfield';
let client: AppAgentClient = (getContext(clientContext) as any).getClient();

const dispatch = createEventDispatcher();

export let originalAccountHash!: ActionHash;

export let currentRecord!: Record;
let currentAccount: Account = decode((currentRecord.entry as any).Present.entry) as Account;

let name: string | undefined = currentAccount.name;
let balance: number | undefined = currentAccount.balance;

let errorSnackbar: Snackbar;

$: name, balance;
$: isAccountValid = true && name !== '' && true;

onMount(() => {
  if (currentRecord === undefined) {
    throw new Error(`The currentRecord input is required for the EditAccount element`);
  }
  if (originalAccountHash === undefined) {
    throw new Error(`The originalAccountHash input is required for the EditAccount element`);
  }
});

async function updateAccount() {

  const account: Account = { 
    name: name!,
    balance: balance!,
  };

  try {
    const updateRecord: Record = await client.callZome({
      cap_secret: null,
      role_name: 'bank',
      zome_name: 'bank_account',
      fn_name: 'update_account',
      payload: {
        original_account_hash: originalAccountHash,
        previous_account_hash: currentRecord.signed_action.hashed.hash,
        updated_account: account
      }
    });
  
    dispatch('account-updated', { actionHash: updateRecord.signed_action.hashed.hash });
  } catch (e) {
    errorSnackbar.labelText = `Error updating the account: ${e.data.data}`;
    errorSnackbar.show();
  }
}

</script>
<mwc-snackbar bind:this={errorSnackbar} leading>
</mwc-snackbar>
<div style="display: flex; flex-direction: column">
  <span style="font-size: 18px">Edit Account</span>
  
  <div style="margin-bottom: 16px">
    <mwc-textfield outlined label="Name" value={ name } on:input={e => { name = e.target.value; } } required></mwc-textfield>    
  </div>

  <div style="margin-bottom: 16px">
    <div style="display: flex; flex-direction: row">
      <span style="margin-right: 4px">Balance</span>
    
      <mwc-slider value={ balance } on:input={e => { balance = e.detail.value; } } discrete></mwc-slider>
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
      disabled={!isAccountValid}
      on:click={() => updateAccount()}
      style="flex: 1;"
    ></mwc-button>
  </div>
</div>
