//! This is the Rust implementation of the Bank Kata.
//! ## The Kata
//! The Bank Kata is a simple exercise to practice TDD and the
//! three rules of simple design.
//! The rules are:
//! 1. Don't write any production code unless it is to make a failing unit test pass.
//! 2. Don't write any more of a unit test than is sufficient to fail; and compilation failures are failures.
//! 3. Don't write any more production code than is sufficient to pass the one failing unit test.

/// Errors that can occur when performing a bank operation.
#[derive(Debug)]
pub enum AccountError {
	/// The account name is invalid.
	InvalidName,
	/// The account balance is invalid.
	InvalidAmount,
	/// The account has insufficient funds.
	InsufficientFunds,
}

/// A bank account
#[derive(Debug)]
pub struct BankAccount {
	pub name: String,
	pub balance: i32,
}

impl BankAccount {
	/// Create a new bank account with the given name and balance.
	/// # Arguments
	/// * `name` - The name of the account owner.
	/// * `balance` - The initial balance of the account. If `None` is provided, the balance will be set to 0.
	/// # Errors
	/// * `AccountError::InvalidName` - If the name is empty.
	/// * `AccountError::InvalidAmount` - If the balance is negative.
	/// # Examples
	/// ```
	/// use rust_bank_kata::BankAccount;
	/// let account = BankAccount::new("John".to_string(), Some(100)).unwrap();
	/// assert_eq!(account.name, "John");
	/// assert_eq!(account.balance, 100);
	/// ```
	pub fn new(name: String, balance: Option<i32>) -> Result<BankAccount, AccountError> {
		if name.len() == 0 { return Err(AccountError::InvalidName); }
		if balance.is_some() && balance.unwrap() < 0 { return Err(AccountError::InvalidAmount); }

		Ok(Self {
			name,
			balance: balance.unwrap_or_default(),
		})
	}

	/// Deposit an amount into the account
	/// # Arguments
	/// * `amount` - The amount to deposit
	/// # Errors
	/// * `AccountError::InvalidAmount` - If the amount is negative
	/// # Examples
	/// ```
	/// use bank_kata::BankAccount;
	/// let mut account = BankAccount::new("John".to_string(), Some(100)).unwrap();
	/// account.deposit(50).unwrap();
	/// assert_eq!(account.balance, 150);
	/// ```
	pub fn deposit(&mut self, amount: i32) -> Result<(), AccountError> {
		if amount < 0 { return Err(AccountError::InvalidAmount); }
		Ok(self.balance += amount)
	}

	/// Withdraws the specified amount from the account.
	/// # Arguments
	/// * `amount` - The amount to withdraw
	/// # Errors
	/// * `AccountError::InvalidAmount` - If the amount is negative
	/// * `AccountError::InsufficientFunds` - If the amount is greater than the balance
	/// # Examples
	/// ```
	/// use rust_bank_kata::BankAccount;
	/// let mut account = BankAccount::new("John".to_string(), Some(100)).unwrap();
	/// account.withdraw(50).unwrap();
	/// assert_eq!(account.balance, 50);
	/// ```
	pub fn withdraw(&mut self, amount: i32) -> Result<(), AccountError> {
		if { self.balance - &amount } < 0 {
			return Err(AccountError::InsufficientFunds);
		}
		if amount < 0 { return Err(AccountError::InvalidAmount); }

		Ok(self.balance -= amount)
	}

	/// Gets the current balance of the account.
	/// Print something like : `John's balance is 100`.
	pub fn get_balance(&self) {
		println!("{}'s account balance is {}$.", self.name, self.balance);
	}

	/// Make a transfer from one account to another.
	/// # Arguments
	/// * `amount` - The amount to transfer
	/// * `other` - The account to transfer to
	/// # Errors
	/// * `AccountError::InvalidAmount` - If the amount is negative
	/// * `AccountError::InsufficientFunds` - If the amount is greater than the balance
	/// # Examples
	/// ```
	/// use rust_bank_kata::BankAccount;
	/// let account = BankAccount::new("John".to_string(), Some(100)).unwrap();
	/// assert_eq!(account.name, "John");
	/// assert_eq!(account.balance, 100);
	/// ```
	pub fn transfer(&mut self, amount: i32, other: &mut BankAccount) -> Result<(), AccountError> {
		match self.withdraw(amount.clone()) {
			Ok(_) => other.deposit(amount),
			Err(e) => Err(e),
		}
	}
}