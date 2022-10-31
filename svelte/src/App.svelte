<script lang="ts">
  import BankAccount from "./lib/BankAccount.svelte";
</script>

<header>
  <h1>Bank accounts</h1>
</header>

<main>
  <BankAccount name="Sacha" balance=1000 />
  <BankAccount name="Eva" balance=1500 />
  <BankAccount name="Jerome" />
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
</style>