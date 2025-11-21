import { defineStore } from 'pinia'

interface Project {
  id: number
  name: {
    ar: string
    en: string
  }
  wbs: {
    id: number
    title: {
      ar: string
      en: string
    }
  } | null
}

interface Pagination {
  total: number
  currentPage: number
  perPage: number
  totalPages: number
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    items: [] as Project[],
    pagination: {
      total: 0,
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
    } as Pagination,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchProjects(page = 1, perPage = 10) {
      this.loading = true
      this.error = null

      try {
        // ✅ بيانات ثابتة بدل API
        const allProjects: Project[] = [
          { id: 1, name: { ar: 'مشروع 1', en: 'Project 1' }, wbs: { id: 101, title: { ar: 'WBS 1', en: 'WBS 1' } } },
          { id: 2, name: { ar: 'مشروع 2', en: 'Project 2' }, wbs: { id: 102, title: { ar: 'WBS 2', en: 'WBS 2' } } },
          { id: 3, name: { ar: 'مشروع 3', en: 'Project 3' }, wbs: null },
          { id: 4, name: { ar: 'مشروع 4', en: 'Project 4' }, wbs: { id: 103, title: { ar: 'WBS 3', en: 'WBS 3' } } },
          // ... أضف بيانات أكثر إذا أحببت
        ]

        // حساب pagination
        const total = allProjects.length
        const totalPages = Math.ceil(total / perPage)
        const start = (page - 1) * perPage
        const end = start + perPage
        const items = allProjects.slice(start, end)

        // حفظ البيانات في الحالة
        this.items = items
        this.pagination = { total, currentPage: page, perPage, totalPages }

        console.log('Fetched projects (static):', this.items)
      } catch (err: any) {
        console.error('Fetch projects error:', err)
        this.error = err.message || 'Failed to fetch projects'
      } finally {
        this.loading = false
      }
    },
  },
})
