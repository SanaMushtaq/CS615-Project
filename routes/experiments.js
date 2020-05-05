const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const helper = require('../helper/helper')

//User model
const Experiment = require('../models/Experiment');

//GET EXPERIMENTS
router.get('/', ensureAuthenticated, (req,res) => {
    getExperiments(req, res);
});

//GET experiment ->
router.get('/:id/tasks', ensureAuthenticated, (req,res) => {

    Experiment.findOne({ id : req.params.id }, (err, doc) => {

        console.log(doc.tasks);

        if (err) throw err;

        res.render('task', {
            name : req.user.name,
            table : helper.shuffle(doc.tasks), 
            expID : req.params.id
        })
    });
    
}); 

//GET DETAIL TASK -> 
router.get('/:expid/tasks/:taskname', ensureAuthenticated, (req,res) => {
    
    console.log(req.params);

    const expid = req.params.expid;
    const taskname = req.params.taskname;

    Experiment.findOne({ id : expid }, (err, doc) => {
        if (err) throw err;

        for (const task of doc.tasks) {
            if (task.id === taskname) {
                return res.render('taskdetail', {
                    task,
                    expid: expid
                })
            }
        }

        // when reaching this line, it means we have not found this taskname associate with this expID. 
        // render error page if exists or throw error.
        
    });
});

//UPDATE DASHBOARD
router.put('/:id', ensureAuthenticated, (req, res) => {
    var myquery = { id: req.params.id }; 
    var newValues = { $set: {status: "close", modifiedAt : Date.now()} };

    Experiment.findOneAndUpdate(myquery, newValues, (err, res) => {
        if (err) throw err;
        console.log(res);
    });

    req.url = '/';
    req.method = 'GET';
    //req.query = '';
    getExperiments(req, res);

});

function getExperiments(req, res) {

    console.log('req.url: '+req.url + req.method);
    //console('res.url: '+res);
    const { page, perPage } = req.query;
    const options = {
        page: parseInt(page, 10) || 0,
        perPage: parseInt(perPage, 10) || 10,
      };

    
    //array with items to send
    var items = [];
    count = Experiment.countDocuments();

    Experiment.find({ status : 'open'})
    .skip(options.page * options.perPage)
    .limit(options.perPage)
    .exec((err, docs) => {
        if (err) throw err;
        else {
            //docs = Experiment.paginate({}, options);
            for(var entry of docs) {
                items.push({
                    'id' : entry.id,
                    'title' : entry.title,
                    'description' : entry.description,
                    'tasks' : entry.tasks,
                    'status' : entry.status
                });
            }

            res.render('dashboard', {
                name : req.user.name,
                table : items
            });
        }   
    })
}

module.exports = router;