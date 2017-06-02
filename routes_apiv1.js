var router = require('express').Router();
var jwt = require('jwt-simple');
var sql = require('mysql');
var path = require('path');
var settings = require('./config.json');

var dbConnection;

router.post('/activiteiten', function (req, res) {
    var update_date = req.body.update_date ||  '';

    if (update_date == '') {
        console.log("Incompatible date format");
            res.status(500);
            res.json({
                "status": 500,
                "message": "Incompatible date format"
            });
    } else {
        dbConnection = sql.createConnection({
                            host     : settings.dbHost,
                            user     : settings.dbUser,
                            password : settings.dbPassword,
                            dateStrings: 'date'
                        });
        dbConnection.connect(function(err){
            if(!err) {
                console.log("Database is connected ... nn");
            } else {
                console.log("Error connecting database ... nn");
            }
        });

            try {
                dbConnection.query('SELECT * FROM SVVirgo.activities WHERE updated > \'' + update_date + '\' ORDER BY start DESC', function (err, rows, fields) {
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
            } catch (err) {
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

router.get('/activiteiten/sort', function (req, res) {
    var events_after = req.body.events_after ||  '';

    if (update_date == '') {
        console.log("Incompatible date format");
        res.status(500);
        res.json({
            "status": 500,
            "message": "Incompatible date format"
        });
    } else {
        dbConnection = sql.createConnection({
            host: settings.dbHost,
            user: settings.dbUser,
            password: settings.dbPassword,
            dateStrings: 'date'
        });
        dbConnection.connect(function (err) {
            if (!err) {
                console.log("Database is connected ... nn");
            } else {
                console.log("Error connecting database ... nn");
            }
        });

        var response = [];

        try {
            dbConnection.query('SELECT * FROM SVVirgo.activities WHERE end >= CURRENT_DATE() ORDER BY start ASC', function (err, rows, fields) {
                if (err) throw err;

                rows.forEach(function (row) {
                    console.log("Activity: " + row.title.toString());
                    var upcoming = [];

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

                    upcoming.push(activity);
                });
                response.push(upcoming)
            });
        } catch (err) {
            console.log("Database timeout error");
            res.status(500);
            res.json({
                "status": 500,
                "message": "Database timeout error."
            });
            throw err;
        }

        try {
            dbConnection.query('SELECT * FROM SVVirgo.activities WHERE end < CURRENT_DATE() AND end > \''+ events_after +'\' ORDER BY start DESC', function (err, rows, fields) {
                if (err) throw err;

                rows.forEach(function (row) {
                    console.log("Activity: " + row.title.toString());
                    var past = [];

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

                    past.push(activity);
                });
                response.push(past)
            });
        } catch (err) {
            console.log("Database timeout error");
            res.status(500);
            res.json({
                "status": 500,
                "message": "Database timeout error."
            });
            throw err;
        }

        //console.log("JSON: " + JSON.stringify(response));

        res.status(200);
        res.json(response);
    }
});

router.post('/offers', function (req, res) {
    var update_date = req.body.update_date ||  '';

    if (update_date == '') {
        console.log("Incompatible date format");
        res.status(500);
        res.json({
            "status": 500,
            "message": "Incompatible date format"
        });
    } else {
        dbConnection = sql.createConnection({
            host     : settings.dbHost,
            user     : settings.dbUser,
            password : settings.dbPassword,
            dateStrings: 'date'
        });

        dbConnection.connect(function(err){
            if(!err) {
                console.log("Database is connected ...");
            } else {
                console.log("Error connecting database ...");
            }
        });

        try {
            dbConnection.query('SELECT * FROM SVVirgo.offers WHERE updated > \''+update_date+'\'', function (err, rows, fields) {
                if (err) throw err;

                var response = [];

                rows.forEach(function (row) {

                    var offer = {
                        id: row.id.toString(),
                        pubid: row.pubid.toString(),
                        title: row.title.toString(),
                        image: row.image==null?"":row.image.toString(),
                        offer: row.offer.toString(),
                        published: row.published.toString()
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
    }

});

router.post('/pubs', function (req, res) {
    var update_date = req.body.update_date ||  '';

    if (update_date == '') {
        console.log("Incompatible date format");
        res.status(500);
        res.json({
            "status": 500,
            "message": "Incompatible date format"
        });
    } else {
        dbConnection = sql.createConnection({
            host     : settings.dbHost,
            user     : settings.dbUser,
            password : settings.dbPassword,
            dateStrings: 'date'
        });
        dbConnection.connect(function(err){
            if(!err) {
                console.log("Database is connected ...");
            } else {
                console.log("Error connecting database ...");
            }
        });

        try {
            dbConnection.query('SELECT * FROM SVVirgo.pubs WHERE updated > \''+update_date+'\'', function (err, rows, fields) {
                if (err) throw err;

                var response = [];

                rows.forEach(function (row) {

                    var pub = {

                        id: row.id.toString(),
                        name: row.name.toString(),
                        openingtimes: row.openingstijden.toString(),
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
    }

});

// Fall back, display some info
router.get('/', function (req, res) {
    res.status(200);
    var project_description = req.app.get('project_description');
    res.json({
        "description": project_description
    });
});

module.exports = router;
