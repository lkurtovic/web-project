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
        <CardHeader className="flex items-center justify-center -mt-14">
          <AvatarDemo22 />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Username */}
          <div className="space-y-1">
            <Label>Username</Label>
            <div className="flex items-center justify-between gap-4">
              <span className="truncate">{user.name}</span>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <div className="flex items-center justify-between gap-4">
              <span className="truncate">{user.email}</span>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
          {/* Password */}
          <div className="space-y-1">
            <Label>Password</Label>
            <div className="flex items-center justify-between gap-4">
              <span className="">***********</span>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
          <div className="flex gap-4">
            <LogoutButton></LogoutButton>
            <DeleteAccountButton></DeleteAccountButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
