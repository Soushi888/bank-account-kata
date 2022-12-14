def validate_amount(amount: float, balance=None, is_balance=False):
    if amount < 0:
        raise ValueError(f"{'Balance' if is_balance else 'Amount'} must be positive")
    if balance is not None and amount > balance:
        raise ValueError("Amount must be less than balance")


def validate_name(name: str):
    if not name:
        raise ValueError("Name cannot be empty")


class BankAccount:
    def __init__(self, name: str, balance: float):
        validate_name(name)
        validate_amount(balance, is_balance=True)
        self.name = name
        self.balance = balance

    def deposit(self, amount: float):
        validate_amount(amount)
        self.balance += amount
        return self.balance

    def withdraw(self, amount: float):
        validate_amount(amount, self.balance)
        self.balance -= amount
        return self.balance

    def transfer(self, amount: float, account: "BankAccount"):
        validate_amount(amount, self.balance)
        self.withdraw(amount)
        account.deposit(amount)
        return self.balance

    def __str__(self):
        return f"Account name: {self.name}, Balance: {self.balance}"
