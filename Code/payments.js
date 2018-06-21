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


    function getPayments(res, mysql, context, complete){
        mysql.pool.query("SELECT id, studentNumber, invoiceNumber, transactionDate, amount FROM payment", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.payments = results;
            complete();
        });
    }

    function getPayment(res, mysql, context, id, complete){
        var sql = "SELECT id, studentNumber, invoiceNumber, transactionDate, amount FROM payment WHERE id =  ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.payment = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepayment.js"];
        var mysql = req.app.get('mysql');
        getPayments(res, mysql, context, complete);
        getPrograms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('payments', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatepayment.js"];
        var mysql = req.app.get('mysql');
        getPayment(res, mysql, context, req.params.id, complete);
        getPrograms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-payment', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO payment (studentNumber, invoiceNumber, transactionDate, amount) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.studentNumber, req.body.invoiceNumber, req.body.transactionDate, req.body.amount];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/payments');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE payment SET studentNumber=?, invoiceNumber=?, transactionDate=?, amount=? WHERE id = ?";
        var inserts = [req.body.studentNumber, req.body.invoiceNumber, req.body.transactionDate, req.body.amount, req.params.id];
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
        var sql = "DELETE FROM payment WHERE id = ?";
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
