import { useState } from 'react';
import { Search, Plus, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Layout from '@/components/Layout';
import { Stakeholder, StakeholderFunction } from '@/types';
import { mockStakeholders } from '@/data/mockData';
import AddStakeholderModal from '@/components/AddStakeholderModal';

export default function Stakeholders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [functionFilter, setFunctionFilter] = useState<StakeholderFunction | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [stakeholders] = useState<Stakeholder[]>(mockStakeholders);

  const functionColors: Record<StakeholderFunction, string> = {
    engineering: 'bg-blue-100 text-blue-700',
    design: 'bg-purple-100 text-purple-700',
    analytics: 'bg-green-100 text-green-700',
    marketing: 'bg-orange-100 text-orange-700',
    legal: 'bg-gray-100 text-gray-700',
    security: 'bg-red-100 text-red-700',
    finance: 'bg-yellow-100 text-yellow-700',
    product: 'bg-pink-100 text-pink-700',
  };

  const filteredStakeholders = stakeholders.filter((stakeholder) => {
    const matchesSearch =
      stakeholder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stakeholder.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stakeholder.expertise.some((exp) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFunction =
      functionFilter === 'all' || stakeholder.function === functionFilter;
    return matchesSearch && matchesFunction;
  });

  const getWorkloadColor = (workload: number) => {
    if (workload >= 7) return 'text-red-500';
    if (workload >= 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Stakeholder Directory</h1>
          <p className="text-gray-600">
            Manage stakeholders and view their expertise, availability, and contribution history
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name, role, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={functionFilter} onValueChange={(value) => setFunctionFilter(value as StakeholderFunction | 'all')}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Functions</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Stakeholder
          </Button>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredStakeholders.length} of {stakeholders.length} stakeholders
        </p>

        {/* Stakeholder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStakeholders.map((stakeholder) => (
            <Card key={stakeholder.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-medium">
                    {stakeholder.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <Badge className={functionColors[stakeholder.function]}>
                    {stakeholder.function}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                <CardDescription>{stakeholder.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1">
                  {stakeholder.expertise.slice(0, 3).map((exp) => (
                    <Badge key={exp} variant="outline" className="text-xs">
                      {exp}
                    </Badge>
                  ))}
                  {stakeholder.expertise.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{stakeholder.expertise.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Response Rate</p>
                    <p className={`font-semibold ${getResponseRateColor(stakeholder.responseRate)}`}>
                      {stakeholder.responseRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg Response</p>
                    <p className="font-semibold">{stakeholder.avgResponseTime}d</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quality Score</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <p className="font-semibold">{stakeholder.qualityScore}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Workload</p>
                    <p className={`font-semibold ${getWorkloadColor(stakeholder.currentWorkload)}`}>
                      {stakeholder.currentWorkload} PRDs
                    </p>
                  </div>
                </div>

                {/* Contact Method */}
                <div className="pt-2">
                  <p className="text-xs text-gray-500">Preferred Contact</p>
                  <Badge variant="secondary" className="mt-1">
                    {stakeholder.preferredContactMethod}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStakeholders.length === 0 && (
          <Card className="p-12">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">No stakeholders found</p>
              <p>Try adjusting your search or filters</p>
            </div>
          </Card>
        )}
      </div>

      <AddStakeholderModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </Layout>
  );
}
