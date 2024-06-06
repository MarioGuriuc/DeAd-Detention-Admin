<?php

const CENTER_REQUIRED_FIELDS = [
    'name' => 'Name is required',
    'description' => 'Description is required',
    'location' => 'Location is required',
    'image' => 'Image is required'
];

const CENTER_CHECKS = [
    'name' => ['min' => 4, 'max' => 50],
    'description' => ['min' => 10, 'max' => 60],
    'location' => ['min' => 3, 'max' => 50],
];
