class BankAccount {
	name: string;
	balance: number;

	constructor(name: string, balance: number = 0) {
		this.name = name;
		this.balance = balance;
	}

	deposit = (amount: number) => this.balance += amount;
	withdraw = (amount: number) => this.balance -= amount;
	getAccountBalance = () => {
		let roundedBalance = Math.round(this.balance * 100) / 100;
		let decimals: number = parseFloat(roundedBalance.toString().split('.')[1]);
		if (decimals < 10) decimals *= 10;
		let strRoundedBalance = roundedBalance.toString().split('.')[0] + '.' + decimals;

		return `The balance of ${this.name}'s account is ${strRoundedBalance}$.`
	}

	init = () => {
		document.querySelector(".bank-account").innerHTML = `
				<h2>${this.name}'s account</h2>
				<p>${this.getAccountBalance()}</p>
				<input type="number" class="amount-input">
				<div class="buttons">
					<button class="deposit-btn">Deposit</button>
					<button class="withdraw-btn">Withdraw</button>
				</div>
				<ul class="transaction-list"></ul>
			`;

		let amountInput: HTMLInputElement = document.querySelector(".amount-input");
		let depositBtn: HTMLButtonElement = document.querySelector(".deposit-btn");
		let withdrawBtn: HTMLButtonElement = document.querySelector(".withdraw-btn");
		let transactionList: HTMLUListElement = document.querySelector(".transaction-list");

		depositBtn.addEventListener("click", () => {
			let amount = amountInput.value;
			if (!isNaN(parseFloat(amount))) {
				sachaAccount.deposit(parseFloat(amount));
				sachaAccount.render();
				transactionList.innerHTML += `<li style="color: green">Deposit of ${amount}$</li>`;
				amountInput.value = "";
			}
		});

		withdrawBtn.addEventListener("click", () => {
			let amount = amountInput.value;
			if (!isNaN(parseFloat(amount))) {
				sachaAccount.withdraw(parseFloat(amount));
				sachaAccount.render();
				transactionList.innerHTML += `<li style="color: red">Withdrawal of ${amount}$</li>`;
				amountInput.value = "";
			}
		});
	}

	render = () => {
		document.querySelector(".bank-account p").innerHTML = this.getAccountBalance();
	}
}

let sachaAccount = new BankAccount("Sacha", 25.6);
sachaAccount.init();