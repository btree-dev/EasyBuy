import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { insertTransactionSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { initOnramp } from "@/lib/onramp";
import { TransactionStatus } from "./transaction-status";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
          title: "Transaction Error",
          description: "We couldn't process your purchase. Please try again or contact support."
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

  const minAmount = 0.001;
  const maxAmount = 10;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Alert className="bg-zinc-800 border-green-600/50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-zinc-400">
            Current market conditions favor ETH purchases. Enter the amount you wish to invest.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Investment Amount (ETH)</FormLabel>
              <FormDescription className="text-zinc-400">
                Enter the amount of Ethereum you want to purchase (min: {minAmount} ETH, max: {maxAmount} ETH)
              </FormDescription>
              <FormControl>
                <Input 
                  placeholder="1.0" 
                  {...field}
                  className="bg-zinc-800 border-green-600 text-white placeholder:text-zinc-500"
                  type="number"
                  step="0.001"
                  min={minAmount}
                  max={maxAmount}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-6"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Processing Your Investment..." : "Confirm Purchase"}
        </Button>

        <p className="text-xs text-center text-zinc-500">
          By clicking "Confirm Purchase", you agree to Coinbase's terms and conditions.
          Your purchase will be processed securely through Coinbase's platform.
        </p>
      </form>
    </Form>
  );
}