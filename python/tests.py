import unittest
from index import BankAccount


class TestBankAccount(unittest.TestCase):
    def setUp(self):
        self.account = BankAccount("John", 100)

    def test_deposit(self):
        self.assertEqual(self.account.deposit(50), 150)

    def test_deposit_negative(self):
        with self.assertRaises(ValueError):
            self.account.deposit(-50)

    def test_withdraw(self):
        self.assertEqual(self.account.withdraw(50), 50)

    def test_withdraw_negative(self):
        with self.assertRaises(ValueError):
            self.account.withdraw(-50)

    def test_withdraw_more_than_balance(self):
        with self.assertRaises(ValueError):
            self.account.withdraw(200)

    def test_transfer(self):
        account2 = BankAccount("Jane", 100)
        self.assertEqual(self.account.transfer(50, account2), 50)
        self.assertEqual(str(account2), "Account name: Jane, Balance: 150")

    def test_transfer_negative(self):
        account2 = BankAccount("Jane", 100)
        with self.assertRaises(ValueError):
            self.account.transfer(-50, account2)

    def test_transfer_more_than_balance(self):
        account2 = BankAccount("Jane", 100)
        with self.assertRaises(ValueError):
            self.account.transfer(200, account2)

    def test_str(self):
        self.assertEqual(str(self.account), "Account name: John, Balance: 100")
