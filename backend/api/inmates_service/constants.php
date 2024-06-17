<?php

const INMATE_REQUIRED_FIELDS = ['name', 'crime', 'sentence', 'image'];

const INMATE_CHECKS = [
    'name' => ['min' => 3, 'max' => 50],
    'crime' => ['min' => 3, 'max' => 100],
    'sentence' => ['min' => 3, 'max' => 50]
];