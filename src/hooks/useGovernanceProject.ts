import { useSearchParams } from 'react-router-dom';

export function useGovernanceProject() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('project');

  const setProject = (id: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (id) {
      newParams.set('project', id);
    } else {
      newParams.delete('project');
    }
    setSearchParams(newParams, { replace: true });
  };

  return { projectId, setProject };
}
