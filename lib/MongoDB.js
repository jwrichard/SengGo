"use strict";

// See https://github.com/mongodb/node-mongodb-native for details.
var MongoClient = require("mongodb").MongoClient;

class MongoDB {

    constructor(u, p, db, host, port) {
        this._user   = u;
        this._passwd = p;
        this._dbname = db || "senggo";
        this._host   = host || "localhost";
        this._port   = port || 27017;
        this._db = null;
    }

    // Connects to the database.
    connect(callback) {
        
        var that = this; 

        MongoClient.connect(
            "mongodb://" + this._host + ":" + this._port + "/" + this._dbname,
            function (err, db) {

                if (err) {
                    console.log("ERROR: Could not connect to database.");
                    that._db = null;
                    callback(err);
                } else {
                    console.log("INFO: Connected to database.");
                    that._db = db;
                    callback(null);
                }

            }
        );

    }

    // Closes the connection to the database.
    close() {
        this._db.close();
    }

	// Get all documents in a collection
	getAllDocuments(callback, collection) {
        var collection = this._db.collection(collection);
        collection.find({}).toArray(function(err, data) {
            callback(err, data);
        });
    }

	// Get documents by a query
    getQuery(collection, query, callback) {
        var collection = this._db.collection(collection);
        collection.find(query).toArray(function(err, data) {
            callback(err, data);
        });
    }

	// Generic function to add documents
    addDocuments(item, callback, collection) {
        var collection = this._db.collection(collection);
        collection.insertOne(item, function(err, result) {
            console.log("Inserted 1 document");
            callback(result);
        });
    }

	// Generic function to remove documents
    removeDocuments(id, callback, collection) {
        var collection = this._db.collection(collection);
        // Remove the document
        collection.deleteOne({ id : id }, function(err, result) {
            console.log("Removed documents");
            callback();
        });
    }

    // Update a game given a game object
    updateGame(board, callback, collection) {
      var collection = this._db.collection('games');
      // Update document where a is 2, set b equal to 1
      collection.updateOne({ gameId : board.gameId }, { $set: board }, function(err, result) {
        callback(result);
      });  
    }
	
	// Add a games history state
	addHistory(item, callback) {
        var collection = this._db.collection("history");
		item._id = null;
        collection.insertOne(item, function(err, result) {
            callback(err);
        });
    }
}
module.exports = MongoDB; 
