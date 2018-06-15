require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var https = require("https"); 

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});

app.get('/getUserInformation/:id/:token', function(req, res){
    var id = req.params.id;
    var token = req.params.token;

    console.log(id+" "+token);

    var options = { 
        hostname: 'a.wunderlist.com', 
        method: 'Get', 
        port : 443, 
        path : '/api/v1/user', 
        rejectUnauthorized: false, 
        headers: { 
            'X-Client-ID': id,
            'X-Access-Token':token
            } 
        }; 

        var req1 = https.get(options, (res1) => { 
    
        console.log('statusCode:', res1.statusCode); 
        console.log('headers:', res1.headers); 
    
        if(res1.statusCode==200){ 
            
        } 
    
        res1.on('data', (d) => { 
            res.send(d);  
        }); 
        }); 
    
        req1.on('error', (e) => { 
        console.error(e); 
        });           
});

app.get('/getTasks/:id/:token/:listid', function(req, res){
    var id = req.params.id;
    var token = req.params.token;
    var listid = req.params.listid;

    console.log(id+" "+token+""+listid);

    var options = { 
        hostname: 'a.wunderlist.com', 
        method: 'Get', 
        port : 443, 
        path : '/api/v1/tasks?list_id='+listid, 
        rejectUnauthorized: false, 
        headers: { 
            'X-Client-ID': id,
            'X-Access-Token':token
            } 
        }; 

        var req1 = https.get(options, (res1) => { 
    
        console.log('statusCode:', res1.statusCode); 
        console.log('headers:', res1.headers); 
    
        if(res1.statusCode==200){ 
            
        } 
    
        res1.on('data', (d) => { 
            res.send(d);  
        }); 
        }); 
    
        req1.on('error', (e) => { 
        console.error(e); 
        });           
});

app.post('/completeTasks/:id/:token/:taskid/:revision', function(req, res){
        var id = req.params.id;
        var token = req.params.token;
        var taskid = req.params.taskid;
        var revision = req.params.revision;

        console.log(id+" "+token+" "+taskid+" "+revision);

        var postData = JSON.stringify({ 
            'revision' : parseInt(revision),
            'completed' : true
        }); 

        console.log(postData);

        var http = require("https");

        var options = {
        "method": "PATCH",
        "hostname": "a.wunderlist.com",
        "port": null,
        "path": '/api/v1/tasks/'+taskid, 
        "headers": { 
            'X-Client-ID': id,
            'X-Access-Token': token,
            'Content-Type':'application/json'
            } 
        };

        var req1 = http.request(options, function (res1) {
        var chunks = [];

        res1.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res1.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            res.send(body.toString());
        });
        });

        req1.write(postData);

        req1.end();

});

app.post('/completeTasks/:id/:token/:taskid/:revision/:title', function(req, res){
    var id = req.params.id;
    var token = req.params.token;
    var taskid = req.params.taskid;
    var revision = req.params.revision;
    var title=req.params.title;

    console.log(id+" "+token+" "+taskid+" "+revision);

    var postData = JSON.stringify({ 
        'revision' : parseInt(revision),
        'title' : "completed: "+title
    }); 

    console.log(postData);

    var http = require("https");

    var options = {
    "method": "PATCH",
    "hostname": "a.wunderlist.com",
    "port": null,
    "path": '/api/v1/tasks/'+taskid, 
    "headers": { 
        'X-Client-ID': id,
        'X-Access-Token': token,
        'Content-Type':'application/json'
        } 
    };

    var req1 = http.request(options, function (res1) {
    var chunks = [];

    res1.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res1.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        res.send(body.toString());
    });
    });

    req1.write(postData);

    req1.end();

});

/* app.put('/completeTasks/:id/:token/:taskid/:revision', function(req, res){
    var id = req.params.id;
    var token = req.params.token;
    var taskid = req.params.taskid;
    var revision = req.params.revision;

    console.log(id+" "+token+" "+taskid+" "+revision);

    var postData = JSON.stringify({ 
        'revision' : revision,
        'completed' : true
    }); 

    console.log(postData);

    var options = { 
        hostname: 'a.wunderlist.com', 
        method: 'Patch', 
        port : 443, 
        path : '/api/v1/tasks/'+taskid, 
        rejectUnauthorized: false, 
        headers: { 
            'X-Client-ID': id,
            'X-Access-Token': token,
            'Content-Type':'application/json'
            } 
        }; 

        var req1 = https.get(options, (res1) => { 
    
        console.log('statusCode:', res1.statusCode); 
        console.log('headers:', res1.headers); 
    
        res1.on('data', (d) => { 
            
            }); 
        }); 
    
        req1.on('error', (e) => { 
        console.error("Request "+e); 
        });       
        
        req1.write(postData);
        req1.end();
        

}); */

