from pymongo import MongoClient

client = MongoClient("mongodb://mongo-dead:27017/?directConnection=true")
db = client["DeAd"]

user_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["firstName", "lastName", "username", "email", "password", "phone", "dob"],
        "properties": {
            "firstName": {
                "bsonType": "string",
                "description": "Please enter a valid first name"
            },
            "lastName": {
                "bsonType": "string",
                "description": "Please enter a valid last name"
            },
            "username": {
                "bsonType": "string",
                "minLength": 5,
                "maxLength": 20,
                "description": "Username must be between 5 and 20 characters long"
            },
            "email": {
                "bsonType": "string",
                "pattern": "^\\S+@\\S+\\.\\S+$",
                "description": "Please enter a valid email"
            },
            "password": {
                "bsonType": "string",
                "minLength": 6,
                "maxLength": 64,
                "description": "Password must be between 6 and 64 characters long"
            },
            "phone": {
                "bsonType": "string",
                "minLength": 10,
                "description": "Please enter a valid phone number"
            },
            "dob": {
                "bsonType": "string",
                "description": "Please enter a valid date of birth"
            }
        }
    }
}

center_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["title", "description", "location", "image"],
        "properties": {
            "title": {
                "bsonType": "string",
                "minLength": 4,
                "maxLength": 50,
                "description": "Title must be between 4 and 50 characters long"
            },
            "description": {
                "bsonType": "string",
                "minLength": 10,
                "maxLength": 60,
                "description": "Description must be between 10 and 60 characters long"
            },
            "location": {
                "bsonType": "string",
                "minLength": 3,
                "maxLength": 50,
                "description": "Location must be between 3 and 50 characters long"
            },
            "image": {
                "bsonType": "binData",
                "description": "Please enter a valid image"
            },
            "inmates": {
                "bsonType": "array",
                "items": {
                    "bsonType": "objectId",
                    "description": "Each inmate must be a valid ObjectId"
                }
            }
        }
    }
}

db.create_collection("users", validator=user_schema)
db.create_collection("centers", validator=center_schema)

print("Database and collections created successfully with validation schemas.")
