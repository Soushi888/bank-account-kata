<?php

class BankAccount
{
    private $name;
    private $balance = 0;

    function __construct($name, $balance = 0)
    {
        $this->name = $name;
    }

    public function getBalance()
    {
        return $this->balance;
    }

    public function getName()
    {
        return $this->name;
    }

    public function deposit($amount)
    {
        try {
            $this->validateAmount($amount);
            $this->balance += $amount;
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function withdraw($amount)
    {
        try {
            $this->validateAmount($amount);
            $this->balance -= $amount;
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    private function validateAmount($amount, $balance = null)
    {
        if ($amount < 0) {
            throw new Exception('Amount must be positive');
        }
        if ($amount > $balance && $balance !== null) {
            throw new Exception('Amount must be less than balance');
        }
    }
}