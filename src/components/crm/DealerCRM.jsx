import { useState, useEffect } from 'react'

const DealerCRM = () => {
  const [leads, setLeads] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    const loadLeads = () => {
      const saved = localStorage.getItem('crmLeads')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setLeads(parsed)
        } catch {
          // Ignore parse errors
        }
      } else {
        // Initialize with demo data
        const demoLeads = [
          {
            id: 1,
            customerName: 'John Doe',
            email: 'john@example.com',
            phone: '(555) 123-4567',
            vehicleName: '2023 Toyota Camry',
            status: 'new',
            source: 'website',
            notes: 'Interested in test drive',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            customerName: 'Jane Smith',
            email: 'jane@example.com',
            phone: '(555) 987-6543',
            vehicleName: '2024 Honda CR-V',
            status: 'contacted',
            source: 'phone',
            notes: 'Scheduled test drive for Friday',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]
        setLeads(demoLeads)
        localStorage.setItem('crmLeads', JSON.stringify(demoLeads))
      }
    }
    loadLeads()
  }, [])

  const updateLeadStatus = (leadId, newStatus) => {
    const updated = leads.map(lead =>
      lead.id === leadId
        ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
        : lead
    )
    setLeads(updated)
    localStorage.setItem('crmLeads', JSON.stringify(updated))
  }

  const addNote = (leadId, note) => {
    const updated = leads.map(lead => (lead.id === leadId ? { ...lead, notes: note } : lead))
    setLeads(updated)
    localStorage.setItem('crmLeads', JSON.stringify(updated))
  }

  const filteredLeads = leads.filter(lead => filter === 'all' || lead.status === filter)

  const statusColors = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
    contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
    qualified: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
    won: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
    lost: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <h1 className="text-3xl font-bold">Dealer CRM</h1>
          <p className="text-primary-100">Manage your leads and customer relationships</p>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {['all', 'new', 'contacted', 'qualified', 'won'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  filter === status
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-600'
                }`}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {status === 'all' ? leads.length : leads.filter(l => l.status === status).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {status} Leads
                </div>
              </button>
            ))}
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {lead.customerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{lead.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {lead.vehicleName}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={e => updateLeadStatus(lead.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[lead.status]}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-900 dark:text-gray-100">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No leads found</div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedLead.customerName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedLead.vehicleName}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <textarea
                    value={selectedLead.notes}
                    onChange={e => addNote(selectedLead.id, e.target.value)}
                    rows={4}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DealerCRM
