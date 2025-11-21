// stores/enterprise.js
import { defineStore } from 'pinia'

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    // Data
    tableData: [],
    loading: false,
    error: null,
    
    // Search & Filter
    mainSearch: '',
    openFilterId: null,
    showMoreFilters: false,
    
    // Pagination
    currentPage: 1,
    itemsPerPage: 10,
    serverPagination: {
      enabled: false,
      total: 0,
      totalPages: 0,
    },
    
    // Sorting
    sortColumn: null,
    sortDirection: 'asc',
    
    // Selection
    selectAll: false,
    activeRowMenu: null,
    
    // Routing base for row details (e.g., 'companies' or 'users')
    rowRoute: 'companies',
    
    // Column Management
    showColumnManager: false,
    columnSearch: '',
    
    // Filters Configuration
    allFilters: [
      {
        id: 'companyName',
        label: 'Company name',
        active: true,
        searchQuery: '',
        selectedValues: [],
        hasValue: false,
        options: []
      },
      {
        id: 'companyField',
        label: 'Company Field',
        active: true,
        searchQuery: '',
        selectedValues: [],
        hasValue: false,
        options: []
      },
      {
        id: 'email',
        label: 'Email',
        active: false,
        searchQuery: '',
        selectedValues: [],
        hasValue: false,
        options: []
      },
      {
        id: 'phoneNumber',
        label: 'Phone number',
        active: false,
        searchQuery: '',
        selectedValues: [],
        hasValue: false,
        options: []
      },
      {
        id: 'address',
        label: 'Address',
        active: false,
        searchQuery: '',
        selectedValues: [],
        hasValue: false,
        options: []
      }
    ],
    
    // Columns Configuration
    columns: [
      { id: 'no', label: 'NO.', visible: true },
      { id: 'companyName', label: 'Company name', visible: true },
      { id: 'companyField', label: 'Company Field', visible: true },
      { id: 'email', label: 'Email', visible: true },
      { id: 'phoneNumber', label: 'Phone number', visible: false },
      { id: 'address', label: 'Address', visible: false },
      { id: 'updatedAt', label: 'Updated at', visible: false },
      { id: 'updatedBy', label: 'Updated by', visible: false }
    ]
  }),
  
  getters: {
    // Active and Inactive Filters
    activeFilters: (state) => state.allFilters.filter(f => f.active),
    inactiveFilters: (state) => state.allFilters.filter(f => !f.active),
    
    // Visible Columns
    visibleColumns: (state) => state.columns.filter(c => c.visible),
    
    // Filtered Columns for Search
    filteredColumns: (state) => {
      if (!state.columnSearch) return state.columns
      return state.columns.filter(c =>
        c.label.toLowerCase().includes(state.columnSearch.toLowerCase())
      )
    },
    
    // Filtered Items
    filteredItems: (state) => {
      let items = [...state.tableData]

      // Main search
      if (state.mainSearch) {
        items = items.filter(item =>
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(state.mainSearch.toLowerCase())
          )
        )
      }

      // Active filters
      state.allFilters.filter(f => f.active).forEach(filter => {
        if (filter.selectedValues.length > 0) {
          items = items.filter(item => {
            const itemValue = String(item[filter.id]).toLowerCase()
            return filter.selectedValues.some(val =>
              itemValue.includes(val.toLowerCase())
            )
          })
        }
      })

      // Sorting
      if (state.sortColumn) {
        items.sort((a, b) => {
          const aVal = a[state.sortColumn]
          const bVal = b[state.sortColumn]
          const modifier = state.sortDirection === 'asc' ? 1 : -1
          
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * modifier
          }
          
          return String(aVal).localeCompare(String(bVal)) * modifier
        })
      }

      return items
    },
    
    // Total Items
    totalItems: (state) => state.serverPagination.enabled
      ? state.serverPagination.total
      : state.filteredItems.length,
    
    // Total Pages
    totalPages: (state) => state.serverPagination.enabled
      ? state.serverPagination.totalPages
      : Math.ceil(state.filteredItems.length / state.itemsPerPage),
    
    // Paginated Items
    paginatedItems: (state) => {
      if (state.serverPagination.enabled) {
        // When using server pagination, tableData already holds current page
        return state.tableData
      }
      const start = (state.currentPage - 1) * state.itemsPerPage
      const end = start + state.itemsPerPage
      return state.filteredItems.slice(start, end)
    },
    
    // Start Item
    startItem: (state) => {
      if (state.serverPagination.enabled) {
        if (state.serverPagination.total === 0) return 0
        return (state.currentPage - 1) * state.itemsPerPage + 1
      }
      return state.filteredItems.length === 0 
        ? 0 
        : (state.currentPage - 1) * state.itemsPerPage + 1
    },
    
    // End Item
    endItem: (state) => {
      if (state.serverPagination.enabled) {
        const end = state.currentPage * state.itemsPerPage
        return end > state.serverPagination.total ? state.serverPagination.total : end
      }
      const end = state.currentPage * state.itemsPerPage
      return end > state.filteredItems.length ? state.filteredItems.length : end
    },
    
    // Selected Items
    selectedItems: (state) => state.tableData.filter(item => item.selected),
    selectedCount: (state) => state.tableData.filter(item => item.selected).length,
    hasSelection: (state) => state.tableData.some(item => item.selected)
  },
  
  actions: {
    // Initialize Data
    initializeData(data) {
      this.tableData = data.map(item => ({
        ...item,
        selected: false
      }))
      this.updateFilterOptions()
    },
    
    // Update Filter Options
    updateFilterOptions() {
      // Company Names
      const companyNames = [...new Set(this.tableData.map(item => item.companyName))]
      const companyNameFilter = this.allFilters.find(f => f.id === 'companyName')
      if (companyNameFilter) {
        const toLower = (v) => String(v ?? '').toLowerCase()
        const toLabel = (v) => String(v ?? '')
        companyNameFilter.options = companyNames.map(name => ({
          value: toLower(name),
          label: toLabel(name)
        }))
      }

      // Company Fields
      const companyFields = [...new Set(this.tableData.map(item => item.companyField))]
      const companyFieldFilter = this.allFilters.find(f => f.id === 'companyField')
      if (companyFieldFilter) {
        const toLower = (v) => String(v ?? '').toLowerCase()
        const toLabel = (v) => String(v ?? '')
        companyFieldFilter.options = companyFields.map(field => ({
          value: toLower(field),
          label: toLabel(field)
        }))
      }

      // Emails
      const emails = [...new Set(this.tableData.map(item => item.email))]
      const emailFilter = this.allFilters.find(f => f.id === 'email')
      if (emailFilter) {
        const toLower = (v) => String(v ?? '').toLowerCase()
        const toLabel = (v) => String(v ?? '')
        emailFilter.options = emails.map(email => ({
          value: toLower(email),
          label: toLabel(email)
        }))
      }

      // Phone Numbers
      const phoneNumbers = [...new Set(this.tableData.map(item => item.phoneNumber))]
      const phoneFilter = this.allFilters.find(f => f.id === 'phoneNumber')
      if (phoneFilter) {
        const toLabel = (v) => String(v ?? '')
        phoneFilter.options = phoneNumbers.map(phone => ({
          value: toLabel(phone),
          label: toLabel(phone)
        }))
      }

      // Addresses
      const addresses = [...new Set(this.tableData.map(item => item.address))]
      const addressFilter = this.allFilters.find(f => f.id === 'address')
      if (addressFilter) {
        const toLower = (v) => String(v ?? '').toLowerCase()
        const toLabel = (v) => String(v ?? '')
        addressFilter.options = addresses.map(address => ({
          value: toLower(address),
          label: toLabel(address)
        }))
      }
    },
    
    // Toggle Filter Dropdown
    toggleFilterDropdown(filterId) {
      this.openFilterId = this.openFilterId === filterId ? null : filterId
    },
    
    // Close Filter Dropdown
    closeFilterDropdown() {
      this.openFilterId = null
    },
    
    // Apply Filter
    applyFilter(filterId) {
      const filter = this.allFilters.find(f => f.id === filterId)
      if (filter) {
        filter.hasValue = filter.selectedValues.length > 0
      }
      this.currentPage = 1
      this.closeFilterDropdown()
    },
    
    // Clear Filter
    clearFilter(filterId) {
      const filter = this.allFilters.find(f => f.id === filterId)
      if (filter) {
        filter.selectedValues = []
        filter.searchQuery = ''
        filter.hasValue = false
      }
      this.currentPage = 1
    },
    
    // Activate Filter
    activateFilter(filterId) {
      const filter = this.allFilters.find(f => f.id === filterId)
      if (filter) {
        filter.active = true
      }
      this.showMoreFilters = false
    },
    
    // Reset All Filters
    resetAllFilters() {
      this.allFilters.forEach(filter => {
        filter.selectedValues = []
        filter.searchQuery = ''
        filter.hasValue = false
      })
      this.mainSearch = ''
      this.currentPage = 1
    },
    
    // Sort By Column
    sortBy(columnId) {
      if (this.sortColumn === columnId) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = columnId
        this.sortDirection = 'asc'
      }
    },
    
    // Toggle Select All
    toggleSelectAll() {
      this.paginatedItems.forEach(item => {
        const originalItem = this.tableData.find(i => i.no === item.no)
        if (originalItem) {
          originalItem.selected = this.selectAll
        }
      })
    },
    
    // Toggle Row Menu
    toggleRowMenu(no) {
      this.activeRowMenu = this.activeRowMenu === no ? null : no
    },
    
    // Delete Item
    deleteItem(itemNo) {
      this.tableData = this.tableData.filter(item => item.no !== itemNo)
      this.updateFilterOptions()
      this.activeRowMenu = null
    },
    
    // Pagination Actions
    goToFirstPage() {
      this.currentPage = 1
    },
    
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    
    goToLastPage() {
      this.currentPage = this.totalPages
    }
  }
})