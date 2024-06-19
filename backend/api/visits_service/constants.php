<?php

const VISIT_REQUIRED_FIELDS = [
    'date' => 'Date is required',
    'time' => 'Time is required',
    'duration' => 'Duration is required',
    'nature' => 'Nature is required',
    'objectsExchanged' => 'Objects exchanged is required',
    'summary' => 'Summary is required',
    'health' => 'Health is required',
    'witnesses' => 'Witnesses is required',
];

const VISIT_ALLOWED_NATURES = ['Official', 'Personal', 'Legal', 'Medical', 'Religious'];

const VISIT_STATUSES = ['pending', 'approved', 'denied', 'attended'];
