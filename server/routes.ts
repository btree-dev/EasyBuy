import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/transactions", async (req, res) => {
    try {
      const data = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(data);
      res.json(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(parseInt(req.params.id));
      if (!transaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
