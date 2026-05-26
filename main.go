package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type Todo struct {
	ID        primitive.ObjectID    `json:"_id,omitempty" bson:"_id,omitempty"`
	Completed bool   				`json:"completed"`
	Body      string 				`json:"body"`
}

var collection *mongo.Collection

func main() {
	fmt.Println(("Hello World"))

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file", err)
	}

	MONGODB_URL := os.Getenv("MONGODB_URL")

	clientOptions := options.Client().ApplyURI(MONGODB_URL)

	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil{
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)

	if err != nil{
		log.Fatal(err)
	}

	fmt.Println("Connected to MONGODB ATLAS")

	collection = client.Database("golang_todo_db").Collection("todos")

	app := fiber.New()

	frontEndUrl := os.Getenv("FRONTEND_URL")

	if frontEndUrl == ""{
		frontEndUrl = "http://localhost:5173"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins: frontEndUrl,
		AllowHeaders: "Origin,Content-Type",
	}))

	app.Get("/api/todos", getAllTodos)
	app.Post("/api/todos", createTodo)
	app.Patch("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)

	port := os.Getenv("PORT")

	if port == ""{
		port = "5000"
	}

	log.Fatal(app.Listen("0.0.0.0:"+port))
}

func getAllTodos(c* fiber.Ctx)error{
	var todos []Todo

	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil{
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()){
		var todo Todo

		if err := cursor.Decode(&todo); err !=nil{
			return err
		}

		todos = append(todos, todo)
	}

	return c.Status(200).JSON(todos)
}

func createTodo(c* fiber.Ctx)error{
	todo := new(Todo)

	if err :=c.BodyParser(todo); err != nil{
		return err
	}

	if todo.Body == ""{
		return c.Status(400).JSON(fiber.Map{"error": "Todo body cannot be empty"})
	}

	insertResult, err :=collection.InsertOne(context.Background(), todo)

	if err != nil{
		return err
	}

	todo.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(todo)
}

func updateTodo(c* fiber.Ctx)error{
	id := c.Params("id")

	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil{
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id": objectID}

	update := bson.M{"$set":bson.M{"completed": true}}

	_, err = collection.UpdateOne(context.Background(), filter, update)

	if err != nil{
		return err
	}

	return c.Status(201).JSON(fiber.Map{"success": true})
}

func deleteTodo(c* fiber.Ctx)error{
	id := c.Params("id")

	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil{
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id": objectID}

	_, err = collection.DeleteOne(context.Background(), filter)

	if err != nil{
		return err
	}

	return c.Status(201).JSON(fiber.Map{"success": true})
}