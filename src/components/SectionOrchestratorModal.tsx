import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Brain, 
  CheckCircle2, 
  Lightbulb, 
  MessageSquare, 
  Target, 
  Users,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Send,
  Bot
} from 'lucide-react';
import { PRDSection, SectionOrchestrator, BrainstormingIdea, SectionCriteria, AgentInsight } from '@/types';
import { mockStakeholders } from '@/data/mockData';

interface SectionOrchestratorModalProps {
  section: PRDSection;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrchestrator: (sectionId: string, orchestrator: Partial<SectionOrchestrator>) => void;
}

// Simulated AI Agents for brainstorming
const AI_AGENTS = [
  { id: 'agent-product', name: 'Product Strategist', role: 'Product', avatar: '🎯', color: 'bg-blue-500' },
  { id: 'agent-tech', name: 'Technical Architect', role: 'Engineering', avatar: '🔧', color: 'bg-purple-500' },
  { id: 'agent-ux', name: 'UX Researcher', role: 'Design', avatar: '🎨', color: 'bg-pink-500' },
  { id: 'agent-analytics', name: 'Data Analyst', role: 'Analytics', avatar: '📊', color: 'bg-green-500' },
  { id: 'agent-legal', name: 'Compliance Officer', role: 'Legal', avatar: '⚖️', color: 'bg-orange-500' },
];

