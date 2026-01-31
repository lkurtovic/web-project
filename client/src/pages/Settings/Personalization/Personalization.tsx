// pages/settings/SettingsHome.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AvatarDemo22 } from '@/mine/AvatarDemo2';
import { LogoutButton } from '@/pages/Settings/SettingsComponents/LogOutButton';
import { DeleteAccountButton } from '../SettingsComponents/DeleteAccount';

const user = {
  name: 'johndoe',
  email: 'john@example.com',
};

export default function General() {
  return (
    <div className="flex flex-1 items-center justify-center bg-muted p-6 rounded-lg">
      <Card className="w-full max-w-md mt-8">
        <CardContent className="space-y-6"></CardContent>
      </Card>
    </div>
  );
}
