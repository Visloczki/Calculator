<?php

namespace Speradevlop\Api;
use PDO;
class Database {

  private $dsn = [
    'host' => 'localhost',
    'port' => 3306,
    'dbname' => 'calculator',
    'charset' => 'utf8mb4'
  ];


  public $connection;


  public function __construct($user = 'root', $pass = '') 
  {
    $dsn = 'mysql:' . http_build_query($this->dsn, "", ";");
    $this->connection = new PDO($dsn, $user,$pass, [
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
  }

  public function query($queryString, $params = []) 
  {
    $statement = $this->connection->prepare($queryString);
    $statement->execute($params);
    return $statement;
  }
}


