module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getPrograms(res, mysql, context, complete){
        mysql.pool.query("SELECT programCode, name FROM program", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.programs  = results;
            complete();
        });
    }


    function getCourses(res, mysql, context, complete){
        mysql.pool.query("SELECT courseCode, name, hours, credits FROM course", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.courses = results;
            complete();
        });
    }

    function getCourse(res, mysql, context, id, complete){
        var sql = "SELECT courseCode, name, hours, credits FROM course WHERE courseCode = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.course = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecourse.js"];
        var mysql = req.app.get('mysql');
        getCourses(res, mysql, context, complete);
        getPrograms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('courses', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecourse.js"];
        var mysql = req.app.get('mysql');
        getCourse(res, mysql, context, req.params.id, complete);
        getPrograms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-course', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO course (courseCode, name, hours, credits) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.courseCode, req.body.name, req.body.hours, req.body.credits];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/courses');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE course SET courseCode=?, name=?, hours=?, credits=? WHERE courseCode = ?";
        var inserts = [req.body.courseCode, req.body.name, req.body.hours, req.body.credits, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM course WHERE courseCode = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
