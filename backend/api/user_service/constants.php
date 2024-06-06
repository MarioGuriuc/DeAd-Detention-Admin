<?php

const user_required_fields = [
    "firstName" => "Please enter a valid first name",
    "lastName" => "Please enter a valid last name",
    "username" => "Please enter a valid username",
    "email" => "Please enter a valid email",
    "password" => "Please enter a valid password",
    "confirmPassword" => "Please confirm your password",
    "phone" => "Please enter a valid phone number",
    "dob" => "Please enter a valid date of birth",
];

const login_required_fields = [
    "username" => "Please enter a valid username",
    "password" => "Please enter a valid password",
];

const USERNAME_MIN_LENGTH = 5;
const USERNAME_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 64;
const PHONE_MIN_LENGTH = 10;
const EMAIL_REGEX = "/\S+@\S+\.\S+/";

const USERNAME_VALIDATION = [
    "min" => USERNAME_MIN_LENGTH,
    "max" => USERNAME_MAX_LENGTH,
    "message" => "Username must be at least 5 characters long",
];

const PASSWORD_VALIDATION = [
    "min" => PASSWORD_MIN_LENGTH,
    "max" => PASSWORD_MAX_LENGTH,
    "message" => "Password must be at least 8 characters long",
    "confirm" => "Passwords do not match",
];

const PHONE_VALIDATION = [
    "min" => PHONE_MIN_LENGTH,
    "message" => "Please enter a valid phone number",
];

const EMAIL_VALIDATION = [
    "regex" => EMAIL_REGEX,
    "message" => "Please enter a valid email",
];

const REGISTER_CHECKS = [
    "username" => USERNAME_VALIDATION,
    "password" => PASSWORD_VALIDATION,
    "phone" => PHONE_VALIDATION,
    "email" => EMAIL_VALIDATION,
];

const CHANGE_CHECKS = [
    "phone" => PHONE_VALIDATION,
    "email" => EMAIL_VALIDATION,
    "username" => USERNAME_VALIDATION
];
