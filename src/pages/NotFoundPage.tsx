import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-8">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-6 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button as={Link} to="/" variant="primary" size="lg">
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;