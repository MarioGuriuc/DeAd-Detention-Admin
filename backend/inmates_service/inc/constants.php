<?php

const INMATE_REQUIRED_FIELDS = [
    'name' => 'Inmate name is required.',
    'crimes' => 'At least one crime is required.',
    'sentences' => 'At least one sentence is required.',
    'image' => 'Inmate image is required.',
];

const INMATE_CHECKS = [
    'name' => ['min' => 4, 'max' => 50, 'message' => 'Name must be between 3 and 50 characters'],
    'crime' => ['min' => 4, 'max' => 100, 'message' => 'crime must be between 3 and 100 characters'],
    'sentence' => ['min' => 4, 'max' => 50, 'message' => 'sentence must be between 3 and 50 characters'],
];
