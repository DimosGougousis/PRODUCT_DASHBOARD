import { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OnboardingTourProps {
  onComplete: () => void;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PRD Partner! 👋',
    description:
      'Your AI-powered product management assistant. Let\'s take a quick tour to get you started.',
    target: '',
    position: 'bottom',
  },
  {
    id: 'create-prd',
    title: 'Create Your First PRD',
    description:
      'Start here to create a new PRD. Choose from templates or start from scratch. The AI will help structure your document.',
    target: '[data-tour="create-prd"]',
    position: 'bottom',
    action: 'Click "New PRD" to get started',
  },
  {
    id: 'prd-sections',
    title: 'PRD Sections',
    description:
      'Each PRD is broken into 8 standard sections. Expand them to add content with our rich text editor.',
    target: '[data-tour="prd-sections"]',
    position: 'right',
  },
  {
    id: 'stakeholders',
    title: 'Manage Stakeholders',
    description:
      'The AI automatically identifies which stakeholders need to contribute to each section based on expertise and past work.',
    target: '[data-tour="stakeholders"]',
    position: 'bottom',
  },
  {
    id: 'raci',
    title: 'AI-Powered RACI Generator',
    description:
      'Get smart stakeholder assignments with confidence scores. The AI learns from your corrections.',
    target: '[data-tour="raci-generator"]',
    position: 'left',
  },
  {
    id: 'kanban',
    title: 'Track Progress on Kanban',
    description:
      'Drag sections across your workflow. See bottlenecks and track completion in real-time.',
    target: '[data-tour="kanban"]',
    position: 'bottom',
  },
  {
    id: 'insights',
    title: 'AI Insights & Recommendations',
    description:
      'Get proactive recommendations, conflict detection, and scenario analysis to move faster.',
    target: '[data-tour="insights"]',
    position: 'bottom',
  },
];

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        const newPosition = calculatePosition(rect, step.position);
        setPosition(newPosition);
        
        // Highlight the element
        element.classList.add('tour-highlight');
        return () => {
          element.classList.remove('tour-highlight');
        };
      }
    }
  }, [currentStep, step.target, step.position]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
    // Store in localStorage that tour is complete
    localStorage.setItem('onboarding-complete', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleSkip} />

      {/* Tour Card */}
      <Card
        className="fixed z-50 w-96 shadow-2xl"
        style={
          step.target
            ? { top: position.top, left: position.left }
            : {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }
        }
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Hint */}
          {step.action && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 <span className="font-medium">{step.action}</span>
              </p>
            </div>
          )}

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>
                Step {currentStep + 1} of {tourSteps.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSkip}>
                Skip Tour
              </Button>
              <Button size="sm" onClick={handleNext}>
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Pointer Arrow */}
      {step.target && (
        <div
          className="fixed w-4 h-4 bg-white transform rotate-45 z-40"
          style={{
            top: position.top - 8,
            left: position.left + 192 - 8,
          }}
        />
      )}

      {/* Global styles for highlighted elements */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 51 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}

function calculatePosition(
  rect: DOMRect,
  position: 'top' | 'bottom' | 'left' | 'right'
): { top: number; left: number } {
  const cardWidth = 384; // 24rem
  const cardHeight = 300; // approximate
  const offset = 20;

  switch (position) {
    case 'top':
      return {
        top: rect.top - cardHeight - offset,
        left: rect.left + rect.width / 2 - cardWidth / 2,
      };
    case 'bottom':
      return {
        top: rect.bottom + offset,
        left: rect.left + rect.width / 2 - cardWidth / 2,
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2 - cardHeight / 2,
        left: rect.left - cardWidth - offset,
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2 - cardHeight / 2,
        left: rect.right + offset,
      };
  }
}

// Hook to check if onboarding is complete
// eslint-disable-next-line react-refresh/only-export-components
export function useOnboardingStatus() {
  const [isComplete, setIsComplete] = useState(
    localStorage.getItem('onboarding-complete') === 'true'
  );

  const markComplete = () => {
    localStorage.setItem('onboarding-complete', 'true');
    setIsComplete(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding-complete');
    setIsComplete(false);
  };

  return { isComplete, markComplete, resetOnboarding };
}
