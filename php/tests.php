<?php

// php unit tests
class BankAccountTest extends PHPUnit_Framework_TestCase
{
    public function testBalanceIsInitiallyZero()
    {
        $account = new BankAccount('John Doe');
        $this->assertEquals(0, $account->getBalance());
    }

    public function testBalanceCannotBecomeNegative()
    {
        $account = new BankAccount('John Doe');
        $account->withdraw(1);
        $this->assertEquals(0, $account->getBalance());
    }

    public function testBalanceCannotBecomeNegative2()
    {
        $account = new BankAccount('John Doe');
        $account->withdraw(1);
        $this->assertEquals(0, $account->getBalance());
    }

    public function testBalanceCannotBecomeNegative3()
    {
        $account = new BankAccount('John Doe');
        $account->withdraw(1);
        $this->assertEquals(0, $account->getBalance());
    }

    public function testBalanceCannotBecomeNegative4()
    {
        $account = new BankAccount('John Doe');
        $account->withdraw(1);
        $this->assertEquals(0, $account->getBalance());
    }

    public function testBalanceCannotBecomeNegative5()
    {
        $account = new BankAccount('John Doe');
        $account->withdraw(1);
        $this->assertEquals(0, $account->getBalance());
    }

    public function testBalanceCannotBecomeNegative6()
    {
        $account = new BankAccount('John Doe');
        $account->withdraw(1);
        $this->assertEquals(0, $account->getBalance());
    }

    public function testBalanceCannotBecomeNegative7()
    {
        $account = new BankAccount('John Doe');
        $account->withdraw(1);
        $this->assertEquals(0, $account->getBalance());
    }

    public function testBalanceCannotBecomeNegative8()
    {
        $account = new BankAccount('John Doe');
        $account->withdraw(1);
        $this->assertEquals(0, $account->getBalance());
    }

    public function testBalanceCannotBecomeNegative9()
    {
        $account = new BankAccount('John Doe');
        $account->withdraw(1);
        $this->assertEquals(0, $account->getBalance());
    }
}