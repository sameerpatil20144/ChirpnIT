const { use } = require("chai");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ToDoList = require("../models/todoList");
("use strict");

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
   
    let todoData = new ToDoList();

    todoData.name = req.body.name;
    todoData.description = req.body.description;

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ success: false, errors: errors });
    }

    if (req.user.type === 'admin') {

        ToDoList.createTodo(todoData, (err, result) => {
            if (err) {
                res.json({
                    success: false,
                    result: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    msg: " Record added Successfully !!",
                    result: result
                })
            }
        })

    } else {
        res.json({
            success: false,
            result: 'You are not admin'
        })
    }

});

router.get('/', (req, res) => {
    ToDoList.getToDo((err, result) => {
        res.status(200).json({
            success: true,
            msg: "successfully fetched record",
            result: result
        })
    })
});

router.put('/:todoId', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    let todoData = new ToDoList();
    todoData._id = req.params.todoId

    todoData.name = req.body.name;
    todoData.description = req.body.description;

    if (req.user.type === 'admin') {
        
        ToDoList.updateTodo(todoData._id, todoData, function (error,result) {
            if (error) {
                error = new Error(error);
                res.json({
                    success: false,
                    result: error.message
                });
                return;
            }
            else {
                res.json({
                    success: true,
                    msg: 'Data updated successfully !!',
                    result: result
                });
            }
        });

    } else {
        res.json({
            success: false,
            result: 'You are not admin !!'
        });
    }
});

router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    var id = req.params.id;
    try{

        if (req.user.type === 'admin') {
    
        ToDoList.removeRecord(id, (error) => {
            if (error) {
                error = new Error(error);
                res.json({
                    success: false,
                    result: error.message
                });
            }
            res.json({
                success: true,
                result: 'Record deleted succesfully !!'
            })
        });
        }else{
            return res.json({
                success: false,
                result: "You are not admin !!"
            })
        }
    }catch(error){
        return res.json({
            success: false,
            result: "Error while deleting to-do item"
        })
    }
});

module.exports = router;
