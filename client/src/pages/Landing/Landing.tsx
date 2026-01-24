import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import laptop from '@/images/laptop.png';
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
      <div className="text-center my-60">
        <h1 className="text-7xl font-bold mb-4">Welcome to T-buddy</h1>
        <p className="text-lg mb-6">
          Your personal tool for managing tasks efficiently
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer transition"
            onClick={() => {
              document
                .getElementById('slika')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn More
          </Button>
        </div>
      </div>

      <div
        id="slika"
        className="flex flex-col items-center justify-center text-center"
      >
        <h1 className="text-5xl font-medium mb-4">
          All travel information you need
        </h1>
        <img src={laptop} alt="Laptop preview" width={500} height={500} />
      </div>
    </div>
  );
}
