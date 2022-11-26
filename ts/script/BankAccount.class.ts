interface BankAccount {
	name: string;
	balance: number;
	accounts: BankAccount[];
}

class BankAccount implements BankAccount {
	name: string;
	balance: number;
	private readonly formattedName;
	private history: string[] = [];
	private historyIsShow = false;
	static accounts: BankAccount[] = [];

	constructor(name: string, balance: number = 0) {
		if (!this.validateAccountName(name)) return;

		this.name = name;
		this.formattedName = name.trim().toLowerCase()
			.replace(" ", '-')
			.replace(/[^a-z0-9\-]/g, '');
		this.balance = balance;

		if (balance > 0) {
			this.history.push(`Initial deposit of ${balance}$`);
		}

		BankAccount.accounts.push(this);
		this.init();
	}

	deposit = (amount: number) => this.balance += amount;

	withdraw = (amount: number): boolean => {
		if (!this.validateWithdraw(amount)) return false;
		this.balance -= amount;
		return true;
	};

	transfer = (amount: number, receiver_account_name: string): number | boolean => {
		const receiver_account = BankAccount.accounts.find(account => account.name === receiver_account_name);

		if (!this.validateTransfer(receiver_account_name)) return false;

		this.withdraw(amount);
		this.history.push(`Transferred ${amount}$ to ${receiver_account_name}`);
		receiver_account.deposit(amount);
		receiver_account.history.push(`Received ${amount}$ from ${this.name}`);
		return this.balance;
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
		let transactionList: HTMLUListElement = document.querySelector(`.${this.formattedName}-account .transaction-list`);
		transactionList.innerHTML = "";

		this.history.forEach(transaction => {
			let className;
			switch (transaction.split(' ')[0]) {
				case "Initial":
					className = "initial-transaction";
					break;
				case "Deposited" :
				case "Received":
					className = "deposit-transaction";
					break;
				case "Withdrew" :
				case "Transferred":
					className = "withdraw-transaction";
					break;
			}

			transactionList.innerHTML += `<li class="${className}">${transaction}</li>`
		});
	}

	private init = () => {
		document.querySelector(".bank-account").innerHTML += `
			<div class="${this.formattedName}-account">
				<h2>${this.name}'s account</h2>
				<p>${this.getAccountBalance()}</p>
				<div class="amount-input">				
					<input type="number">
				</div>
				<div class="buttons">
					<button class="deposit-btn">Deposit</button>
					<button class="withdraw-btn">Withdraw</button>
					<button class="transfer-btn">Transfer</button>
					<button class="history-btn">Toggle History</button>
				</div>
				<ul class="transaction-list"></ul>
				</div>
			`;

		let amountInput: HTMLInputElement = document.querySelector(`.${this.formattedName}-account .amount-input input`);
		let depositBtn: HTMLButtonElement = document.querySelector(`.${this.formattedName}-account .deposit-btn`);
		let withdrawBtn: HTMLButtonElement = document.querySelector(`.${this.formattedName}-account .withdraw-btn`);
		let transferBtn: HTMLButtonElement = document.querySelector(`.${this.formattedName}-account .transfer-btn`);
		let historyBtn: HTMLButtonElement = document.querySelector(`.${this.formattedName}-account .history-btn`);
		let transactionList: HTMLUListElement = document.querySelector(`.${this.formattedName}-account .transaction-list`);
		console.log(transferBtn);

		type OperationType = "deposit" | "withdraw" | "transfer" | "history";
		const operationHandler = (operation: OperationType) => {
			let amount = amountInput.value;
			let date = new Date();
			let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

			if (operation === "history") {
				console.log(historyBtn);
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
						console.log(depositBtn);
						this.deposit(parseFloat(amount));
						this.history.push(`Deposited ${amount}$ on ${formattedDate}`);
						break;
					case "withdraw":
						console.log(withdrawBtn);
						if (this.withdraw(parseFloat(amount)))
							this.history.push(`Withdrew ${amount}$ on ${formattedDate}`);
						break;
					case "transfer":
						console.log(transferBtn);
						let receiverAccountName = prompt("Enter the name of the receiver account");
						this.transfer(parseFloat(amount), receiverAccountName);
						break;
				}

				this.render();
				console.log(this.getAccountBalance());
				amountInput.value = "";
			}
		};

		depositBtn.addEventListener("click", () => operationHandler("deposit"));
		withdrawBtn.addEventListener("click", () => operationHandler("withdraw"));
		transferBtn.addEventListener("click", () => operationHandler("transfer"));
		historyBtn.addEventListener("click", () => operationHandler("history"));
	}

	private render = () => {
		document.querySelector(`.${this.formattedName}-account p`).innerHTML = this.getAccountBalance();
		if (this.historyIsShow) {
			this.renderHistory();
		}
	}

	private validateAccountName = (accountName: string) => {
		let errors = [];

		if (!accountName) errors.push("Account name is required");
		if (BankAccount.accounts.find(account => account.name === accountName)) errors.push("Account name already exists");

		errors.forEach(error => console.error(error));
		return errors.length === 0;
	}

	private validateWithdraw = (amount: number) => {
		if (amount <= this.balance) return true;

		console.error(`Insufficient funds`);
		return false;
	}

	private validateTransfer = (receiver_account_name: string) => {
		if (BankAccount.accounts.find(account => account.name === receiver_account_name)) return true

		console.error(`Account ${receiver_account_name} does not exist`);
		return false;
	}
}