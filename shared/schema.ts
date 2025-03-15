import { pgTable, text, serial, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  status: text("status", { enum: ["pending", "completed", "failed"] }).notNull(),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertTransactionSchema = createInsertSchema(transactions)
  .pick({
    amount: true,
    status: true,
    transactionId: true
  })
  .extend({
    amount: z.string().refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be a positive number")
  });

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
