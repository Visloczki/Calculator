<?php


function dd($value)
{
    echo "<pre>";
    var_dump($value);
    echo "</pre>";
    die();
}
function ddj($value)
{
    echo "<pre>";
    echo json_encode($value);
    echo "</pre>";
    die();
}

function notFoundHandler()
{
    http_response_code(404);
    echo "Nem található a kérés";
    die();
}
