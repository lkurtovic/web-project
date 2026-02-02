import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AvatarDemo22 } from '@/mine/AvatarDemo2';
import { LogoutButton } from '@/pages/Settings/SettingsComponents/LogOutButton';
import { DeleteAccountButton } from '../SettingsComponents/DeleteAccount';

import { auth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function General() {
  const user = auth.currentUser;
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Error</p>;

  const handleChangePassword = async () => {
    setMessage('');
    setError('');
    setLoading(true);

    try {
      if (!user.email)
        throw new Error('No email associated with this account.');

      await sendPasswordResetEmail(auth, user.email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <span className="truncate">{user.displayName}</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <div className="flex items-center justify-between gap-4">
              <span className="truncate">{user.email}</span>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label>Password</Label>
            <div className="flex items-center justify-between gap-4">
              <span className="">***********</span>
              <Button
                variant="outline"
                className="cursor-pointer"
                size="sm"
                onClick={handleChangePassword}
                disabled={loading}
              >
                Change
              </Button>
            </div>
            {message && <p className="text-sm text-green-500">{message}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex gap-4">
            <LogoutButton />
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
