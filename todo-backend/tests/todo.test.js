const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// test-case for create new todo
test("should create a todo", async () => {
  const response = await request(app)
    .post("/todos/create")
    .send({ title: "learn tdd" });

  expect(response.statusCode).toBe(201);
  expect(response.body.title).toBe("learn tdd");
});

// test -case for getting all todos

test("should get all todos ", async () => {
  // first create two todos
  await request(app).post("/todos/create").send({ title: "todo-1" });
  await request(app).post("/todos/create").send({ title: "todo-2" });

  const response = await request(app).get("/todos/all");

  // assert
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("message");
  expect(response.body).toHaveProperty("alltodos");
  expect(response.body.alltodos.length).toBe(2);
  expect(response.body.alltodos[0]).toHaveProperty("title");
});

test("should be update todo", async () => {
  const createdResponse = await request(app).post("/todos/create").send({
    title: "old title",
  });

  const todoId = createdResponse.body._id;
  const updatedResponse = await request(app).put(`/todos/${todoId}`).send({
    title: "updated todo",
    completed: true,
  });

  expect(updatedResponse.statusCode).toBe(200);
  expect(updatedResponse.body.title).toBe("updated todo");
  expect(updatedResponse.body.completed).toBe(true);
});

test("should return 404 if todo not found", async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const response = await request(app)
    .put(`/todos/${fakeId}`)
    .send({ title: "does not exist" });

  expect(response.statusCode).toBe(404);
});

test("should delete the todo", async () => {
  //  create an todo and then delete the
  const createdResponse = await request(app)
    .post("/todos/create")
    .send({ title: "todo to be deleted" });

  const todoId = createdResponse.body._id;

  // delete the todo

  const deleteTodoResponse = await request(app).delete(`/todos/${todoId}`);

  expect(deleteTodoResponse.body.deletedTodo._id).toBe(todoId);
  expect(deleteTodoResponse.body.deletedTodo.title).toBe("todo to be deleted");
  expect(deleteTodoResponse.statusCode).toBe(200);

  expect(deleteTodoResponse.body).toHaveProperty(
    "message",
    "todo deleted successfully"
  );
  expect(deleteTodoResponse.body).toHaveProperty("deletedTodo");

  // confirm actually deleted from backend

  const getResponse = await request(app).get("/todos/all");
  expect(getResponse.body.alltodos.length).toBe(0);
});
