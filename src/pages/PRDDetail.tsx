import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Flag, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRD, PRDStatus } from '@/types';
import { calculatePRDProgress } from '@/data/mockData';
import { usePRDs } from '@/context/PRDContext';
import SectionCard from '@/components/SectionCard';
import Layout from '@/components/Layout';

export default function PRDDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prds } = usePRDs();
  const [prd, setPRD] = useState<PRD | null>(null);

  useEffect(() => {
    // Find PRD from context (includes localStorage data)
    const foundPRD = prds.find((p) => p.id === id);
    if (foundPRD) {
      setPRD(foundPRD);
    }
  }, [id, prds]);

  const handleStatusChange = (newStatus: PRDStatus) => {
    if (prd) {
      setPRD({ ...prd, status: newStatus });
      // Update in context/API
    }
  };

  const handleSectionUpdate = (sectionId: string, updates: Partial<PRD['sections'][0]>) => {
    if (!prd) return;
    
    const updatedSections = prd.sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    
    const updatedPRD = {
      ...prd,
      sections: updatedSections,
      progress: calculatePRDProgress(updatedSections),
      updatedAt: new Date().toISOString(),
    };
    
    setPRD(updatedPRD);
  };

  if (!prd) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">PRD Not Found</h2>
            <Button onClick={() => navigate('/prds')}>Back to PRDs</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusColors: Record<PRDStatus, string> = {
    backlog: 'bg-gray-500',
    research: 'bg-blue-500',
    waiting: 'bg-yellow-500',
    review: 'bg-purple-500',
    complete: 'bg-green-500',
  };

  const priorityColors = {
    P0: 'bg-red-500 text-white',
    P1: 'bg-orange-500 text-white',
    P2: 'bg-blue-500 text-white',
  };

  const completedSections = prd.sections.filter((s) => s.status === 'complete').length;
  const totalSections = prd.sections.length;

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/prds')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to PRDs
          </Button>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{prd.title}</h1>
                <p className="text-gray-600">{prd.description}</p>
              </div>
              <Badge className={priorityColors[prd.priority]}>
                {prd.priority}
              </Badge>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="font-medium">{prd.owner}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Target Date</p>
                  <p className="font-medium">
                    {new Date(prd.targetDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="font-medium">{prd.daysInProgress} days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Sections</p>
                  <p className="font-medium">
                    {completedSections}/{totalSections}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress and Status */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{prd.progress}%</span>
                </div>
                <Progress value={prd.progress} className="h-2" />
              </div>
              <Select value={prd.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* PRD Sections */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">PRD Sections</h2>
          {prd.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                prdTitle={prd.title}
                onUpdate={handleSectionUpdate}
                onUpdateOrchestrator={(sectionId, orchestrator) => {
                  console.log('Orchestrator update for section:', sectionId, orchestrator);
                  // TODO: Store orchestrator data in PRD context
                }}
              />
            ))}
        </div>
      </div>
    </Layout>
  );
}
