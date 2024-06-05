<?php

const CENTER_REQUIRED_FIELDS = ['name', 'description', 'location', 'image'];

const CENTER_CHECKS = [
    'name' => ['min' => 4, 'max' => 50],
    'description' => ['min' => 10, 'max' => 60],
    'location' => ['min' => 3, 'max' => 50],
];
