///<reference path="../../tsd_typings/tsd.d.ts" />
import Q = require('q');
import fs = require('fs');
import path = require('path');
import * as mongoskin from 'mongoskin';

let quit = false;

var config = {
	port: 3000,
	mongo_url: 'mongodb://@localhost:27017/animals'
}

var db = mongoskin.db(config.mongo_url, {safe:true})

function readDatabase() {        
    let json = fs.readFileSync("animal.json", "utf-8");
    let db = JSON.parse(json);
    //dumpNode(db, 0);
    return db;
}

function dumpNode(node, indent) {
    if (!node) {
        return;
    }
    var prefix = space(indent);
    console.log(prefix + node.text);
    if (isAnimal(node)) {
        return;
    }
    console.log(prefix + "Yes");
    dumpNode(node.yes, indent + 1);
    console.log(prefix + " No");
    dumpNode(node.no, indent + 1);
}

function isAnimal(node) {
    return node.yes == null && node.no == null;
}
function space(num) {
    var result = "";
    while (num > 0) {
        result += " ";
        --num;
    }
    return result;
}

function saveToMongo(node, isRootQuestion) {
    var defer = Q.defer();
    if (!node) {
        defer.resolve(null);
        return defer.promise;
    }
    
    let y = null;
    let n = null;

    saveToMongo(node.yes, false)
        .then(function(res) {
            y = res;
            return y;
        })
        .then(function() {
            return saveToMongo(node.no, false);
        })            
        .then(function(res) {
            n = res;
            return n;
        })
        .then(function(){
            var yes = (y == null) ? 0 : y.questionId;
            var no = (n == null) ? 0 : n.questionId;
            var coll = db.collection("questions");
            coll.find({}, { _id: 0, questionId: 1 }).sort({ questionId: -1 }).toArray(function (e, questions) {
                if (e) {
                    console.log("error", e);
                    defer.reject(e);
                    return;
                }
                var lastNumber = (questions.length === 0) ? 0 : questions[0].questionId;
                var nextNumber = lastNumber + 10;
                var question = {
                    questionId: nextNumber,
                    text: node.text,
                    yes: yes,
                    no: no, 
                    isRoot: isRootQuestion
                };
                coll.insert(question, {}, function (e, result) {
                    if (e) {
                        defer.reject(e);
                    }
                    else {
                        defer.resolve(result[0]);                        
                    }
                });
            });
        })
        .catch(function(err) {
            console.log("saveToMongo Error:", err);
            defer.reject(err);
        });
        
            
    return defer.promise;
}

let root = readDatabase();
saveToMongo(root, true)
    .then(function(res) {
        console.log("saved", res);
        db.close();
    })
    .catch(function(err) {
        console.log("Main Error: ", err);
        db.close();
    })
//wait();