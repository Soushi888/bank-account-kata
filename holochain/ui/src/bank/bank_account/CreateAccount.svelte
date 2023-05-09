<script lang="ts">
import { createEventDispatcher, getContext, onMount } from 'svelte';
import type { AppAgentClient, Record, EntryHash, AgentPubKey, ActionHash, DnaHash } from '@holochain/client';
import { clientContext } from '../../contexts';
import type { Account } from './types';
import '@material/mwc-button';
import '@material/mwc-snackbar';
import type { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-slider';

import '@material/mwc-textfield';
let client: AppAgentClient = (getContext(clientContext) as any).getClient();

const dispatch = createEventDispatcher();


let name: string = '';
let balance: number = 0;

let errorSnackbar: Snackbar;

$: name, balance;
$: isAccountValid = true && name !== '' && true;

onMount(() => {
});

async function createAccount() {  
  const accountEntry: Account = { 
    name: name!,
    balance: balance!,
  };
  
  try {
    const record: Record = await client.callZome({
      cap_secret: null,
      role_name: 'bank',
      zome_name: 'bank_account',
      fn_name: 'create_account',
      payload: accountEntry,
    });
    dispatch('account-created', { accountHash: record.signed_action.hashed.hash });
  } catch (e) {
    errorSnackbar.labelText = `Error creating the account: ${e.data.data}`;
    errorSnackbar.show();
  }
}

</script>
<mwc-snackbar bind:this={errorSnackbar} leading>
</mwc-snackbar>
<div style="display: flex; flex-direction: column">
  <span style="font-size: 18px">Create Account</span>
  

  <div style="margin-bottom: 16px">
    <mwc-textfield outlined label="Name" value={ name } on:input={e => { name = e.target.value; } } required></mwc-textfield>          
  </div>
            
  <div style="margin-bottom: 16px">
    <div style="display: flex; flex-direction: row">
      <span style="margin-right: 4px">Balance</span>
    
      <mwc-slider value={ balance } on:input={e => { balance = e.detail.value; } } discrete></mwc-slider>
    </div>          
  </div>
            

  <mwc-button 
    raised
    label="Create Account"
    disabled={!isAccountValid}
    on:click={() => createAccount()}
  ></mwc-button>
</div>
