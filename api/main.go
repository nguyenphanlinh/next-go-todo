package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Todo struct {
	ID    int    `json:"id"`
	Todo string `json:"todo"`
	Done  bool   `json:"done"`
}

func main() {

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	todos := []Todo{}

	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}
		if err := c.BodyParser(todo); err != nil {
			return err
		}
		todo.ID = len(todos) + 1
		todos = append(todos, *todo)
		return c.JSON(todos)
	})
	app.Delete("/api/todos/:id", func(c *fiber.Ctx) error {	
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("Invalid id")
		}
		index := -1
		for i := 0; i < len(todos); i++ {
			if todos[i].ID == id {
				index = i
			}
		}
		if index == -1 {
			return c.Status(401).SendString("Invalid id")
		}
		todos = append(todos[:index], todos[index+1:]...)	
		return c.JSON(todos)	
	})
	app.Put("/api/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("Invalid id")
		}
		for i, t := range todos {
			if t.ID == id {
				todos[i].Done = true
				break
			}
		}
		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":4000"))
}
