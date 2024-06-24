<?php

//Author: Mario Guriuc

declare(strict_types=1);

use MongoDB\Client;

function get_db_conn()
{
    static $database = null;

    if ($database === null) {
        try {
            $client = new Client($_ENV["DB_HOST"]);
            $database = $client->selectDatabase($_ENV["DB_NAME"]);
        } catch (Throwable $e) {
            echo json_encode('Error connecting to the database: ' . $e->getMessage());
            die();
        }
    }

    return $database;
}
