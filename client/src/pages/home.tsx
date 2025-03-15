import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseForm } from "@/components/purchase-form";
import { SiEthereum } from "react-icons/si";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-green-600">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <SiEthereum className="h-8 w-8 text-green-500" />
            <CardTitle className="text-2xl font-bold text-white">
              Purchase ETH
            </CardTitle>
          </div>
          <p className="text-sm text-zinc-400">
            Buy Ethereum securely using Coinbase
          </p>
        </CardHeader>
        <CardContent>
          <PurchaseForm />
        </CardContent>
      </Card>
    </div>
  );
}
