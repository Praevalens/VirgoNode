// fmon version 2 - (Mains Frequency Monitoring API)
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var sql = require('mysql');
var path = require('path');
var settings = require('./config.json');

var dbConnectionl

router.post('/activiteiten', function (req, res) {
    var update_date = req.body.update_date ||  '';

    console.log("Got to the actual request");

    if (update_date == '') {
        console.log("Incompatible date format");
            res.status(500);
            res.json({
                "status": 500,
                "message": "Incompatible date format"
            });
    } else {

        console.log("Got to handling the request:" + update_date);
        dbConnection = sql.createConnection({
                            host     : settings.dbHost,
                            user     : settings.dbUser,
                            password : settings.dbPassword
                        });
        dbConnection.connect(function(err){
            if(!err) {
                console.log("Database is connected ... nn");
            } else {
                console.log("Error connecting database ... nn");
            }
        });

        try {
            dbConnection.query('SELECT * FROM SVVirgo.activities WHERE updated > \''+update_date+'\'', function (err, rows, fields) {
                if (err) throw err;

                var response = [];

                rows.forEach(function (row) {
                    console.log("Activity: " + row.title.toString());

                    var activity = {
                        id: row.id.toString(),
                        name: row.title.toString(),
                        description: row.description.toString(),
                        image: row.image.toString(),
                        startDate: row.start.toString(),
                        endDate: row.end.toString(),
                        price: row.price.toString(),
                        facebook: row.facebook.toString(),
                        location: row.location.toString()
                    };
                    response.push(activity);
                });

                //console.log("JSON: " + JSON.stringify(response));

                res.status(200);
                res.json(response);
            });
        } catch (err){
                console.log("Database timeout error");
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "Database timeout error."
                });
                throw err;
        }
        dbConnection.end();
    }
});

router.get('/offers', function (req, res) {
    dbConnection = sql.createConnection({
                        host     : settings.dbHost,
                        user     : settings.dbUser,
                        password : settings.dbPassword
                    });
    dbConnection.connect(function(err){
        if(!err) {
            console.log("Database is connected ...");
        } else {
            console.log("Error connecting database ...");
        }
    });

    try {
        dbConnection.query('SELECT * FROM SVVirgo.offers', function (err, rows, fields) {
            if (err) throw err;

            var response = [];

            rows.forEach(function (row) {

                var offer = {
                    pubid: row.pubid.toString(),
                    offer: row.offer.toString(),
                    expires: row.expiration.toString()
                };
                response.push(offer);
            });

            res.status(200);
            res.json(response);

        });
    } catch (err){
        console.log("Database timeout error");
        res.status(500);
        res.json({
            "status": 500,
            "message": "Database timeout error."
        });
        throw err;
    }
    dbConnection.end();
});

router.get('/pubs', function (req, res) {
    dbConnection = sql.createConnection({
                        host     : settings.dbHost,
                        user     : settings.dbUser,
                        password : settings.dbPassword
                    });
    dbConnection.connect(function(err){
        if(!err) {
            console.log("Database is connected ...");
        } else {
            console.log("Error connecting database ...");
        }
    });

    try {
        dbConnection.query('SELECT * FROM SVVirgo.pubs', function (err, rows, fields) {
            if (err) throw err;

            var response = [];

            rows.forEach(function (row) {

                var pub = {

                    id: row.id.toString(),
                    name: row.name.toString(),
                    description: row.description.toString(),
                    logo: row.logo.toString(),
                    location: row.location.toString(),
                    link: row.link.toString()

                };
                response.push(pub);
            });

            res.status(200);
            res.json(response);

        });
    } catch (err){
        console.log("Database timeout error");
        res.status(500);
        res.json({
            "status": 500,
            "message": "Database timeout error."
        });
        throw err;
    }
    dbConnection.end();
});

// Fall back, display some info
router.get('/', function (req, res) {
    res.status(200);
    var project_description = req.app.get('project_description');
    res.json({
        "description": project_description
    });
});