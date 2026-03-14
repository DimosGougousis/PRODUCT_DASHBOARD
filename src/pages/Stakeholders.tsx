import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockStakeholders } from '@/data/mockData';
import { usePRDs } from '@/context/PRDContext';
import { Mail, FileText, Star } from 'lucide-react';
import { StakeholderFunction } from '@/types/prd';

const Stakeholders = () => {
  const { prds } = usePRDs();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  interface AssignedStakeholder {
    stakeholderId?: string;
  }

  interface LegacyStakeholder {
    id?: string;
  }

  interface SectionWithAssignments {
    assignedStakeholders?: AssignedStakeholder[];
    assignedTo?: LegacyStakeholder[];
  }

  const getPRDCount = (stakeholderId: string) => {
    return prds.filter((prd) => {
      const sections = Array.isArray(prd.sections) ? prd.sections : [];

      return sections.some((section: SectionWithAssignments) => {
        // New shape: assignedStakeholders: Array<{ stakeholderId: string; ... }>
        if (Array.isArray(section.assignedStakeholders)) {
          return section.assignedStakeholders.some(
            (s) => s?.stakeholderId === stakeholderId
          );
        }

        // Old shape fallback: assignedTo: Stakeholder[]
        if (Array.isArray(section.assignedTo)) {
          return section.assignedTo.some((s) => s?.id === stakeholderId);
        }

        return false;
      });
    }).length;
  };

  const functionColors: Record<StakeholderFunction, string> = {
    engineering: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    design: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    analytics: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    marketing: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    legal: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    security: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    finance: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    product: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  };

  return (
    <Layout title="Stakeholders" subtitle="Manage PRD contributors and reviewers">
      <div className="space-y-6 animate-fade-in p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockStakeholders.map((stakeholder) => (
            <Card
              key={stakeholder.id}
              className="card-hover cursor-pointer border border-border bg-card p-5"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white">
                    {getInitials(stakeholder.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="font-semibold text-foreground">
                    {stakeholder.name}
                  </h3>
                  <Badge className={functionColors[stakeholder.function]} variant="secondary">
                    {stakeholder.function}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{stakeholder.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{getPRDCount(stakeholder.id)} PRDs assigned</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Response</p>
                  <p className="font-semibold text-sm">{stakeholder.responseRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Avg Time</p>
                  <p className="font-semibold text-sm">{stakeholder.avgResponseTime}d</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Quality</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <p className="font-semibold text-sm">{stakeholder.qualityScore}</p>
                  </div>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
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
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Stakeholders;
