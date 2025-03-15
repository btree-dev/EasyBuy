import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export function TransactionStatus({ id }: { id: string }) {
  const [_, setLocation] = useLocation();
  
  const { data: transaction, isLoading } = useQuery({
    queryKey: ["/api/transactions", id],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
        <p className="text-white">Processing your transaction...</p>
      </div>
    );
  }

  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: "text-green-500",
      message: "Transaction completed successfully!"
    },
    failed: {
      icon: XCircle,
      color: "text-red-500",
      message: "Transaction failed. Please try again."
    },
    pending: {
      icon: Loader2,
      color: "text-yellow-500",
      message: "Transaction is pending..."
    }
  };

  const status = statusConfig[transaction?.status || "pending"];
  const StatusIcon = status.icon;

  return (
    <CardContent className="flex flex-col items-center gap-4 p-4">
      <StatusIcon className={`h-12 w-12 ${status.color}`} />
      <p className="text-lg text-white text-center">{status.message}</p>
      
      <Button 
        onClick={() => setLocation("/")}
        variant="outline" 
        className="mt-4 border-green-600 text-green-500 hover:bg-green-900/20"
      >
        Make Another Purchase
      </Button>
    </CardContent>
  );
}
