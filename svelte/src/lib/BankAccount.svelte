<!-- JS -->
<script lang="ts">
  import {onMount} from "svelte";
  import {accountsStore, actualTransfer} from "../store/accounts.store";

  export let name: string,
          balance: number = 0;

  let amountInput: HTMLInputElement;
  let history: string[] = [];

  const getFormattedDate = () => {
    const date = new Date();
    return `[${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
  };

  $: if ($actualTransfer && $actualTransfer.to === name.toLowerCase()) {
    balance = parseInt(balance.toString()) + $actualTransfer.amount;
    history = [...history, `${getFormattedDate()} Received ${$actualTransfer.amount}$ from ${$actualTransfer.from}`];
    actualTransfer.set(null);
  }

  balance > 0 && history.push(`${getFormattedDate()} Initial balance: ${balance}$`);

  onMount(() => {
    if (!$accountsStore.includes(name.toLowerCase())) accountsStore.update(accounts => [...accounts, name.toLowerCase()]);
  });

  const getHistoryClass = (operation: string) => {
    if (operation.match(/Initial/)) return "initial-transaction";
    if (operation.match(/Deposit|Received/)) return "deposit-transaction";
    if (operation.match(/Withdrew|Transferred/)) return "withdraw-transaction";
    return "";
  };

  const deposit = (amount: number) => {
    if (!amount > 0) return alert("Amount must be greater than 0");

    balance = parseInt(balance.toString()) + amount;
    history = [...history, `${getFormattedDate()} Deposit: ${amount}$`];
    amountInput.value = "";
  };

  const withdraw = (amount) => {
    let errors = [];
    if (!amount > 0) errors.push("Amount must be greater than 0");
    if (amount > balance) errors.push("Insufficient funds");
    errors.forEach((error) => alert(error));

    if (errors.length === 0) {
      balance -= amount;
      history = [...history, `${getFormattedDate()} Withdrew: ${amount}$`];
    }

    amountInput.value = "";
  };

  const transfer = (amount) => {
    if (!amount > 0) return alert("Amount must be greater than 0");
    if (amount > balance) return alert("Insufficient funds");
    const receiver_account_name = prompt("Enter receiver account name :");
    if (!receiver_account_name) return alert("Receiver account name is required");
    if (!$accountsStore.includes(receiver_account_name.toLowerCase())) return alert("Receiver account not found");

    balance -= amount;
    actualTransfer.set({from: name.toLowerCase(), to: receiver_account_name.toLowerCase(), amount});
    history = [...history, `${getFormattedDate()} Transferred: ${amount}$ to ${receiver_account_name}`];
    amountInput.value = "";
  };
</script>

<!-- HTML -->
<div class="bank-account">
  <h2>{name}'s bank account</h2>
  <p>Balance: {balance}$</p>

  <label>
    <div class="amount-input">
      <input type="number" bind:this={amountInput}>
    </div>
  </label>

  <div class="buttons">
    <button on:click={() => deposit(parseInt(amountInput.value))}>Deposit</button>
    <button on:click={() => withdraw(parseInt(amountInput.value))}>Withdraw</button>
    <button on:click={() => transfer(parseInt(amountInput.value))}>Transfer</button>
  </div>

  <div class="history">
    <ul class="transactions-list">
      {#each history as transaction}
        <li class="{getHistoryClass(transaction)}">{transaction}</li>
      {/each}
    </ul>
  </div>
</div>

<!-- CSS -->
<style>
  .bank-account {
    border: 1px solid #eee;
    padding: 10px;
  }

  .amount-input input {
    width: 100px;
    margin-bottom: 10px;
  }

  .amount-input::after {
    position: relative;
    content: "$";
    right: 30px;
  }

  .initial-transaction {
    color: #8b8bff;
  }

  .deposit-transaction {
    color: #84e084;
  }

  .withdraw-transaction {
    color: #d57474;
  }
</style>
