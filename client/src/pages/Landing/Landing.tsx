import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export function Landing() {
  return (
    <div>
      <div className="flex justify-between gap-3">
        <div>
          <Link to="#">
            <p className="font-extrabold">T-buddy</p>
          </Link>
        </div>
        <div className="flex justify-end gap-3">
          <div className="flex justify-end gap-3">
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center my-55">
        <h1 className="text-7xl font-bold mb-4">Welcome to T-buddy</h1>
        <p className="text-lg mb-6">
          Your personal tool for managing tasks efficiently
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="#learn-more">Learn More</Link>
          </Button>
        </div>
      </div>

      <div>
        <img src="" alt="" />
      </div>
    </div>
  );
}
