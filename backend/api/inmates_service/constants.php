<?php

const INMATE_REQUIRED_FIELDS = [
    'name' => 'Name is required',
    'crime' => 'Description is required',
    'sentence' => 'Location is required',
    'image' => 'Image is required'
];

const INMATE_CHECKS = [
    'name' => ['min' => 3, 'max' => 50, 'message' => 'Name must be between 3 and 50 characters'],
    'crime' => ['min' => 3, 'max' => 100, 'message' => 'Description must be between 3 and 100 characters'],
    'sentence' => ['min' => 3, 'max' => 50, 'message' => 'Location must be between 3 and 50 characters'],
];
