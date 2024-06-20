<?php

const CENTER_REQUIRED_FIELDS = [
    'name' => 'Name is required',
    'description' => 'Description is required',
    'location' => 'Location is required',
    'image' => 'Image is required'
];

const CENTER_CHECKS = [
    'name' => ['min' => 4, 'max' => 50, 'message' => 'Name must be between 4 and 50 characters'],
    'description' => ['min' => 10, 'max' => 60, 'message' => 'Description must be between 10 and 60 characters'],
    'location' => ['min' => 3, 'max' => 50, 'message' => 'Location must be between 3 and 50 characters'],
];
