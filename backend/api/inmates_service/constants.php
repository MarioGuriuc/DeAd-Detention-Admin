<?php

const INMATE_REQUIRED_FIELDS = [
    'name' => 'Name is required',
    'crime' => 'Description is required',
    'sentence' => 'Location is required',
    'image' => 'Image is required'
];

const INMATE_CHECKS = [
    'name' => ['min' => 3, 'max' => 50],
    'crime' => ['min' => 3, 'max' => 100],
    'sentence' => ['min' => 3, 'max' => 50]
];
