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

inmates_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["image", "fullName", "crime", "sentence", "center"],
        "properties": {
            "image": {
                "bsonType": "binData",
                "description": "Please provide a valid image in binary format"
            },
            "fullName": {
                "bsonType": "string",
                "minLength": 5,
                "maxLength": 50,
                "description": "Please enter the full name of the inmate"
            },
            "crime": {
                "bsonType": "string",
                "minLength": 10,
                "maxLength": 50,
                "description": "Please enter the crime committed by the inmate"
            },
            "sentence": {
                "bsonType": "string",
                "minLength": 10,
                "maxLength": 50,
                "description": "Please enter the sentence of the inmate"
            },
            "center": {
                "bsonType": "objectId",
                "description": "Please provide a valid ObjectId for the center"
            }
        }
    }
}

visits_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["center", "inmate", "date", "time", "duration", "nature", "objectsExchanged", "summary", "health", "witnesses", "status", "creator"],
        "properties": {
            "center": {
                "bsonType": "objectId",
                "description": "Please provide a valid ObjectId for the center"
            },
            "inmate": {
                 "bsonType": "objectId",
                 "description": "Please provide a valid ObjectId for the inmate"
            },
            "date": {
                  "bsonType": "string",
                  "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
                  "description": "Please enter a valid date in YYYY-MM-DD format"
            },
            "time": {
                  "bsonType": "string",
                  "pattern": "^\\d{2}:\\d{2}$",
                  "description": "Please enter a valid time in HH:MM format"
            },
            "duration": {
                  "bsonType": "int",
                  "minimum": 1,
                  "description": "Please enter a valid duration in hours"
            },
            "nature": {
                  "bsonType": "string",
                  "enum": ["Official", "Personal", "Legal", "Medical"],
                  "description": "Nature must be one of the allowed values: Official, Personal, Legal, Medical"
            },
            "objectsExchanged": {
                  "bsonType": "string",
                  "description": "Please describe the objects exchanged during the visit"
            },
            "summary": {
                  "bsonType": "string",
                  "description": "Please provide a summary of the visit"
            },
            "health": {
                  "bsonType": "string",
                  "description": "Please provide health details discussed during the visit"
            },
            "witnesses": {
                  "bsonType": "int",
                  "minimum": 1,
                  "maximum": 10,
                  "description": "Please provide the number of witnesses, must be a positive integer"
            },
            "status": {
                  "bsonType": "string",
                  "enum": ["pending", "attended", "denied"],
                  "description": "Status must be one of the allowed values: pending, attended, cancelled"
            },
            "creator": {
                  "bsonType": "string",
                  "description": "Please provide the creator of the visit record"
            }
        }
    }
}


db.create_collection("users", validator=user_schema)
db.create_collection("centers", validator=center_schema)
db.create_collection("inmates", validator=inmates_schema)
db.create_collection("visits", validator=visits_schema)

print("Database and collections created successfully with validation schemas.")
