"use strict";

class BankAccount {
	constructor(name, initialBalance = 0) {
		if (!BankAccount.validateAmount(initialBalance)) return;

		this.name = name;
		this.balance = initialBalance;
	}

	getBalance() {
		console.log(`${this.name} has a balance of ${this.balance}.`);
	}

	deposit(amount) {
		if (!BankAccount.validateAmount(amount)) return;

		this.balance += amount;
		return this.balance;
	}

	withdraw(subtractAmount) {
		if (!BankAccount.validateWithdraw(subtractAmount, this.balance,)) return;

		this.balance -= subtractAmount;
		return this.balance;
	}

	transfer(amount, account) {
		if (!BankAccount.validateWithdraw(amount, this.balance)) return;
		if (!this.validateBankAccount(account)) return;

		this.withdraw(amount);
		account.deposit(amount);
		return this.balance;
	}

	static validateAmount(amount) {
		if (amount < 0) {
			console.error("amount cannot be negative!");
			return false;
		}
		return true;
	}

	static validateWithdraw(amount, balance) {
		if (!BankAccount.validateAmount(amount)) return false;
		if (amount > balance) {
			console.error("amount cannot be greater than balance!");
			return false;
		}

		return true
	}

	validateBankAccount(account) {
		if (!(account instanceof BankAccount)) {
			console.error("account must be a BankAccount!");
			return false;
		}
		if (this === account) {
			console.error("cannot transfer to self!");
			return false;
		}

		return true
	}
}


// Tests :

let person1 = new BankAccount("Sacha", 1000);
person1.getBalance();
person1.deposit(200);
person1.getBalance();
person1.withdraw(330);
person1.getBalance();
person1.deposit(400);
person1.deposit(300);
person1.getBalance();

let person2 = new BankAccount("nick");
person2.getBalance();
person1.transfer(100, person2);
person1.getBalance();
person2.getBalance();

person1.withdraw(1500);
person1.getBalance();
person1.deposit(-100);
person1.getBalance();

person1.transfer(100, person1);
person1.getBalance();
person1.transfer(100, "person2");
person1.getBalance();
person1.transfer(1500, person2);
person1.getBalance();

console.log("")
person1.transfer(-500, person2);
person1.getBalance();
console.log("")

let person3 = new BankAccount("nico", -100);
console.log(person3);