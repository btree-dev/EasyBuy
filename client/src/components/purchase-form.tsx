import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertTransactionSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { initOnramp } from "@/lib/onramp";
import { TransactionStatus } from "./transaction-status";
import { apiRequest } from "@/lib/queryClient";

export function PurchaseForm() {
  const { toast } = useToast();
  const [transactionId, setTransactionId] = useState<string>();

  const form = useForm({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      amount: "",
      status: "pending",
      transactionId: null
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      try {
        await initOnramp(values.amount);
        const response = await apiRequest("POST", "/api/transactions", values);
        const data = await response.json();
        setTransactionId(data.id);
        return data;
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to process transaction"
        });
        throw error;
      }
    }
  });

  async function onSubmit(values: any) {
    mutation.mutate(values);
  }

  if (transactionId) {
    return <TransactionStatus id={transactionId} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Amount (ETH)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="0.0" 
                  {...field}
                  className="bg-zinc-800 border-green-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Processing..." : "Purchase ETH"}
        </Button>
      </form>
    </Form>
  );
}
