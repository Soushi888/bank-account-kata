# Bank Account Kata Holochain Application

## Description

This is a simple Holochain application that allows users to create bank accounts with a name and a balance, and transfer money between them.

It is a simple Bank DNA composed of a bank_account Zome.

The bank_account Zome has two entry types: `account` and `transfer`.

### Account

An account is a simple entry that has a `name` and a `balance`.

- `name`: String
- `balance`: Number

### Transfer

A transfer is an entry that has a `from` and a `to` account, and a `amount` of money to transfer.

- `from`: Account Entry Hash
- `to`: Account Entry Hash
- `amount`: Number

### Bank Account Zome

The bank_account Zome has the following public functions:

- `create_account`: Creates a new account with the given name and balance.
- `get_account`: Gets an account by its address.
- `get_accounts`: Gets all the accounts.
- `transfer`: Transfers money from one account to another.
- `get_transfers`: Gets all the transfers.
- `get_transfers_for_account`: Gets all the transfers for a given account.

### Links

The bank_account Zome has the following links:

- `account -> transfer`: Links an account to a transfer.
- `transfer -> account`: Links a transfer to an account.

### Anchor

The bank_account Zome has the following anchor:

- `all_accounts`: Anchor to all the accounts.
- `all_transfers`: Anchor to all the transfers.

### Validation Rules

The bank_account Zome has the following validation rules:

- `create_account`
  - The account name must be between 3 and 20 characters long.
  - The account name must be unique.
  - The account name must only contain alphanumeric characters.
  - The account balance must be greater than or equal to 0.
- `transfer`
  - The transfer amount must be greater than 0.
  - The transfer amount must be less than or equal to the balance of the `from` account.
  - The `from` and `to` accounts must be different.
  - The `from` and `to` accounts must exist.
