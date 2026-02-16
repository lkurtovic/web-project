// pages/settings/SettingsHome.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SquareCheck } from 'lucide-react';

export default function Subscription() {
  const benefits = [
    'Unlimited requests',
    'Priority support',
    'Access to beta features',
  ];
  return (
    <div className="flex flex-1 items-center justify-center bg-muted p-6 rounded-lg">
      <Card className="w-full max-w-sm mt-8">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="text-4xl mb-5">Pro</CardTitle>
          <CardTitle className="text-5xl font-normal">2€</CardTitle>
          <sub>per month</sub>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 mt-5">
          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <SquareCheck className="w-5 h-5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <div className="text-muted-foreground mt-4 text-sm">
            Next payment: 12/04/2024
          </div>
          <Button className="mt-5" variant="destructive">
            Cancel subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
