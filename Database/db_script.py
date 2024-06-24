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
                "description": "Please enter a valid first name",
                "minLength": 2,
                "maxLength": 20,
            },
            "lastName": {
                "bsonType": "string",
                "description": "Please enter a valid last name",
                "minLength": 2,
                "maxLength": 20,
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
                "description": "Please enter a valid phone number",
                "pattern": "^[0-9]{10}$"
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
        "required": [
          "image",
          "fullName",
          "crimes",
          "sentences",
          "center"
        ],
        "properties": {
          "image": {
            "bsonType": "binData",
            "description": "Please enter a valid image"
          },
          "fullName": {
            "bsonType": "string",
            "minLength": 4,
            "maxLength": 50,
            "description": "Full name must be a string."
          },
          "crimes": {
            "bsonType": "array",
            "items": {
              "minLength": 4,
              "maxLength": 50,
              "bsonType": "string"
            },
            "description": "Crimes must be an array of strings."
          },
          "sentences": {
            "bsonType": "array",
            "items": {
              "minLength": 4,
              "maxLength": 50,
              "bsonType": "string"
            },
            "description": "Sentences must be an array of strings."
          },
          "center": {
            "bsonType": "objectId",
            "description": "Center must be an object containing a valid ObjectId."
          }
        }
      }
}

visits_schema = {
      "$jsonSchema": {
        "bsonType": "object",
        "required": [
          "center",
          "inmate",
          "creator",
          "date",
          "time",
          "duration",
          "nature",
          "objectsExchanged",
          "summary",
          "health",
          "witnesses",
          "status"
        ],
        "properties": {
          "center": {
            "bsonType": "objectId",
            "description": "Center must be a valid ObjectId."
          },
          "inmate": {
            "bsonType": "objectId",
            "description": "Inmate must be a valid ObjectId."
          },
          "creator": {
            "bsonType": "string",
            "description": "Creator must be a string."
          },
          "date": {
            "bsonType": "string",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
            "description": "Date must be a string in the format YYYY-MM-DD."
          },
          "time": {
            "bsonType": "string",
            "pattern": "^\\d{2}:\\d{2}$",
            "description": "Time must be a string in the format HH:MM."
          },
          "duration": {
            "bsonType": "number",
            "description": "Duration must be a number."
          },
          "nature": {
            "bsonType": "string",
            "description": "Nature must be a string."
          },
          "objectsExchanged": {
            "bsonType": "string",
            "description": "ObjectsExchanged must be a string."
          },
          "summary": {
            "bsonType": "string",
            "description": "Summary must be a string."
          },
          "health": {
            "bsonType": "string",
            "description": "Health must be a string."
          },
          "witnesses": {
            "bsonType": "number",
            "description": "Witnesses must be a number."
          },
          "status": {
            "bsonType": "string",
            "enum": [
              "pending",
              "approved",
              "denied",
              "attended"
            ],
            "description": "Status must be a string and one of the following values: pending, approved, denied, attended."
          }
        }
      }
}


db.create_collection("users", validator=user_schema)
db.create_collection("centers", validator=center_schema)
db.create_collection("inmates", validator=inmates_schema)
db.create_collection("visits", validator=visits_schema)

print("Database and collections created successfully with validation schemas.")
