const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const helper = require('../helper/helper')

//User model
const Experiment = require('../models/Experiment');

//GET EXPERIMENTS
router.get('/', ensureAuthenticated, (req,res) => {
    //array with items to send
    var items = [];

    Experiment.find({status: 'open'}, )

    Experiment.find({ status : 'open' }, function (err, docs){

        if (err) throw err;
        else {
            for(var entry of docs) {
                items.push({
                    'id' : entry.id,
                    'title' : entry.title,
                    'description' : entry.description,
                    'tasks' : entry.tasks,
                    'status' : entry.status
                });
            }
        }

        res.render('dashboard', {
            name : req.user.name,
            table : items
        })
    }
    
    );


    
});

//GET experiement ->
router.get('/:id', ensureAuthenticated, (req,res) => {

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

//POST EXPERIMENT
router.get('/post', (req,res) => {
    const {id, title, description, tasks, status} = req.body;

    Experiment.findOne({ title : title})
        .then(experiment => {
            if (experiment) {
                errors.push({ msg: 'Experiment already exist!'})
                res.render('dashboard', {
                    errors,
                    title,
                    description,
                    status
                });
            }
            else {
                const newExperiment = new Experiment({
                    id,
                    title,
                    description,
                    tasks,
                    status
                });
                newExperiment.save()
                    .then(experiment => req.flash('success_msg', 'Saved Successfully'))
                    .catch(err => console.log(err));
            }
        });
    });

module.exports = router;

//GET DETAIL TASK -> 
router.get('/:expid/task/:taskname', ensureAuthenticated, (req,res) => {
    
    console.log(req.params);

    const expid = req.params.expid;
    const taskname = req.params.taskname;

    Experiment.findOne({ id : expid }, (err, doc) => {
        if (err) throw err;

        for (const task of doc.tasks) {
            if (task.title === taskname) {
                return res.render('taskdetail', {
                    task,
                    expid: expid
                })
            }
        }

        // when reaching this line, it means we have not found this taskname associate with this expID. 
        // render error page if exists or throw error.

        // throw new Error("no such askname associate with this expID")
        res.render('errorpage', {
            message: "no such askname associate with this expID"
        })
        
    });


    
});