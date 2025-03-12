// Initialize sample customer data
let customers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        company: 'Tech Corp',
        status: 'Active'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '(555) 987-6543',
        company: 'Design Co',
        status: 'Active'
    }
];

// DOM Elements
const navButtons = document.querySelectorAll('[data-section]');
const sections = document.querySelectorAll('section');
const customerModal = document.getElementById('customerModal');
const customerForm = document.getElementById('customerForm');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const cancelCustomerBtn = document.getElementById('cancelCustomerBtn');
const searchCustomerInput = document.getElementById('searchCustomer');
const customerTableBody = document.getElementById('customerTableBody');

// Navigation
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and sections
        navButtons.forEach(btn => {
            btn.classList.remove('bg-gray-100');
            btn.classList.add('hover:bg-gray-100');
        });
        sections.forEach(section => section.classList.add('hidden'));

        // Add active class to clicked button and show corresponding section
        button.classList.add('bg-gray-100');
        button.classList.remove('hover:bg-gray-100');
        document.getElementById(button.dataset.section).classList.remove('hidden');
    });
});

// Modal Functions
function openModal() {
    customerModal.classList.remove('hidden');
    customerForm.reset();
}

function closeModal() {
    customerModal.classList.add('hidden');
    customerForm.reset();
}

// Customer Management Functions
function addCustomer(customer) {
    customers.push({
        id: Date.now().toString(),
        ...customer,
        status: 'Active'
    });
    renderCustomers();
    saveToLocalStorage();
}

function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        customers = customers.filter(customer => customer.id !== id);
        renderCustomers();
        saveToLocalStorage();
    }
}

function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerEmail').value = customer.email;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerCompany').value = customer.company;
        
        customerForm.dataset.editId = id;
        openModal();
    }
}

function renderCustomers(searchTerm = '') {
    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    customerTableBody.innerHTML = filteredCustomers.map(customer => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                        <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <i class="fas fa-user text-gray-500"></i>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${customer.name}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${customer.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${customer.phone}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${customer.company}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${customer.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editCustomer('${customer.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCustomer('${customer.id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Local Storage Functions
function saveToLocalStorage() {
    localStorage.setItem('crm-customers', JSON.stringify(customers));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('crm-customers');
    if (stored) {
        customers = JSON.parse(stored);
        renderCustomers();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderCustomers();
});

addCustomerBtn.addEventListener('click', openModal);
cancelCustomerBtn.addEventListener('click', closeModal);

customerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const customerData = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        company: document.getElementById('customerCompany').value
    };

    const editId = customerForm.dataset.editId;
    if (editId) {
        // Update existing customer
        customers = customers.map(customer => 
            customer.id === editId ? { ...customer, ...customerData } : customer
        );
        delete customerForm.dataset.editId;
    } else {
        // Add new customer
        addCustomer(customerData);
    }

    closeModal();
    renderCustomers();
});

searchCustomerInput.addEventListener('input', (e) => {
    renderCustomers(e.target.value);
});

// Close modal when clicking outside
customerModal.addEventListener('click', (e) => {
    if (e.target === customerModal) {
        closeModal();
    }
});

// Update dashboard stats
function updateDashboardStats() {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    // Add more stats as needed
}
