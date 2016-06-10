"use strict";
/**
 * Created by sdiemert on 2016-05-25.
 */

class DBAdapter{
    
    constructor(user, passwd, dbname, url, port){
        
    }

    /**
     * Connects to the database. 
     * @param callback {function} called when the connection completes.
     *      Takes an error parameter.
     */
    connect(callback){
        throw new Error("interface class, method not callable");
    }

    /**
     * Closes the database connection.
     */
    close(){
        throw new Error("interface class, method not callable");
    }

    /**
     * Queries the database for all tasks and returns them via the callback
     * function.
     *
     * @param callback {function} called when query finishes.
     *      Takes two parameters: 1) error parameter, 2) data returned from query.
     */
    getAllTasks(callback){
        throw new Error("interface class, method not callable");
    }

    /**
     * Adds a task to the database.
     * 
     * @param task {object} represents the task to be added to the DB.
     * @param callback {function} called when query finishes.
     *      Takes a single error parameter. 
     */
    addTask(task, callback){
        throw new Error("interface class, method not callable");
    }

    /**
     * Remove a task from the database.  
     * 
     * @param id {number} id of object to remove. 
     * @param callback {function} called when remove is complete.
     */
    removeTask(id, callback){
        throw new Error("interface class, method not callable");
    }
    
}

module.exports = DBAdapter; 