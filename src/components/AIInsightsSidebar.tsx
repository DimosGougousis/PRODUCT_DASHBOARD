import { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, X, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Recommendation, Alert as AlertType } from '@/types';

interface AIInsightsSidebarProps {
  prdId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIInsightsSidebar({ prdId, isOpen, onClose }: AIInsightsSidebarProps) {
  const [recommendations] = useState<Recommendation[]>(generateMockRecommendations(prdId));
  const [alerts] = useState<AlertType[]>(generateMockAlerts(prdId));

  const handleApplyRecommendation = (recId: string) => {
    console.log('Applying recommendation:', recId);
    // In real app, would update PRD state
  };

  const handleDismissRecommendation = (recId: string) => {
    console.log('Dismissing recommendation:', recId);
  };

  if (!isOpen) return null;

  const activeRecommendations = recommendations.filter(r => !r.applied && !r.dismissed);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.read);

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l shadow-xl z-40 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">AI Insights</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          {activeRecommendations.length} recommendations • {criticalAlerts.length} critical alerts
        </p>
      </div>

      {/* Content */}
      <Tabs defaultValue="recommendations" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="recommendations" className="flex-1">
            Recommendations
            {activeRecommendations.length > 0 && (
              <Badge className="ml-2">{activeRecommendations.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">
            Insights
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            History
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="recommendations" className="p-4 space-y-3 mt-0">
            {activeRecommendations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                <p>No active recommendations</p>
              </div>
            ) : (
              activeRecommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onApply={() => handleApplyRecommendation(rec.id)}
                  onDismiss={() => handleDismissRecommendation(rec.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="insights" className="p-4 space-y-3 mt-0">
            <InsightsPanel prdId={prdId} />
          </TabsContent>

          <TabsContent value="history" className="p-4 space-y-3 mt-0">
            <HistoryPanel recommendations={recommendations} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function RecommendationCard({
  recommendation,
  onApply,
  onDismiss,
}: {
  recommendation: Recommendation;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const typeIcons = {
    bottleneck: AlertTriangle,
    parallel_work: TrendingUp,
    pattern_match: Lightbulb,
    risk: AlertTriangle,
    optimization: TrendingUp,
  };

  const typeColors = {
    bottleneck: 'text-red-500 bg-red-50',
    parallel_work: 'text-green-500 bg-green-50',
    pattern_match: 'text-yellow-500 bg-yellow-50',
    risk: 'text-orange-500 bg-orange-50',
    optimization: 'text-blue-500 bg-blue-50',
  };

  const Icon = typeIcons[recommendation.type];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${typeColors[recommendation.type]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold mb-1">
              {recommendation.title}
            </CardTitle>
            <CardDescription className="text-xs">
              {recommendation.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Impact */}
        <div className="text-xs">
          <span className="font-medium text-gray-700">Impact:</span>
          <span className="text-gray-600 ml-1">{recommendation.impact}</span>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-gray-700">Confidence</span>
            <span className="text-gray-600">{Math.round(recommendation.confidence * 100)}%</span>
          </div>
          <Progress value={recommendation.confidence * 100} className="h-1.5" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={onApply} className="flex-1">
            <ThumbsUp className="w-3 h-3 mr-1" />
            Apply
          </Button>
          <Button size="sm" variant="outline" onClick={onDismiss} className="flex-1">
            <ThumbsDown className="w-3 h-3 mr-1" />
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsPanel({ prdId }: { prdId: string }) {
  const insights = [
    {
      title: 'Progress vs Timeline',
      value: '62%',
      target: '70%',
      status: 'behind',
      description: 'You\'re 8% behind schedule. Consider descoping or adding resources.',
    },
    {
      title: 'Bottleneck Detection',
      value: 'Security Team',
      description: '2 sections waiting on Security review for 4+ days. Consider escalation.',
      action: 'View Dependencies',
    },
    {
      title: 'Risk Alert',
      value: 'Medium',
      description: 'Timeline mismatch: Engineering estimates 6 weeks, Marketing needs 4 weeks.',
      action: 'Run Scenario',
    },
    {
      title: 'Pattern Match',
      value: '87% similar',
      description: 'This PRD is similar to "Payment Method Redesign" from Q3 2024.',
      action: 'View Pattern',
    },
  ];

  return (
    <div className="space-y-3">
      {insights.map((insight, idx) => (
        <Card key={idx} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{insight.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">{insight.value}</span>
              {insight.target && (
                <span className="text-sm text-gray-500">Target: {insight.target}</span>
              )}
            </div>
            <p className="text-xs text-gray-600">{insight.description}</p>
            {insight.action && (
              <Button size="sm" variant="outline" className="w-full mt-2">
                {insight.action}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HistoryPanel({ recommendations }: { recommendations: Recommendation[] }) {
  const appliedRecs = recommendations.filter(r => r.applied);
  const dismissedRecs = recommendations.filter(r => r.dismissed);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-sm mb-2 text-green-700">
          Applied ({appliedRecs.length})
        </h3>
        {appliedRecs.length === 0 ? (
          <p className="text-sm text-gray-400">No recommendations applied yet</p>
        ) : (
          <div className="space-y-2">
            {appliedRecs.map((rec) => (
              <div key={rec.id} className="text-xs p-2 bg-green-50 rounded border border-green-200">
                <p className="font-medium">{rec.title}</p>
                <p className="text-gray-600">{new Date(rec.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium text-sm mb-2 text-gray-700">
          Dismissed ({dismissedRecs.length})
        </h3>
        {dismissedRecs.length === 0 ? (
          <p className="text-sm text-gray-400">No recommendations dismissed</p>
        ) : (
          <div className="space-y-2">
            {dismissedRecs.map((rec) => (
              <div key={rec.id} className="text-xs p-2 bg-gray-50 rounded border">
                <p className="font-medium">{rec.title}</p>
                <p className="text-gray-600">{new Date(rec.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data generators
function generateMockRecommendations(prdId: string): Recommendation[] {
  return [
    {
      id: 'rec-1',
      type: 'bottleneck',
      title: 'Security review is a bottleneck',
      description: 'Security team has 8 pending reviews. Consider parallel track with assumptions.',
      impact: 'Could save 2-3 days on critical path',
      confidence: 0.87,
      createdAt: new Date().toISOString(),
      applied: false,
      dismissed: false,
    },
    {
      id: 'rec-2',
      type: 'parallel_work',
      title: 'UX and Engineering can work in parallel',
      description: 'Mobile decision is made. These teams can now start simultaneously.',
      impact: 'Accelerate timeline by 1 week',
      confidence: 0.92,
      createdAt: new Date().toISOString(),
      applied: false,
      dismissed: false,
    },
    {
      id: 'rec-3',
      type: 'pattern_match',
      title: 'Similar to Payment Method Redesign',
      description: 'This PRD matches 87% with a past successful project. Reuse approach?',
      impact: 'Reduce planning time by 40%',
      confidence: 0.78,
      createdAt: new Date().toISOString(),
      applied: false,
      dismissed: false,
    },
  ];
}

function generateMockAlerts(prdId: string): AlertType[] {
  return [
    {
      id: 'alert-1',
      severity: 'critical',
      title: 'Deadline at risk',
      description: 'Current progress suggests missing target date by 5 days',
      prdId,
      createdAt: new Date().toISOString(),
      read: false,
    },
  ];
}
