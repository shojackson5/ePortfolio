from pymongo import MongoClient
from bson.objectid import ObjectId

class AnimalShelter(object):
    """ CRUD operations for Animal collection in MongoDB """

    def __init__(self, user, password):
        # Initializing the MongoClient. 
        # Connection Variables
        USER = user
        PASS = password
        HOST = 'nv-desktop-services.apporto.com'
        PORT = 31982
        DB = 'AAC'
        COL = 'animals'
        #
        # Initialize Connection
        #
        self.client = MongoClient('mongodb://%s:%s@%s:%d' % (USER,PASS,HOST,PORT))
        self.database = self.client['%s' % (DB)]
        self.collection = self.database['%s' % (COL)]

# Method to implement the C in CRUD.
    def create(self, data):
        if data is not None:
            try:
                self.collection.insert_one(data)  # data should be dictionary  
                return True
            except Exception as e:
                return False
        else:
            raise ValueError("Nothing to add, because data parameter is empty")

# Method to implement the R in CRUD.
    def read(self, search):
        if search is not None:
            return self.collection.find(search)  # Put search results in a list
        else:
            return self.collection.find()

# Method to implement the U in CRUD.
    def update(self, old_entry, new_entry):
        if old_entry and new_entry is not None:
            update_count = 0 # Variable to return number of entries updated                 
            results = list(self.collection.find(old_entry))  # Put search results in a list
            for animal in results: 
                self.collection.update(old_entry, new_entry)
                update_count += 1
            print("Entries updated: ", update_count) # Print results of search
        else:
            raise ValueError("Nothing to update, because data parameters not complete")

# Method to implement the D in CRUD.
    def delete(self, delete_entry):
        if delete_entry is not None:
            delete_count = 0 # Variable to return number of entries deleted
            result = list(self.collection.find(delete_entry))  # Put search results in a list
            for animal in result:
                self.collection.delete_one(delete_entry)
                delete_count += 1
            print("Entries deleted: ", delete_count) # Print results of search       
        else:
            raise ValueError("Nothing to delete, because data parameter is empty")
