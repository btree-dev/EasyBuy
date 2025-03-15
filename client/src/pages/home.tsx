import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseForm } from "@/components/purchase-form";
import { SiEthereum } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-4">
      <Card className="w-full max-w-lg bg-zinc-900 border-green-600">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <SiEthereum className="h-8 w-8 text-green-500" />
            <CardTitle className="text-2xl font-bold text-white">
              Purchase Ethereum
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-5 w-5 text-zinc-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  Ethereum is a leading digital asset, widely recognized in the investment community
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-zinc-400">
              Securely purchase Ethereum (ETH) through Coinbase, a trusted digital asset platform.
            </p>
            <ul className="text-zinc-400 list-disc list-inside space-y-1">
              <li>Instant purchase with your preferred payment method</li>
              <li>Secure transaction backed by Coinbase's infrastructure</li>
              <li>Direct delivery to your digital wallet</li>
            </ul>
          </div>
        </CardHeader>
        <CardContent>
          <PurchaseForm />
        </CardContent>
      </Card>
    </div>
  );
}