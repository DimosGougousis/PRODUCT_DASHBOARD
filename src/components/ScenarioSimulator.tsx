import { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, DollarSign, Users, Calendar, type LucideIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ScenarioSimulatorProps {
  prdTitle: string;
  open: boolean;
  onClose: () => void;
}

interface SimulationResult {
  scenario: string;
  impacts: Array<{
    area: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    icon: LucideIcon;
  }>;
  alternatives: Array<{
    id: string;
    title: string;
    pros: string[];
    cons: string[];
    effort: string;
    timeline: string;
  }>;
  recommendations: string[];
  stakeholdersToInvolve: string[];
}

export default function ScenarioSimulator({
  prdTitle,
  open,
  onClose,
}: ScenarioSimulatorProps) {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResult = generateMockSimulation(scenario);
    setResult(mockResult);
    setIsSimulating(false);
  };

  const commonScenarios = [
    'Engineering says 6 weeks minimum timeline',
    'Design team is unavailable for 2 weeks',
    'Budget reduced by 30%',
    'Need to launch 2 weeks earlier',
    'Key stakeholder leaves the company',
  ];

  const severityColors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-red-600 bg-red-50',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Scenario Simulator
          </DialogTitle>
          <DialogDescription>
            Run what-if analysis to explore alternatives and assess impact
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Input Section */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="scenario">What-If Scenario</Label>
              <Textarea
                id="scenario"
                placeholder="Example: What if Engineering says 6 weeks is the minimum timeline?"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Quick Scenarios */}
            <div>
              <Label className="text-xs text-gray-600">Quick scenarios:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {commonScenarios.map((cs) => (
                  <Button
                    key={cs}
                    variant="outline"
                    size="sm"
                    onClick={() => setScenario(cs)}
                  >
                    {cs}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSimulate}
              disabled={!scenario || isSimulating}
              className="w-full"
            >
              {isSimulating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {result && (
            <Tabs defaultValue="impacts" className="mt-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="impacts">Impact Analysis</TabsTrigger>
                <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="impacts" className="space-y-3 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-2">Scenario</h3>
                  <p className="text-sm text-gray-700">{result.scenario}</p>
                </div>

                {result.impacts.map((impact, idx) => {
                  const Icon = impact.icon;
                  return (
                    <Card key={idx} className={`border-l-4 ${severityColors[impact.severity]}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 mt-0.5" />
                          <div className="flex-1">
                            <CardTitle className="text-sm font-semibold mb-1">
                              {impact.area}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`text-xs ${severityColors[impact.severity]}`}
                            >
                              {impact.severity} impact
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-700">{impact.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="alternatives" className="space-y-3 mt-4">
                {result.alternatives.map((alt, idx) => (
                  <Card key={alt.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Path {String.fromCharCode(65 + idx)}: {alt.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-green-700 mb-2">Pros:</p>
                          <ul className="space-y-1">
                            {alt.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-600">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-red-700 mb-2">Cons:</p>
                          <ul className="space-y-1">
                            {alt.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-600">
                                <span className="text-red-500 mt-0.5">✗</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-3 border-t text-sm">
                        <div>
                          <span className="text-gray-600">Effort:</span>
                          <span className="font-medium ml-2">{alt.effort}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Timeline:</span>
                          <span className="font-medium ml-2">{alt.timeline}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="recommendations" className="mt-4 space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base">Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Badge className="mt-0.5">{idx + 1}</Badge>
                          <p className="text-sm text-gray-700">{rec}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Stakeholders to Involve
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.stakeholdersToInvolve.map((stakeholder) => (
                        <Badge key={stakeholder} variant="secondary">
                          {stakeholder}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="border-t pt-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {result && (
            <Button onClick={() => console.log('Saving scenario...')}>
              Save Scenario
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateMockSimulation(scenario: string): SimulationResult {
  return {
    scenario,
    impacts: [
      {
        area: 'Timeline & Schedule',
        description: 'Marketing campaign launches Week 4, but feature won\'t be ready until Week 6. Creates 2-week misalignment and $50K committed spend at risk.',
        severity: 'high',
        icon: Calendar,
      },
      {
        area: 'Budget & Resources',
        description: '2-week delay adds ~$90K in lost revenue opportunity. Option to compress timeline requires $50K contract engineering spend.',
        severity: 'high',
        icon: DollarSign,
      },
      {
        area: 'Q2 Roadmap',
        description: 'Pushes 2 other P1 features (Mobile App Refresh, Dashboard v2) into Q3. Cascading delays affect 3 teams.',
        severity: 'medium',
        icon: TrendingUp,
      },
      {
        area: 'Team Morale',
        description: 'Engineering team concerns about being pressured into unrealistic timelines. Marketing frustrated by technical blockers.',
        severity: 'medium',
        icon: Users,
      },
    ],
    alternatives: [
      {
        id: 'alt-1',
        title: 'Negotiate Descoped MVP',
        pros: [
          'Hits marketing timeline',
          'Delivers core value quickly',
          'No wasted marketing spend',
          'Can enhance in Phase 2',
        ],
        cons: [
          'Reduced feature set',
          'May not fully solve problem',
          'Requires follow-up PRD',
          'Potential tech debt',
        ],
        effort: 'Medium',
        timeline: '4 weeks',
      },
      {
        id: 'alt-2',
        title: 'Add Contract Engineering Resources',
        pros: [
          'Meets both timelines',
          'Full feature scope',
          'No marketing waste',
          'Team capability boost',
        ],
        cons: [
          '$50K additional cost',
          'Onboarding overhead',
          'Quality risk with contractors',
          'Dependencies on availability',
        ],
        effort: 'High',
        timeline: '4 weeks (compressed)',
      },
      {
        id: 'alt-3',
        title: 'Delay Marketing Campaign',
        pros: [
          'No technical compromise',
          'Complete feature set',
          'Proper quality assurance',
          'Coordinated launch',
        ],
        cons: [
          '$50K sunk marketing costs',
          'Competitive timing loss',
          '~$180K revenue delay',
          'Team momentum loss',
        ],
        effort: 'Low',
        timeline: '6 weeks',
      },
    ],
    recommendations: [
      'Schedule alignment meeting with Engineering Lead (Sarah) and Marketing Director (Chris) within 24 hours',
      'Engage Finance to assess budget for contract resources vs. campaign delay costs',
      'Have Engineering create detailed scope breakdown showing MVP vs. full feature requirements',
      'Marketing to present campaign flexibility options and any pivot possibilities',
      'Your Director should make final call on roadmap trade-offs given Q2 priorities',
    ],
    stakeholdersToInvolve: [
      'Sarah Chen (Eng Lead)',
      'Chris Martinez (Marketing)',
      'Finance Director',
      'Your Manager',
      'Engineering Director',
    ],
  };
}
