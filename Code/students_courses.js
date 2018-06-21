module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* get people to populate in dropdown */
    function getPeople(res, mysql, context, complete){
        mysql.pool.query("SELECT number, lastName, firstName FROM person", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    /* get certificates to populate in dropdown */
    function getCourses(res, mysql, context, complete){
        sql = "SELECT courseCode, name FROM course";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.courses = results
            complete();
        });
    }

    /* get people with their certificates */
    /* TODO: get multiple certificates in a single column and group on
     * fname+lname or id column
     */
    function getStudentsWithCourses(res, mysql, context, complete){
        sql = "SELECT student_course.studentNumber, student_course.courseCode, CONCAT(firstName,' ',lastName) AS studentName, course.name AS courseName FROM person INNER JOIN student_course ON person.number = student_course.studentNumber  INNER JOIN course ON student_course.courseCode = course.courseCode ORDER BY studentName, courseName"
         mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.students_with_courses = results
            complete();
        });
    }


    /* List people with certificates along with
     * displaying a form to associate a person with multiple certificates
     */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'students_courses'

        getPeople(res, mysql, context, complete);
        getCourses(res, mysql, context, complete);
        getStudentsWithCourses(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render(handlebars_file, context);
            }
        }
    });

    /* Associate certificate or certificates with a person and
     * then redirect to the people_with_certs page after adding
     */
    router.post('/', function(req, res){
        console.log("We get the multi-select certificate dropdown as ", req.body.courses)
        var mysql = req.app.get('mysql');
        // let's get out the certificates from the array that was submitted by the form
        
        var certificates = req.body.courses;
        var person = req.body.studentNumber;
        if(Array.isArray(certificates)){
            for (let cert of certificates) {
            console.log("Processing certificate id " + cert)
            var sql = "INSERT INTO student_course (studentNumber, courseCode) VALUES (?, ?)";
            var inserts = [person, cert];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    
                    console.log(error)
                }
            });} 
        }else{
            var sql = "INSERT INTO student_course (studentNumber, courseCode) VALUES (?, ?)";
            var inserts = [person, certificates];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    
                    console.log(error)
                }
            });
        }
        
        res.redirect('/students_courses');
    });

    /* Delete a person's certification record */
    /* This route will accept a HTTP DELETE request in the form
     * /pid/{{pid}}/cert/{{cid}} -- which is sent by the AJAX form
     */
    router.delete('/pid/:pid/cert/:cid', function(req, res){
        //console.log(req) //I used this to figure out where did pid and cid go in the request
        console.log(req.params.pid)
        console.log(req.params.cid)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM student_course WHERE studentNumber = ? AND courseCode = ?";
        var inserts = [req.params.pid, req.params.cid];
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