app.post('/setReminder/:id/:token/:taskid/:completedTime', function(req, res){
    var id = req.params.id;
    var token = req.params.token;
    var taskid = req.params.taskid;
    var completedTime = req.params.completedTime;

    console.log(id+" "+token+" "+taskid+" "+completedTime);

    var postData = JSON.stringify({ 
        'task_id' : parseInt(taskid),
        'date' : completedTime
    }); 

    console.log(postData);

    var http = require("https");

    var options = {
    "method": "Post",
    "hostname": "a.wunderlist.com",
    "port": null,
    "path": '/api/v1/reminders', 
    "headers": { 
        'X-Client-ID': id,
        'X-Access-Token': token,
        'Content-Type':'application/json'
        } 
    };

    var req1 = http.request(options, function (res1) {
    var chunks = [];

    res1.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res1.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        res.send(body.toString());
    });
    });

    req1.write(postData);

    req1.end();

});

app.post('/createSumTask/:id/:token/:listid/:sum', function(req, res){
    var id = req.params.id;
    var token = req.params.token;
    var listid = req.params.listid;
    var sum = req.params.sum;

    console.log(id+" "+token+" "+listid);

    var postData = JSON.stringify({ 
        'list_id' : parseInt(listid),
        'title' : sum+" Artikel erledigt - "+(new Date()).toString().slice(4,24)
    }); 

    console.log(postData);

    var http = require("https");

    var options = {
    "method": "Post",
    "hostname": "a.wunderlist.com",
    "port": null,
    "path": '/api/v1/tasks', 
    "headers": { 
        'X-Client-ID': id,
        'X-Access-Token': token,
        'Content-Type':'application/json'
        } 
    };

    var req1 = http.request(options, function (res1) {
    var chunks = [];

    res1.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res1.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        res.send(body.toString());
    });
    });

    req1.write(postData);

    req1.end();

});

app.post('/createSubtasks/:id/:token/:taskid/:ctasks/:dataset', function(req, res){
    var id = req.params.id;
    var taskid = req.params.taskid;
    var ctasks = req.params.ctasks;
    var token = req.params.token;
    var dataset = req.params.dataset;

    console.log(id+" "+token+" "+taskid+" "+ctasks+" "+dataset);

    var task2=ctasks.split(","); 

    console.log("Task 2: "+task2);

    var j
    for ( j=0; j<=task2.length-1; j++ ) {
        createSubtasks(id, token, taskid, task2[j]);
    }
    
    var dataset2=dataset.split(","); 

    console.log("Dataset: "+dataset2);

    var j
    for ( j=2; j<=dataset2.length-1; j=j+4) {
        if(task2.findIndex(k => k==dataset2[j])<0){
            createSubtasks2(id, token, taskid, dataset2[j]);
        }    
    }


    createNote(id, token, taskid);
});

function createSubtasks(id, token, taskid, ctasks){
    var postData = JSON.stringify({ 
        'task_id' : parseInt(taskid),
        'title' : ctasks,
        'completed' : true
    }); 

    console.log(postData);

    var http = require("https");

    var options = {
    "method": "Post",
    "hostname": "a.wunderlist.com",
    "port": null,
    "path": '/api/v1/subtasks', 
    "headers": { 
        'X-Client-ID': id,
        'X-Access-Token': token,
        'Content-Type':'application/json'
        } 
    };

    var req1 = http.request(options, function (res1) {
    var chunks = [];

    res1.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res1.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
    });

    req1.write(postData);

    req1.end();
}

function createSubtasks2(id, token, taskid, ctasks){
    var postData = JSON.stringify({ 
        'task_id' : parseInt(taskid),
        'title' : ctasks
    }); 

    console.log(postData);

    var http = require("https");

    var options = {
    "method": "Post",
    "hostname": "a.wunderlist.com",
    "port": null,
    "path": '/api/v1/subtasks', 
    "headers": { 
        'X-Client-ID': id,
        'X-Access-Token': token,
        'Content-Type':'application/json'
        } 
    };

    var req1 = http.request(options, function (res1) {
    var chunks = [];

    res1.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res1.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
    });

    req1.write(postData);

    req1.end();
}

function createNote(id, token, taskid){
    var postData = JSON.stringify({ 
        'task_id' : parseInt(taskid),
        'content' : "Die Produkte ohne Häkchen konnten nicht in der smarten Einkaufsliste gefunden werden."
    }); 

    console.log(postData);

    var http = require("https");

    var options = {
    "method": "Post",
    "hostname": "a.wunderlist.com",
    "port": null,
    "path": '/api/v1/notes', 
    "headers": { 
        'X-Client-ID': id,
        'X-Access-Token': token,
        'Content-Type':'application/json'
        } 
    };

    var req1 = http.request(options, function (res1) {
    var chunks = [];

    res1.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res1.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
    });

    req1.write(postData);

    req1.end();
}