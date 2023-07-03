const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://anurag:anurag@cluster0.spqvxyc.mongodb.net/todo-app",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

mongoose.connection
    .once("open", () => {
        console.log("MongoDB connection successfull");
    })
    .on("error", () => {
        console.log("MongoDB connection failed");
    })

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const Todo = mongoose.model('Todo', todoSchema);

app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(404).json(error);
    }
});

app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id });
        res.status(200).json({ todo });
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

app.post("/todos", async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.status(201).json({ message: "New todo created", todo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.put("/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        await Todo.findByIdAndUpdate(req.params.id, { title, description });

        res.status(200).json({ message: "Todo updated successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})

app.delete("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        res.status(200).json("Todo successfully deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
});