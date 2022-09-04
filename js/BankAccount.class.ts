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
				<div class="amount-input">				
					<input type="number">
				</div>
				<div class="buttons">
					<button class="deposit-btn">Deposit</button>
					<button class="withdraw-btn">Withdraw</button>
				</div>
				<ul class="transaction-list"></ul>
			`;

		let amountInput: HTMLInputElement = document.querySelector(".amount-input input");
		let depositBtn: HTMLButtonElement = document.querySelector(".deposit-btn");
		let withdrawBtn: HTMLButtonElement = document.querySelector(".withdraw-btn");
		let transactionList: HTMLUListElement = document.querySelector(".transaction-list");

		const operationHandler = (operation: string) => {
			let amount = amountInput.value;
			let date = new Date();
			let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}
			${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

			if (!isNaN(parseFloat(amount))) {
				if (operation === "deposit") {
					this.deposit(parseFloat(amount));
					transactionList.innerHTML += `<li class="deposit-transaction">[${formattedDate}] Deposit of ${amount}$</li>`;
				} else {
					this.withdraw(parseFloat(amount));
					transactionList.innerHTML += `<li class="withdraw-transaction">[${formattedDate}] Withdrawal of ${amount}$</li>`;
				}
				this.render();
				console.log(this.getAccountBalance());
				amountInput.value = "";
			}
		}

		depositBtn.addEventListener("click", () => operationHandler("deposit"));
		withdrawBtn.addEventListener("click", () => operationHandler("withdraw"));
	}

	render = () => {
		document.querySelector(".bank-account p").innerHTML = this.getAccountBalance();
	}
}
