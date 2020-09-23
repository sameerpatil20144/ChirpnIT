const mongoose = require("mongoose");

const todoListSchema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var ToDo = (module.exports = mongoose.model("ToDo", todoListSchema));

module.exports.createTodo = (newTodo, callback) => {
    ToDo.create(newTodo, callback);
};

module.exports.getToDo = (callback) => {
    ToDo.find(callback);
};

module.exports.updateTodo = (id, todo, callback) => {
    var query = { _id: id };
    ToDo.updateOne(query, todo, callback);
}

module.exports.removeRecord = (id, callback) => {
    var query = {
        _id: id
    };
    ToDo.deleteOne(query, callback);
};



