import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import Button from '../components/common/Button';
import { useMarketStore } from '../stores/marketStore';
import { useWalletContext } from '../contexts/WalletContext';

const CreateMarketPage = () => {
  const navigate = useNavigate();
  const { createMarket } = useMarketStore();
  const { isConnected } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    closingDate: '',
    resolutionDeadline: '',
    initialLiquidity: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formState.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    
    if (!formState.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formState.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (!formState.closingDate) {
      newErrors.closingDate = 'Closing date is required';
    } else if (new Date(formState.closingDate) <= new Date()) {
      newErrors.closingDate = 'Closing date must be in the future';
    }
    
    if (!formState.resolutionDeadline) {
      newErrors.resolutionDeadline = 'Resolution deadline is required';
    } else if (new Date(formState.resolutionDeadline) <= new Date(formState.closingDate)) {
      newErrors.resolutionDeadline = 'Resolution deadline must be after closing date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const newMarket = await createMarket({
        title: formState.title,
        description: formState.description,
        closingDate: new Date(formState.closingDate),
        resolutionDeadline: new Date(formState.resolutionDeadline),
        initialLiquidity: formState.initialLiquidity || 0,
      });
      
      navigate(`/market/${newMarket.id}`);
    } catch (error) {
      console.error('Failed to create market:', error);
      setErrors({ submit: 'Failed to create market. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
          <h1 className="mb-4 text-2xl font-bold">Connect Your Wallet</h1>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            You need to connect your wallet to create a prediction market.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Create Prediction Market</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Define a question with a binary (Yes/No) outcome and set the parameters for your prediction
          market.
        </p>
      </div>

      <div className="card">
        <div className="border-b border-slate-200 p-4 dark:border-slate-700">
          <h2 className="text-lg font-medium">Market Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Question / Title
            </label>
            <input
              id="title"
              name="title"
              value={formState.title}
              onChange={handleChange}
              className={`input w-full ${errors.title ? 'border-error-500' : ''}`}
              placeholder="E.g., Will BTC reach $100k in 2025?"
            />
            {errors.title && <p className="mt-1 text-xs text-error-500">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              rows={4}
              className={`input w-full ${errors.description ? 'border-error-500' : ''}`}
              placeholder="Provide details on how this market will be resolved, including sources and criteria..."
            />
            {errors.description && <p className="mt-1 text-xs text-error-500">{errors.description}</p>}
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="closingDate" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Closing Date
              </label>
              <input
                id="closingDate"
                name="closingDate"
                type="datetime-local"
                value={formState.closingDate}
                onChange={handleChange}
                className={`input w-full ${errors.closingDate ? 'border-error-500' : ''}`}
              />
              {errors.closingDate && <p className="mt-1 text-xs text-error-500">{errors.closingDate}</p>}
              <p className="mt-1 text-xs text-slate-500">When betting will close</p>
            </div>

            <div>
              <label htmlFor="resolutionDeadline" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Resolution Deadline
              </label>
              <input
                id="resolutionDeadline"
                name="resolutionDeadline"
                type="datetime-local"
                value={formState.resolutionDeadline}
                onChange={handleChange}
                className={`input w-full ${errors.resolutionDeadline ? 'border-error-500' : ''}`}
              />
              {errors.resolutionDeadline && (
                <p className="mt-1 text-xs text-error-500">{errors.resolutionDeadline}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">When you must resolve the market by</p>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="initialLiquidity" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Initial Liquidity (USDC) - Optional
            </label>
            <input
              id="initialLiquidity"
              name="initialLiquidity"
              type="number"
              min="0"
              step="1"
              value={formState.initialLiquidity}
              onChange={handleChange}
              className="input w-full"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-slate-500">
              Initial liquidity will be split equally between Yes/No pools
            </p>
          </div>

          <div className="mb-6 rounded-md bg-primary-50 p-4 dark:bg-primary-900/20">
            <div className="flex">
              <Info size={18} className="mr-2 flex-shrink-0 text-primary-600 dark:text-primary-400" />
              <div>
                <h3 className="font-medium text-primary-800 dark:text-primary-300">Important Information</h3>
                <p className="mt-1 text-sm text-primary-700 dark:text-primary-400">
                  Creating a market requires a small fee in SOL to prevent spam. You are responsible for
                  resolving the market by the resolution deadline.
                </p>
              </div>
            </div>
          </div>

          {errors.submit && <p className="mb-4 text-sm text-error-500">{errors.submit}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            leftIcon={<Check size={16} />}
          >
            Create Market
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateMarketPage;