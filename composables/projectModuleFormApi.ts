export interface Project {
  id: number;
  name: string;
  wbs: {
    id: number;
    title: string;
  } | null;
}

export interface Pagination {
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  version: number;
  code: number;
  status: string;
  message: string | null;
  data: T;
}

export const projectModuleFormApi = () => {
  /**
   * بيانات ثابتة للمشاريع
   */
  const staticProjects: Project[] = [
    { id: 1, name: 'Project 1', wbs: { id: 101, title: 'WBS 1' } },
    { id: 2, name: 'Project 2', wbs: { id: 102, title: 'WBS 2' } },
    { id: 3, name: 'Project 3', wbs: null },
    { id: 4, name: 'Project 4', wbs: { id: 103, title: 'WBS 3' } },
  ];

  /**
   * محاكاة استدعاء API وإرجاع بيانات ثابتة
   */
  const moduleFormByProjectId = async (
    projectId: number | string
  ): Promise<ApiResponse<Project>> => {
    // البحث عن المشروع بالـ ID
    const project = staticProjects.find(p => p.id === Number(projectId));

    // إرجاع response مشابه للـ API
    return {
      version: 1,
      code: 200,
      status: 'success',
      message: null,
      data: project || null,
    };
  };

  return { moduleFormByProjectId };
};
