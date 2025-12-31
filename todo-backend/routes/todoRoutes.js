const express = require("express");
const todo = require("../models/todo");
const todoRouter = express.Router();

todoRouter.post("/create", async (req, res) => {
  try {
    const newTodo = await todo.create(req.body);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Failed to create todo" });
  }
});

todoRouter.get("/all", async (req, res) => {
  try {
    const todos = await todo.find();
    res.status(200).json({
      message: "todos fetch suceessfully !",
      alltodos: todos,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create todo" });
  }
});

todoRouter.put("/:todoId", async (req, res) => {
  try {
    const updatedTodo = await todo.findByIdAndUpdate(
      req.params.todoId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: "Failed to update todo" });
  }
});

todoRouter.delete("/:todoId", async (req, res) => {
  try {
    const deletedTodo = await todo.findByIdAndDelete(req.params.todoId, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({
      message: "todo deleted successfully",
      deletedTodo,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete todo" });
  }
});

module.exports = todoRouter;
