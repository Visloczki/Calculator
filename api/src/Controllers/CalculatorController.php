<?php
namespace Speradevlop\Api\Controllers;

use Speradevlop\Api\Database;

class CalculatorController
{

    public static function index()
    {
        echo json_encode(['message' => 'entry point']);
    }
    public static function store($vars, $request)
    {
        $db = new Database();
        try {

            $statement = $db->query("INSERT INTO calculates (firstNumber, lastNumber, sum, operand) VALUES  (?, ?, ?, ?)", [
                $request['firstNumber'],
                $request['lastNumber'],
                $request['sum'],
                $request['operand']
            ]);

        } catch (\Exception $ex) {
            echo $ex->getMessage();
        }
    }
    public static function getAllCalculate()
    {
        $db = new Database();
        $data = $db->query('SELECT * FROM calculates ORDER BY id DESC')->fetchAll();
        echo json_encode($data);
    }
    public static function statics()
    {
        $db = new Database();
        $mostUsedOperator = $db->query("SELECT operand, COUNT(operand) AS countOfUsed FROM `calculates` GROUP BY operand ORDER BY countOfUsed DESC")->fetch();
        $data = $db->query('SELECT 
            MAX(sum) as legnagyobb_vegosszeg, 
            MIN(sum) as legkissebb_vegosszeg, 
            AVG(sum) as atlag, 
            SUM(sum) as osszes_vegosszeg
            FROM calculates')->fetchAll();
        echo json_encode(['mostUsedOperand' => $mostUsedOperator, 'datas' => $data]);

    }
}
