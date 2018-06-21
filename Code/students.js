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

    function getStudents(res, mysql, context, complete){
        mysql.pool.query("SELECT number, program.name, isInternational, collegeId, balance FROM student INNER JOIN program ON student.programCode = program.programCode", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.students = results;
            complete();
        });
    }

    function getStudent(res, mysql, context, id, complete){
        var sql = "SELECT number, programCode, isInternational, collegeId, balance FROM student WHERE number = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.student = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletestudent.js"];
        var mysql = req.app.get('mysql');
        getStudents(res, mysql, context, complete);
        getPrograms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('students', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedprogram.js", "updatestudent.js"];
        var mysql = req.app.get('mysql');
        getStudent(res, mysql, context, req.params.id, complete);
        getPrograms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-student', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO student (number, programCode, isInternational, collegeId, balance) VALUES (?, ?, ?, ?, ?)";
        var inserts = [req.body.number, req.body.programCode, req.body.isInternational, req.body.collegeId, req.body.balance];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/students');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE student SET number=?, programCode=?, isInternational=?, collegeId=?, balance=? WHERE number = ?";
        var inserts = [req.body.number, req.body.programCode, req.body.isInternational, req.body.collegeId, req.body.balance, req.params.id];
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
        var sql = "DELETE FROM student WHERE number = ?";
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
