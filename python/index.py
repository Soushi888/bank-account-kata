class BankAccount:
    def __init__(self, name, balance):
        if balance < 0:
            raise ValueError("Balance must be positive")

        self.name = name
        self.balance = balance

    def deposit(self, amount):
        if amount < 0:
            raise ValueError("Amount must be positive")

        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Amount must be less than balance")
        if amount < 0:
            raise ValueError("Amount must be positive")

        self.balance -= amount
        return self.balance

    def transfer(self, amount, account):
        if amount > self.balance:
            raise ValueError("Amount must be less than balance")
        if amount < 0:
            raise ValueError("Amount must be positive")

        self.withdraw(amount)
        account.deposit(amount)
        return self.balance

    def __str__(self):
        return f"Account name: {self.name}, Balance: {self.balance}"
