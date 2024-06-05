import base64
import random

from bson.objectid import ObjectId
from faker import Faker
from pymongo import MongoClient

# populate centers_ids with random object ids
centers_ids = [ObjectId() for _ in range(random.randint(1, 50))]
# populate inmates_ids with random object ids
inmates_ids = [ObjectId() for _ in range(random.randint(1, 50))]

# read image file as base64
with open('img.jpg', 'rb') as image_file:
    image_binary = base64.b64encode(image_file.read())

used_centers = []
used_inmates = []

fake = Faker()

client = MongoClient('localhost', 27018)

db = client['DeAd']

users_collection = db['users']
num_users = random.randint(10, 15)
for _ in range(num_users):
    user_data = {
        "_id": ObjectId(),
        "firstName": fake.first_name(),
        "lastName": fake.last_name(),
        "username": fake.user_name(),
        "email": fake.email(),
        "password": fake.password(),
        "phone": fake.phone_number(),
        "dob": fake.date_of_birth().strftime('%Y-%m-%d'),
        "role": random.choice(['admin', 'user'])
    }
    users_collection.insert_one(user_data)

centers_collection = db['centers']
num_centers = random.randint(10, 15)
for _ in range(num_centers):
    inmates = None
    while not inmates:
        inmates = random.choices(inmates_ids, k=random.randint(1, 5))
        if inmates in used_inmates:
            inmates = None
    used_inmates.append(inmates)
    center_data = {
        "_id": ObjectId(),
        "image": image_binary,
        "title": fake.company(),
        "description": fake.catch_phrase(),
        "location": fake.address(),
        "inmates": inmates
    }
    centers_collection.insert_one(center_data)

inmates_collection = db['inmates']
num_inmates = random.randint(10, 15)
for _ in range(num_inmates):
    center = None
    while not center:
        center = random.choice(centers_ids)
        if center in used_centers:
            center = None
    used_centers.append(center)
    inmate_data = {
        "_id": ObjectId(),
        "image": fake.image_url(),
        "fullName": fake.name(),
        "crime": fake.word(),
        "sentence": fake.sentence(),
        "center": center
    }
    inmates_collection.insert_one(inmate_data)

visits_collection = db['visits']
for inmate_id in inmates_ids:
    num_visits = random.randint(5, 10)
    for _ in range(num_visits):
        visit_data = {
            "_id": ObjectId(),
            "inmate": inmate_id,
            "date": fake.date(pattern="%Y-%m-%d"),
            "time": fake.time(pattern="%H:%M:%S"),
            "duration": random.randint(1, 24),
            "nature": fake.word(),
            "objects_exchanged": fake.paragraph(),
            "summary": fake.paragraph(),
            "health": fake.word(),
            "witnesses": fake.name()
        }
        visits_collection.insert_one(visit_data)

print("Random data inserted successfully.")
