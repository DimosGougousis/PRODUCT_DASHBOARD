import { TrendingUp, Target, ThumbsUp, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/Layout';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function AgentPerformanceDashboard() {
  const accuracyMetrics = [
    { name: 'Stakeholder ID', current: 87, target: 85, trend: '+5%' },
    { name: 'Conflict Detection', current: 73, target: 70, trend: '+8%' },
    { name: 'RAG Retrieval', current: 84, target: 85, trend: '-2%' },
    { name: 'Timeline Prediction', current: 78, target: 75, trend: '+12%' },
  ];

  const recommendationAcceptance = [
    { type: 'Bottleneck Alerts', accepted: 45, dismissed: 12, rate: 79 },
    { type: 'Parallel Work', accepted: 38, dismissed: 8, rate: 83 },
    { type: 'Pattern Matching', accepted: 28, dismissed: 15, rate: 65 },
    { type: 'Risk Detection', accepted: 34, dismissed: 11, rate: 76 },
    { type: 'Optimization', accepted: 41, dismissed: 9, rate: 82 },
  ];

  const learningCurves = [
    { week: 'W1', stakeholderId: 72, conflictDetection: 61, ragRetrieval: 79 },
    { week: 'W2', stakeholderId: 78, conflictDetection: 67, ragRetrieval: 81 },
    { week: 'W3', stakeholderId: 83, conflictDetection: 71, ragRetrieval: 83 },
    { week: 'W4', stakeholderId: 87, conflictDetection: 73, ragRetrieval: 84 },
  ];

  const modelPerformance = [
    {
      model: 'RACI Generator',
      accuracy: 87,
      latency: '450ms',
      throughput: '1,240/day',
      cost: '$12.40',
    },
    {
      model: 'Conflict Detector',
      accuracy: 73,
      latency: '890ms',
      throughput: '840/day',
      cost: '$8.90',
    },
    {
      model: 'Pattern Matcher',
      accuracy: 78,
      latency: '320ms',
      throughput: '2,100/day',
      cost: '$6.40',
    },
    {
      model: 'Context Generator',
      accuracy: 91,
      latency: '1,200ms',
      throughput: '560/day',
      cost: '$15.60',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Agent Performance</h1>
          <p className="text-gray-600">AI model accuracy, learning curves, and improvement metrics</p>
        </div>

        <Tabs defaultValue="accuracy">
          <TabsList className="mb-6">
            <TabsTrigger value="accuracy">Accuracy Metrics</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="learning">Learning Curves</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="accuracy" className="space-y-6">
            {/* Accuracy Overview */}
            <div className="grid grid-cols-4 gap-4">
              {accuracyMetrics.map((metric) => (
                <Card key={metric.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{metric.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold">{metric.current}%</span>
                      <span className="text-sm text-green-600 font-medium">{metric.trend}</span>
                    </div>
                    <Progress value={metric.current} className="h-2 mb-1" />
                    <p className="text-xs text-gray-500">Target: {metric.target}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Accuracy Details</CardTitle>
                <CardDescription>How accuracy is measured for each capability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-sm mb-2">Stakeholder Identification (87%)</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Measures: Correct stakeholder-to-section matches validated by PMs
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">True Positives:</span>
                      <span className="font-medium ml-2">342</span>
                    </div>
                    <div>
                      <span className="text-gray-500">False Positives:</span>
                      <span className="font-medium ml-2">28</span>
                    </div>
                    <div>
                      <span className="text-gray-500">False Negatives:</span>
                      <span className="font-medium ml-2">24</span>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-sm mb-2">Conflict Detection (73%)</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Measures: Conflicts identified before they cause delays
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Detected Early:</span>
                      <span className="font-medium ml-2">87</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Missed:</span>
                      <span className="font-medium ml-2">22</span>
                    </div>
                    <div>
                      <span className="text-gray-500">False Alarms:</span>
                      <span className="font-medium ml-2">10</span>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-sm mb-2">RAG Retrieval (84%)</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Measures: Relevance of retrieved documentation and context
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Relevant Results:</span>
                      <span className="font-medium ml-2">412</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Irrelevant:</span>
                      <span className="font-medium ml-2">67</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Rank:</span>
                      <span className="font-medium ml-2">2.4</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            {/* Acceptance Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendation Acceptance Rates</CardTitle>
                <CardDescription>How often PMs accept AI recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recommendationAcceptance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-20} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accepted" fill="#10b981" name="Accepted" />
                    <Bar dataKey="dismissed" fill="#ef4444" name="Dismissed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Stats */}
            <div className="grid grid-cols-5 gap-4">
              {recommendationAcceptance.map((rec) => (
                <Card key={rec.type}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">{rec.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600 mb-1">{rec.rate}%</p>
                      <p className="text-xs text-gray-500">
                        {rec.accepted} / {rec.accepted + rec.dismissed}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Curves</CardTitle>
                <CardDescription>Agent improvement over time through feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={learningCurves}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[60, 90]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="stakeholderId"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Stakeholder ID"
                    />
                    <Line
                      type="monotone"
                      dataKey="conflictDetection"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Conflict Detection"
                    />
                    <Line
                      type="monotone"
                      dataKey="ragRetrieval"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="RAG Retrieval"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Week-over-Week Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Stakeholder ID:</span>
                      <span className="font-medium text-green-600">+4.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conflict Detection:</span>
                      <span className="font-medium text-green-600">+2.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RAG Retrieval:</span>
                      <span className="font-medium text-green-600">+1.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Feedback Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Corrections received:</span>
                      <span className="font-medium">284</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Applied to model:</span>
                      <span className="font-medium">267 (94%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg improvement:</span>
                      <span className="font-medium text-green-600">+2.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Projected Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>4 weeks:</span>
                      <span className="font-medium">91% avg accuracy</span>
                    </div>
                    <div className="flex justify-between">
                      <span>8 weeks:</span>
                      <span className="font-medium">94% avg accuracy</span>
                    </div>
                    <div className="flex justify-between">
                      <span>12 weeks:</span>
                      <span className="font-medium">96% avg accuracy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Details</CardTitle>
                <CardDescription>Individual AI model metrics and costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="pb-2 font-semibold">Model</th>
                        <th className="pb-2 font-semibold">Accuracy</th>
                        <th className="pb-2 font-semibold">Avg Latency</th>
                        <th className="pb-2 font-semibold">Throughput</th>
                        <th className="pb-2 font-semibold">Daily Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelPerformance.map((model) => (
                        <tr key={model.model} className="border-b">
                          <td className="py-3 font-medium">{model.model}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Progress value={model.accuracy} className="w-20 h-2" />
                              <span>{model.accuracy}%</span>
                            </div>
                          </td>
                          <td className="py-3">{model.latency}</td>
                          <td className="py-3">{model.throughput}</td>
                          <td className="py-3">{model.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Daily Cost</p>
                    <p className="text-2xl font-bold text-blue-600">$43.30</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Monthly Projection</p>
                    <p className="text-2xl font-bold text-green-600">$1,299</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Cost per PRD</p>
                    <p className="text-2xl font-bold text-purple-600">$27.60</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">ROI</p>
                    <p className="text-2xl font-bold text-orange-600">47:1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
