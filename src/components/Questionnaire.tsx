
import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import { UserPreferences } from '../hooks/usePreferences';

interface QuestionnaireProps {
  updatePreferences: (
    key: keyof Omit<UserPreferences, 'completedQuestionnaire'>,
    value: any
  ) => void;
  completeQuestionnaire: () => void;
  onBack: () => void;
  onComplete: () => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  updatePreferences,
  completeQuestionnaire,
  onBack,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');
  const [selectedPricing, setSelectedPricing] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  const totalSteps = 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Save all preferences
      updatePreferences('interests', selectedInterests);
      updatePreferences('frequency', selectedFrequency);
      updatePreferences('pricingPreference', selectedPricing);
      completeQuestionnaire();
      onComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onBack();
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedInterests.length > 0;
      case 1:
        return !!selectedFrequency;
      case 2:
        return !!selectedPricing;
      default:
        return false;
    }
  };

  const interestOptions = [
    { value: 'chatbots', label: 'Chatbots', icon: '💬' },
    { value: 'code', label: 'Code Generation', icon: '👨‍💻' },
    { value: 'design', label: 'AI Design Tools', icon: '🎨' },
    { value: 'video', label: 'AI Video Tools', icon: '🎬' },
    { value: 'automation', label: 'Automation', icon: '⚙️' },
    { value: 'writing', label: 'Content Writing', icon: '✍️' },
    { value: 'audio', label: 'Audio & Music', icon: '🎵' },
    { value: 'research', label: 'Research & Analysis', icon: '🔍' },
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'rarely', label: 'Rarely' },
  ];

  const pricingOptions = [
    { value: 'free', label: 'Free Tools Only' },
    { value: 'premium', label: 'Premium Tools' },
    { value: 'both', label: 'Both Free & Premium' },
  ];

  return (
    <div className="min-h-screen bg-one-dark flex items-center justify-center p-4">
      <div className="glass-card rounded-xl w-full max-w-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-one-border w-full">
          <div
            className="h-full bg-one-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-1">Personalize Your Experience</h2>
          <p className="text-one-text-muted mb-8">
            Let's customize your AI dashboard based on your preferences
          </p>

          {/* Step Content */}
          <div
            className={`transition-opacity duration-300 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {currentStep === 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  What type of AI tools are you interested in?
                </h3>
                <p className="text-one-text-muted mb-6">
                  Select all that apply. You can change these later.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {interestOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleInterest(option.value)}
                      className={`relative p-4 rounded-lg transition-all duration-200 flex flex-col items-center text-center h-28 hover:shadow-md ${
                        selectedInterests.includes(option.value)
                          ? 'neon-border bg-one-accent/10 text-white'
                          : 'border border-one-border bg-one-light text-one-text-muted'
                      }`}
                    >
                      {selectedInterests.includes(option.value) && (
                        <div className="absolute top-2 right-2">
                          <Check size={16} className="text-one-accent" />
                        </div>
                      )}
                      <span className="text-2xl mb-2">{option.icon}</span>
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  How frequently do you use AI tools?
                </h3>
                <p className="text-one-text-muted mb-6">
                  This helps us recommend the right tools for your usage pattern.
                </p>

                <div className="space-y-3 mb-8">
                  {frequencyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFrequency(option.value)}
                      className={`w-full p-4 rounded-lg transition-all duration-200 flex items-center justify-between ${
                        selectedFrequency === option.value
                          ? 'neon-border bg-one-accent/10 text-white'
                          : 'border border-one-border bg-one-light text-one-text-muted'
                      }`}
                    >
                      <span>{option.label}</span>
                      {selectedFrequency === option.value && (
                        <Check size={18} className="text-one-accent" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Are you looking for free or premium AI tools?
                </h3>
                <p className="text-one-text-muted mb-6">
                  We'll prioritize tools that match your preference.
                </p>

                <div className="space-y-3 mb-8">
                  {pricingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedPricing(option.value)}
                      className={`w-full p-4 rounded-lg transition-all duration-200 flex items-center justify-between ${
                        selectedPricing === option.value
                          ? 'neon-border bg-one-accent/10 text-white'
                          : 'border border-one-border bg-one-light text-one-text-muted'
                      }`}
                    >
                      <span>{option.label}</span>
                      {selectedPricing === option.value && (
                        <Check size={18} className="text-one-accent" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevStep}
              className="flex items-center px-4 py-2 rounded-lg text-one-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back
            </button>

            <button
              onClick={handleNextStep}
              disabled={!canProceed()}
              className={`interactive-button flex items-center ${
                !canProceed()
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
