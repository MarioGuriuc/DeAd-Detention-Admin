<?php

const USER_REQUIRED_FIELDS = [
    "firstName" => "Please enter a valid first name",
    "lastName" => "Please enter a valid last name",
    "username" => "Please enter a valid username",
    "email" => "Please enter a valid email",
    "password" => "Please enter a valid password",
    "confirmPassword" => "Please confirm your password",
    "phone" => "Please enter a valid phone number",
    "dob" => "Please enter a valid date of birth",
];

const LOGIN_REQUIRED_FIELDS = [
    "username" => "Please enter a valid username",
    "password" => "Please enter a valid password",
];

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 20;
const NAME_REGEX = "/^[a-zA-Z]+$/";
const USERNAME_MIN_LENGTH = 5;
const USERNAME_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 64;
const PHONE_MIN_LENGTH = 10;
const PHONE_REGEX = "/^\d{10}$/";
const EMAIL_REGEX = "/\S+@\S+\.\S+/";

const FIRST_NAME_VALIDATION = [
    "min" => NAME_MIN_LENGTH,
    "max" => NAME_MAX_LENGTH,
    "regex" => NAME_REGEX,
    "message" => "First name must be between 2 and 20 characters long and contain only letters"
];

const LAST_NAME_VALIDATION = [
    "min" => NAME_MIN_LENGTH,
    "max" => NAME_MAX_LENGTH,
    "regex" => NAME_REGEX,
    "message" => "Last name must be between 2 and 20 characters long and contain only letters"
];

const USERNAME_VALIDATION = [
    "min" => USERNAME_MIN_LENGTH,
    "max" => USERNAME_MAX_LENGTH,
    "message" => "Username must be at least 5 characters long",
];

const PASSWORD_VALIDATION = [
    "min" => PASSWORD_MIN_LENGTH,
    "max" => PASSWORD_MAX_LENGTH,
    "message" => "Password must be at least 6 characters long",
    "confirm" => "Passwords do not match",
];

const PHONE_VALIDATION = [
    "min" => PHONE_MIN_LENGTH,
    "regex" => PHONE_REGEX,
    "message" => "Please enter a valid phone number",
];

const EMAIL_VALIDATION = [
    "regex" => EMAIL_REGEX,
    "message" => "Please enter a valid email",
];

const REGISTER_CHECKS = [
    "firstName" => FIRST_NAME_VALIDATION,
    "lastName" => LAST_NAME_VALIDATION,
    "username" => USERNAME_VALIDATION,
    "password" => PASSWORD_VALIDATION,
    "phone" => PHONE_VALIDATION,
    "email" => EMAIL_VALIDATION,
];

const CHANGE_CHECKS = [
    "firstName" => FIRST_NAME_VALIDATION,
    "lastName" => LAST_NAME_VALIDATION,
    "phone" => PHONE_VALIDATION,
    "email" => EMAIL_VALIDATION,
    "username" => USERNAME_VALIDATION
];