export default function SectionOrchestratorModal({ 
  section, 
  isOpen, 
  onClose, 
  onUpdateOrchestrator 
}: SectionOrchestratorModalProps) {
  const [activeTab, setActiveTab] = useState('brainstorm');
  const [newIdea, setNewIdea] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(AI_AGENTS[0].id);
  const [ideas, setIdeas] = useState<BrainstormingIdea[]>([
    {
      id: '1',
      content: 'Consider edge cases for mobile users with limited connectivity',
      category: 'requirement',
      confidence: 85,
      votes: 3,
      selected: true,
      rationale: 'Mobile traffic represents 60% of our user base'
    },
    {
      id: '2',
      content: 'Integration with existing analytics pipeline required',
      category: 'technical',
      confidence: 90,
      votes: 2,
      selected: true,
      rationale: 'Must maintain data consistency across platforms'
    }
  ]);
  const [criteria, setCriteria] = useState<SectionCriteria[]>([
    {
      id: 'c1',
      category: 'functional',
      description: 'Users can complete the primary workflow in under 3 clicks',
      priority: 'P0',
      acceptanceCriteria: ['Primary CTA visible on load', 'No more than 2 navigation steps'],
      validationMethod: 'User testing with 10 participants',
      definedBy: ['agent-ux', 'agent-product'],
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [insights, setInsights] = useState<AgentInsight[]>([
    {
      id: 'i1',
      agentId: 'agent-tech',
      agentName: 'Technical Architect',
      agentAvatar: '🔧',
      type: 'question',
      content: 'Have we considered the API rate limiting implications for this feature?',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      incorporated: false
    },
    {
      id: 'i2',
      agentId: 'agent-ux',
      agentName: 'UX Researcher',
      agentAvatar: '🎨',
      type: 'suggestion',
      content: 'Consider adding a progress indicator for multi-step processes',
      timestamp: new Date().toISOString(),
      acknowledged: true,
      incorporated: true
    }
  ]);
  const [newCriteria, setNewCriteria] = useState<{
    description: string;
    category: SectionCriteria['category'];
    priority: Priority;
  }>({
    description: '',
    category: 'functional',
    priority: 'P1'
  });

  const handleAddIdea = () => {
    if (!newIdea.trim()) return;
    
    const agent = AI_AGENTS.find(a => a.id === selectedAgent);
    const idea: BrainstormingIdea = {
      id: Date.now().toString(),
      content: newIdea,
      category: 'requirement',
      confidence: Math.floor(Math.random() * 20) + 80,
      votes: 0,
      selected: false,
      rationale: `Suggested by ${agent?.name}`
    };
    
    setIdeas([...ideas, idea]);
    setNewIdea('');
  };

  const handleVoteIdea = (ideaId: string, increment: number) => {
    setIdeas(ideas.map(idea => 
      idea.id === ideaId 
        ? { ...idea, votes: Math.max(0, idea.votes + increment) }
        : idea
    ));
  };

  const handleSelectIdea = (ideaId: string) => {
    setIdeas(ideas.map(idea => 
      idea.id === ideaId 
        ? { ...idea, selected: !idea.selected }
        : idea
    ));
  };

  const handleAddCriteria = () => {
    if (!newCriteria.description.trim()) return;
    
    const criteria: SectionCriteria = {
      id: Date.now().toString(),
      category: newCriteria.category,
      description: newCriteria.description,
      priority: newCriteria.priority,
      acceptanceCriteria: [],
      validationMethod: '',
      definedBy: ['user'],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCriteria(prev => [...prev, criteria]);
    setNewCriteria({ description: '', category: 'functional', priority: 'P1' });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      requirement: 'bg-blue-100 text-blue-700',
      constraint: 'bg-red-100 text-red-700',
      assumption: 'bg-yellow-100 text-yellow-700',
      risk: 'bg-orange-100 text-orange-700',
      opportunity: 'bg-green-100 text-green-700',
      functional: 'bg-blue-100 text-blue-700',
      technical: 'bg-purple-100 text-purple-700',
      business: 'bg-green-100 text-green-700',
      user_experience: 'bg-pink-100 text-pink-700',
      compliance: 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return <MessageSquare className="w-4 h-4 text-yellow-500" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-green-500" />;
      case 'concern': return <ThumbsDown className="w-4 h-4 text-red-500" />;
      case 'validation': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">Section Orchestrator</DialogTitle>
              <DialogDescription>
                {section.icon} {section.name} - AI-powered brainstorming & criteria definition
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full justify-start px-6 border-b rounded-none h-12">
            <TabsTrigger value="brainstorm" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Brainstorming
              {ideas.filter(i => i.selected).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {ideas.filter(i => i.selected).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="criteria" className="gap-2">
              <Target className="w-4 h-4" />
              Criteria
              {criteria.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {criteria.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Agent Insights
              {insights.filter(i => !i.acknowledged).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {insights.filter(i => !i.acknowledged).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="consensus" className="gap-2">
              <Users className="w-4 h-4" />
              Consensus
            </TabsTrigger>
          </TabsList>

          {/* Brainstorming Tab */}
          <TabsContent value="brainstorm" className="p-6 space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select AI Agent" />
                </SelectTrigger>
                <SelectContent>
                  {AI_AGENTS.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-2">
                        <span>{agent.avatar}</span>
                        <span>{agent.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Add an idea, requirement, or consideration..."
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  className="flex-1 min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey) {
                      handleAddIdea();
                    }
                  }}
                />
                <Button onClick={handleAddIdea} className="self-end">
                  <Send className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      idea.selected 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectIdea(idea.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(idea.category)}>
                            {idea.category}
                          </Badge>
                          {idea.selected && (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Selected
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{idea.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {idea.rationale}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVoteIdea(idea.id, 1);
                            }}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">
                            {idea.votes}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVoteIdea(idea.id, -1);
                            }}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {ideas.filter(i => i.selected).length} of {ideas.length} ideas selected
              </div>
              <Button 
                onClick={() => {
                  onUpdateOrchestrator(section.id, {
                    brainstorming: [{ 
                      id: Date.now().toString(),
                      agentId: 'multi-agent',
                      agentName: 'Orchestrator Session',
                      agentRole: 'Multi-Agent',
                      timestamp: new Date().toISOString(),
                      ideas: ideas.filter(i => i.selected),
                      status: 'completed'
                    }]
                  });
                  onClose();
                }}
                disabled={ideas.filter(i => i.selected).length === 0}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save Selected Ideas
              </Button>
            </div>
          </TabsContent>

          {/* Criteria Tab */}
          <TabsContent value="criteria" className="p-6 space-y-4">
            <div className="flex gap-4 mb-4">
              <Select 
                value={newCriteria.category} 
                onValueChange={(v) => setNewCriteria({...newCriteria, category: v as SectionCriteria['category']})}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="functional">Functional</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="user_experience">UX</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={newCriteria.priority} 
                onValueChange={(v) => setNewCriteria({...newCriteria, priority: v as Priority})}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P0">P0</SelectItem>
                  <SelectItem value="P1">P1</SelectItem>
                  <SelectItem value="P2">P2</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Define a criteria..."
                value={newCriteria.description}
                onChange={(e) => setNewCriteria({...newCriteria, description: e.target.value})}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCriteria();
                  }
                }}
              />
              <Button onClick={handleAddCriteria}>
                <Send className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(criterion.category)}>
                            {criterion.category}
                          </Badge>
                          <Badge className={
                            criterion.priority === 'P0' ? 'bg-red-500 text-white' :
                            criterion.priority === 'P1' ? 'bg-orange-500 text-white' :
                            'bg-blue-500 text-white'
                          }>
                            {criterion.priority}
                          </Badge>
                          <Badge variant={
                            criterion.status === 'approved' ? 'default' :
                            criterion.status === 'review' ? 'secondary' :
                            'outline'
                          }>
                            {criterion.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{criterion.description}</p>
                        {criterion.acceptanceCriteria.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Acceptance Criteria:</p>
                            <ul className="text-xs list-disc list-inside">
                              {criterion.acceptanceCriteria.map((ac, idx) => (
                                <li key={idx}>{ac}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="p-6 space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${
                      insight.acknowledged ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-lg">
                        {insight.agentAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{insight.agentName}</span>
                          {getInsightTypeIcon(insight.type)}
                          <Badge variant="secondary" className="text-xs capitalize">
                            {insight.type}
                          </Badge>
                          {!insight.acknowledged && (
                            <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm">{insight.content}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setInsights(insights.map(i => 
                                i.id === insight.id ? { ...i, acknowledged: true } : i
                              ));
                            }}
                            disabled={insight.acknowledged}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Acknowledge
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setInsights(insights.map(i => 
                                i.id === insight.id ? { ...i, incorporated: true, acknowledged: true } : i
                              ));
                            }}
                            disabled={insight.incorporated}
                          >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Incorporate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Consensus Tab */}
          <TabsContent value="consensus" className="p-6 space-y-4">
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Build Consensus</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Once you have selected ideas and defined criteria, the Orchestrator will 
                help synthesize a consensus view across all stakeholders.
              </p>
              <Button 
                disabled={ideas.filter(i => i.selected).length === 0 || criteria.length === 0}
                onClick={() => {
                  // Simulate consensus building
                  alert('Consensus building would synthesize selected ideas and criteria into a unified view');
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Consensus View
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
