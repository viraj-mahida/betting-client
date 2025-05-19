import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import Button from '../components/common/Button';
import { useMarketStore } from '../stores/marketStore';
import { useAnchorProvider, useWalletContext } from '../contexts/WalletContext';

const CreateMarketPage = () => {
  const navigate = useNavigate();
  const { createMarket } = useMarketStore();
  const { isConnected } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const provider = useAnchorProvider();
  
  const [formState, setFormState] = useState({
    question: '',
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
    
    if (!formState.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formState.question.length < 10) {
      newErrors.question = 'Question must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await createMarket(provider, {
        question: formState.question,
      });
      
      // The navigate call now redirects to the markets list since we don't have an ID returned
      navigate('/explore');
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
          Define a question with a binary (Yes/No) outcome for your prediction market.
        </p>
      </div>

      <div className="card">
        <div className="border-b border-slate-200 p-4 dark:border-slate-700">
          <h2 className="text-lg font-medium">Market Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="question" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Question
            </label>
            <input
              id="question"
              name="question"
              value={formState.question}
              onChange={handleChange}
              className={`input w-full ${errors.question ? 'border-error-500' : ''}`}
              placeholder="E.g., Will BTC reach $100k in 2025?"
            />
            {errors.question && <p className="mt-1 text-xs text-error-500">{errors.question}</p>}
            <p className="mt-1 text-xs text-slate-500">
              Provide a clear, binary (Yes/No) question for your market
            </p>
          </div>

          <div className="mb-6 rounded-md bg-primary-50 p-4 dark:bg-primary-900/20">
            <div className="flex">
              <Info size={18} className="mr-2 flex-shrink-0 text-primary-600 dark:text-primary-400" />
              <div>
                <h3 className="font-medium text-primary-800 dark:text-primary-300">Important Information</h3>
                <p className="mt-1 text-sm text-primary-700 dark:text-primary-400">
                  Creating a market requires a small fee in SOL to prevent spam. You are responsible for
                  resolving the market after bets are placed.
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