import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { getAuth, deleteUser, signOut } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      // Pokušaj brisanja korisnika
      await deleteUser(user);

      // Ako je uspješno, odmah odjavi korisnika
      await signOut(auth);

      alert('Your account has been deleted.');
      navigate('/login'); // redirect na login
    } catch (error: any) {
      console.error('Error deleting user:', error);

      // Ako je potrebna recentna autentikacija
      if (error.code === 'auth/requires-recent-login') {
        alert(
          'You need to log in again before deleting your account. Please log out and log in again.',
        );
      } else {
        alert('Failed to delete account. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          <Trash />
          Delete Account
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent. Are you sure you want to delete your
            account?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
