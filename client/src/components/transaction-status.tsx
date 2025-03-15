import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function TransactionStatus({ id }: { id: string }) {
  const [_, setLocation] = useLocation();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ["/api/transactions", id],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
        <div className="text-center">
          <p className="text-white text-lg font-medium">Processing Your Investment</p>
          <p className="text-zinc-400 text-sm mt-2">
            Please wait while we secure your Ethereum purchase through Coinbase
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: "text-green-500",
      message: "Investment Successful!",
      description: "Your Ethereum purchase has been completed successfully. The ETH will be delivered to your wallet shortly."
    },
    failed: {
      icon: XCircle,
      color: "text-red-500",
      message: "Transaction Failed",
      description: "We couldn't complete your purchase. Please try again or contact support if the issue persists."
    },
    pending: {
      icon: AlertCircle,
      color: "text-yellow-500",
      message: "Processing Investment",
      description: "Your purchase is being processed. This usually takes a few minutes."
    }
  };

  const status = statusConfig[transaction?.status || "pending"];
  const StatusIcon = status.icon;

  return (
    <CardContent className="flex flex-col items-center gap-6 p-6">
      <StatusIcon className={`h-16 w-16 ${status.color}`} />
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">{status.message}</h3>
        <p className="text-zinc-400">{status.description}</p>
      </div>

      <Alert className="bg-zinc-800 border-green-600/50">
        <AlertDescription className="text-zinc-400">
          Transaction ID: {id}
          <br />
          Please save this ID for your records.
        </AlertDescription>
      </Alert>

      <Button 
        onClick={() => setLocation("/")}
        variant="outline" 
        className="mt-4 border-green-600 text-green-500 hover:bg-green-900/20"
      >
        Make Another Investment
      </Button>
    </CardContent>
  );
}