"use strict";
/**
 * You must implement the methods in this
 * file to interact with the Mongo database.
 * 
 * Created by sdiemert on 2016-05-25.
 */

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

    /**
     * Connects to the database.
     * @param callback {function} called when the connection completes.
     *      Takes an error parameter.
     */
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

    /**
     * Closes the connection to the database.
     */
    close() {
        this._db.close();
    }

    /**
     * Queries the database for all document and returns them via the callback
     * function.
     *
     * @param callback {function} called when query finishes.
     *      Takes two parameters: 1) error parameter, 2) data returned from query.
     */
    getAllDocuments(callback, collection) {
        // Get the timer collection
        var collection = this._db.collection(collection);
        // Find some tasks
        collection.find({}).toArray(function(err, data) {
            callback(err, data);
        });
    }

    /**
     * Queries the database and returns result via the callback
     * function.
     *
     * @param callback {function} called when query finishes.
     *      Takes two parameters: 1) error parameter, 2) data returned from query.
     */
    getQuery(collection, query, callback) {
        // Get the timer collection
        var collection = this._db.collection(collection);
        // Find some tasks
        collection.find(query).toArray(function(err, data) {
            callback(err, data);
        });
    }

    /**
     * Adds a document to the database.
     *
     * @param document {object} represents the document to be added to the DB.
     * @param callback {function} called when query finishes.
     *      Takes a single error parameter.
     */
    addDocuments(item, callback, collection) {
         // Get the timer collection
        var collection = this._db.collection(collection);
        // Insert some documents
        collection.insertOne(item, function(err, result) {
            console.log("Inserted 1 document");
            callback(result);
        });
    }

    /**
     * Remove a document from the database.
     *
     * @param id {number} id of object to remove.
     * @param callback {function} called when remove is completed.
     */
    removeDocuments(id, callback, collection) {
        // Get the documents collection
        var collection = this._db.collection(collection);
        // Remove the document
        collection.deleteOne({ id : id }, function(err, result) {
            console.log("Removed documents");
            callback();
        });
    }

    // Update a document based on a query
    updateGame(board, callback, collection) {
      // Get the documents collection
      var collection = this._db.collection('documents');
      // Update document where a is 2, set b equal to 1
      collection.updateOne({ gameId : board.gameId }, { $set: board }, function(err, result) {
        console.log("Updated the document hopefully");
        callback(result);
      });  
    }

}

module.exports = MongoDB; 
