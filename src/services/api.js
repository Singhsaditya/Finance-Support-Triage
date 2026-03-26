import axios from 'axios'

// We read from localStorage each time so settings changes take effect
function getBase() {
  return localStorage.getItem('apiBase') || 'http://127.0.0.1:8000'
}

function client() {
  return axios.create({
    baseURL: getBase(),
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const api = {
  /** Submit a query for triage */
  triage: (query) => client().post('/api/v1/triage', { query }),

  /** Fetch paginated ticket list */
  listTickets: (params = {}) => client().get('/api/v1/tickets', { params }),

  /** Get single ticket */
  getTicket: (id) => client().get(`/api/v1/tickets/${id}`),

  /** Dashboard stats */
  getStats: () => client().get('/api/v1/stats'),
}
