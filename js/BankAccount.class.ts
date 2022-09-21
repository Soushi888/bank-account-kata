class BankAccount {
	name: string;
	balance: number;
	private history: string[] = [];
	private historyIsShow = false;

	constructor(name: string, balance: number = 0) {
		this.name = name;
		this.balance = balance;

		if (balance > 0) {
			this.history.push(`Initial deposit of ${balance}$`);
		}

		this.init();
	}

	deposit = (amount: number) => this.balance += amount;

	withdraw = (amount: number): boolean => {
		if (amount <= this.balance) {
			this.balance -= amount;
			return true;
		}
		return false;
	};

	getAccountBalance = () => {
		let roundedBalance = Math.round(this.balance * 100) / 100;
		let decimals: number = parseFloat(roundedBalance.toString().split('.')[1]);
		if (decimals < 10) decimals *= 10;
		let strRoundedBalance = roundedBalance.toString().split('.')[0]
		if (decimals) strRoundedBalance += `.${decimals}`;

		return `The balance of ${this.name}'s account is ${strRoundedBalance}$.`
	}

	private renderHistory = () => {
		let transactionList: HTMLUListElement = document.querySelector(".transaction-list");
		transactionList.innerHTML = "";

		this.history.forEach(transaction => {
			let className;
			switch (transaction.split(' ')[0]) {
				case "Initial":
					className = "initial-transaction";
					break;
				case "Deposited":
					className = "deposit-transaction";
					break;
				case "Withdrew":
					className = "withdraw-transaction";
					break;
			}

			transactionList.innerHTML += `<li class="${className}">${transaction}</li>`
		});
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
					<button class="history-btn">Toggle History</button>
				</div>
				<ul class="transaction-list"></ul>
			`;

		let amountInput: HTMLInputElement = document.querySelector(".amount-input input");
		let depositBtn: HTMLButtonElement = document.querySelector(".deposit-btn");
		let withdrawBtn: HTMLButtonElement = document.querySelector(".withdraw-btn");
		let historyBtn: HTMLButtonElement = document.querySelector(".history-btn");
		let transactionList: HTMLUListElement = document.querySelector(".transaction-list");

		type OperationType = "deposit" | "withdraw" | "history";
		const operationHandler = (operation: OperationType) => {
			let amount = amountInput.value;
			let date = new Date();
			let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

			if (operation === "history") {
				if (!transactionList.innerHTML) {
					this.historyIsShow = true;
					this.renderHistory();
				} else {
					this.historyIsShow = false;
					transactionList.innerHTML = "";
				}

				return;
			}

			if (!isNaN(parseFloat(amount))) {
				switch (operation) {
					case "deposit":
						this.deposit(parseFloat(amount));
						this.history.push(`Deposited ${amount}$ on ${formattedDate}`);
						break;
					case "withdraw":
						if (this.withdraw(parseFloat(amount)))
							this.history.push(`Withdrew ${amount}$ on ${formattedDate}`);
						break;
				}

				this.render();
				console.log(this.getAccountBalance());
				amountInput.value = "";
			}
		}

		depositBtn.addEventListener("click", () => operationHandler("deposit"));
		withdrawBtn.addEventListener("click", () => operationHandler("withdraw"));
		historyBtn.addEventListener("click", () => operationHandler("history"));
	}

	render = () => {
		document.querySelector(".bank-account p").innerHTML = this.getAccountBalance();
		if (this.historyIsShow) {
			this.renderHistory();
		}
	}
}