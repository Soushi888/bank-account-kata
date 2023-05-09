#[cfg(test)]
mod tests {
    use rust_bank_kata::BankAccount;

    #[test]
    fn test_create_account() {
        let account = BankAccount::new("John".to_string(), Some(100)).unwrap();
        account.get_balance();
        assert_eq!(account.name, "John");
        assert_eq!(account.balance, 100);
    }

    #[test]
    fn test_create_account_with_default_balance() {
        let account = BankAccount::new("John".to_string(), None).unwrap();
        account.get_balance();
        assert_eq!(account.name, "John");
        assert_eq!(account.balance, 0);
    }

    #[test]
    fn test_create_account_with_invalid_name() {
        let account = BankAccount::new("".to_string(), Some(100));
        assert!(account.is_err());
    }

    #[test]
    fn test_create_account_with_invalid_balance() {
        let account = BankAccount::new("John".to_string(), Some(-100));
        assert!(account.is_err());
    }

    #[test]
    fn test_deposit() {
        let mut account = BankAccount::new("John".to_string(), Some(100)).unwrap();
        account.deposit(50).unwrap();
        account.get_balance();
        assert_eq!(account.balance, 150);
    }

    #[test]
    fn test_deposit_with_invalid_amount() {
        let mut account = BankAccount::new("John".to_string(), Some(100)).unwrap();
        let result = account.deposit(-50);
        assert!(result.is_err());
    }

    #[test]
    fn test_withdraw() {
        let mut account = BankAccount::new("John".to_string(), Some(100)).unwrap();
        account.withdraw(50).unwrap();
        account.get_balance();
        assert_eq!(account.balance, 50);
    }

    #[test]
    fn test_withdraw_insufficient_funds() {
      let mut account = BankAccount::new("John".to_string(), Some(100)).unwrap();
      let result = account.withdraw(150);
      assert!(result.is_err());
    }

    #[test]
    fn test_withdraw_with_invalid_amount() {
        let mut account = BankAccount::new("John".to_string(), Some(100)).unwrap();
        let result = account.withdraw(-50);
        assert!(result.is_err());
    }

    #[test]
    fn test_transfer() {
        let mut account1 = BankAccount::new("John".to_string(), Some(100)).unwrap();
        let mut account2 = BankAccount::new("Jane".to_string(), Some(100)).unwrap();
        account1.transfer(50, &mut account2).unwrap();
        account1.get_balance();
        account2.get_balance();
        assert_eq!(account1.balance, 50);
        assert_eq!(account2.balance, 150);
    }

    #[test]
    fn test_transfer_insufficient_funds() {
        let mut account1 = BankAccount::new("John".to_string(), Some(100)).unwrap();
        let mut account2 = BankAccount::new("Jane".to_string(), Some(100)).unwrap();
        let result = account1.transfer(150, &mut account2);
        assert!(result.is_err());
    }

    #[test]
    fn test_transfer_with_invalid_amount() {
        let mut account1 = BankAccount::new("John".to_string(), Some(100)).unwrap();
        let mut account2 = BankAccount::new("Jane".to_string(), Some(100)).unwrap();
        let result = account1.transfer(-50, &mut account2);
        assert!(result.is_err());
    }
}