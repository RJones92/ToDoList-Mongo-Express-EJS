# To-do-list
To do list using RESTful API and Mongo DB (Mongoose)

# Start up
Before starting you'll have to configure app.js to connect to a Mongo DB. See instructions below.
Spin up a server by using command 'node app.js'
Navigate to browser and go to localhost:3000

#Connecting to the DB.
You'll have to either:
- connect to a local Mongo DB, e.g. "mongodb://localhost:27017/todolistDB", or
- connect to a remote Mongo DB
For both, you'll have to configure this in app.js under the mongoose.connect method.

#Using the app
localhost:3000 will take you to a default list where you can add items or click the checkbox to remove them.
You can also enter the URL localhost:3000/yourlist. This will create a new list in your DB (lists are a collection, each list is an document in that collection). yourlist can be called whatever you want it to be.
You can return to yourlist to see that specific to do list and it's items.
