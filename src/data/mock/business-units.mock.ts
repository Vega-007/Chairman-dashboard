export interface KpiData {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export interface ChartPoint {
  name: string;
  value1: number;
  value2?: number;
  label1?: string;
  label2?: string;
}

export interface ChartData {
  title: string;
  type: 'line' | 'bar' | 'composed';
  data: ChartPoint[];
}

export interface TableRow {
  [key: string]: string | number;
}

export interface TableData {
  title: string;
  headers: string[];
  rows: TableRow[];
}

export interface BusinessUnitMock {
  id: string;
  name: string;
  description: string;
  kpis: KpiData[];
  charts: ChartData[];
  table?: TableData;
  insights: {
    risks: string[];
    opportunities: string[];
    observations: string[];
  };
}

export const BUSINESS_UNITS_DATA: Record<string, BusinessUnitMock> = {
  'srm-good-foods': {
    id: 'srm-good-foods',
    name: 'SRM Good Foods',
    description: 'Monitor revenue, profitability, sales performance, inventory, and outlet operations.',
    kpis: [
      { label: 'Total Revenue', value: '₹4.2 Cr', trend: '+12%', trendUp: true },
      { label: 'Total Cost', value: '₹3.1 Cr', trend: '+5%', trendUp: false },
      { label: 'Net Profit', value: '₹1.1 Cr', trend: '+18%', trendUp: true },
      { label: 'Profit Margin', value: '26.1%', trend: '+2.4%', trendUp: true },
      { label: 'Sales Growth', value: '14%', trend: '+3%', trendUp: true },
    ],
    charts: [
      {
        title: 'Revenue vs Cost (6 Months)',
        type: 'composed',
        data: [
          { name: 'Jan', value1: 65, value2: 45, label1: 'Revenue', label2: 'Cost' },
          { name: 'Feb', value1: 68, value2: 48, label1: 'Revenue', label2: 'Cost' },
          { name: 'Mar', value1: 72, value2: 50, label1: 'Revenue', label2: 'Cost' },
          { name: 'Apr', value1: 85, value2: 55, label1: 'Revenue', label2: 'Cost' },
          { name: 'May', value1: 90, value2: 60, label1: 'Revenue', label2: 'Cost' },
          { name: 'Jun', value1: 95, value2: 62, label1: 'Revenue', label2: 'Cost' },
        ]
      },
      {
        title: 'Sales by Outlet',
        type: 'bar',
        data: [
          { name: 'Main Canteen', value1: 120, label1: 'Sales (Lakhs)' },
          { name: 'Tech Park', value1: 85, label1: 'Sales (Lakhs)' },
          { name: 'University Bldg', value1: 60, label1: 'Sales (Lakhs)' },
          { name: 'Medical College', value1: 95, label1: 'Sales (Lakhs)' },
        ]
      }
    ],
    table: {
      title: 'Outlet Performance',
      headers: ['Outlet Name', 'Daily Sales', 'Inventory Turnover', 'Status'],
      rows: [
        { 'Outlet Name': 'Main Canteen', 'Daily Sales': '₹1.2L', 'Inventory Turnover': 'High', 'Status': 'Optimal' },
        { 'Outlet Name': 'Medical College', 'Daily Sales': '₹95K', 'Inventory Turnover': 'High', 'Status': 'Optimal' },
        { 'Outlet Name': 'Tech Park', 'Daily Sales': '₹85K', 'Inventory Turnover': 'Medium', 'Status': 'Monitor' },
        { 'Outlet Name': 'University Bldg', 'Daily Sales': '₹60K', 'Inventory Turnover': 'Low', 'Status': 'Low Stock' },
      ]
    },
    insights: {
      observations: ['Main Canteen is the top-performing outlet consistently.', 'Medical College sales spiked by 15% this month.'],
      risks: ['University Bldg outlet is facing supply chain delays.', 'Food cost inflation is reducing overall margin slightly.'],
      opportunities: ['Expand menu items in Tech Park to increase average order value.', 'Optimize vendor contracts for bulk ingredients.']
    }
  },
  'book-cdc': {
    id: 'book-cdc',
    name: 'Book & CDC',
    description: 'Track sales, stock availability, revenue trends, demand, and resource utilization.',
    kpis: [
      { label: 'Total Sales', value: '45,200', trend: '+8%', trendUp: true },
      { label: 'Total Revenue', value: '₹1.8 Cr', trend: '+11%', trendUp: true },
      { label: 'Stock Available', value: '1.2M', trend: '-2%', trendUp: false },
      { label: 'Stock Utilization', value: '78%', trend: '+5%', trendUp: true },
      { label: 'Demand Growth', value: '15%', trend: '+4%', trendUp: true },
    ],
    charts: [
      {
        title: 'Sales Trend (6 Months)',
        type: 'line',
        data: [
          { name: 'Jan', value1: 30, label1: 'Sales (k)' },
          { name: 'Feb', value1: 35, label1: 'Sales (k)' },
          { name: 'Mar', value1: 32, label1: 'Sales (k)' },
          { name: 'Apr', value1: 40, label1: 'Sales (k)' },
          { name: 'May', value1: 42, label1: 'Sales (k)' },
          { name: 'Jun', value1: 45, label1: 'Sales (k)' },
        ]
      },
      {
        title: 'Top Selling Categories',
        type: 'bar',
        data: [
          { name: 'Engineering', value1: 15, label1: 'Volume (k)' },
          { name: 'Medical', value1: 12, label1: 'Volume (k)' },
          { name: 'Management', value1: 8, label1: 'Volume (k)' },
          { name: 'Science', value1: 6, label1: 'Volume (k)' },
        ]
      }
    ],
    table: {
      title: 'Category Stock Levels',
      headers: ['Category', 'Stock Available', 'Demand Status', 'Utilization'],
      rows: [
        { 'Category': 'Engineering', 'Stock Available': '450,000', 'Demand Status': 'High', 'Utilization': '85%' },
        { 'Category': 'Medical', 'Stock Available': '300,000', 'Demand Status': 'High', 'Utilization': '82%' },
        { 'Category': 'Management', 'Stock Available': '250,000', 'Demand Status': 'Medium', 'Utilization': '70%' },
        { 'Category': 'Science', 'Stock Available': '200,000', 'Demand Status': 'Low', 'Utilization': '65%' },
      ]
    },
    insights: {
      observations: ['Engineering books remain the highest driver of revenue.', 'Overall stock utilization has improved to 78%.'],
      risks: ['Science category books have slow-moving stock.', 'Potential stock shortage in Medical category next month.'],
      opportunities: ['Promote e-books for Management and Science to reduce inventory holding costs.', 'Bundle slow-moving books.']
    }
  },
  'infrastructure': {
    id: 'infrastructure',
    name: 'SRM Infrastructure',
    description: 'Track infrastructure projects, budgets, assets, maintenance, and execution progress.',
    kpis: [
      { label: 'Active Projects', value: '14', trend: '+2', trendUp: true },
      { label: 'Total Budget', value: '₹120 Cr', trend: '0%', trendUp: true },
      { label: 'Budget Utilized', value: '45%', trend: '+5%', trendUp: false },
      { label: 'Project Completion', value: '62%', trend: '+8%', trendUp: true },
      { label: 'Assets Under Mgmt', value: '840', trend: '+12', trendUp: true },
    ],
    charts: [
      {
        title: 'Project Status Distribution',
        type: 'bar',
        data: [
          { name: 'Planning', value1: 3, label1: 'Projects' },
          { name: 'In Progress', value1: 8, label1: 'Projects' },
          { name: 'Review', value1: 2, label1: 'Projects' },
          { name: 'Completed', value1: 1, label1: 'Projects' },
        ]
      },
      {
        title: 'Budget Utilization (Quarterly)',
        type: 'line',
        data: [
          { name: 'Q1', value1: 10, label1: 'Utilized (Cr)' },
          { name: 'Q2', value1: 25, label1: 'Utilized (Cr)' },
          { name: 'Q3', value1: 40, label1: 'Utilized (Cr)' },
          { name: 'Q4', value1: 54, label1: 'Utilized (Cr)' },
        ]
      }
    ],
    table: {
      title: 'Critical Projects Overview',
      headers: ['Project Name', 'Progress', 'Budget', 'Status'],
      rows: [
        { 'Project Name': 'New Tech Park Block', 'Progress': '75%', 'Budget': '₹45 Cr', 'Status': 'On Track' },
        { 'Project Name': 'Medical College Expansion', 'Progress': '40%', 'Budget': '₹30 Cr', 'Status': 'Delayed' },
        { 'Project Name': 'Hostel Renovation', 'Progress': '90%', 'Budget': '₹15 Cr', 'Status': 'On Track' },
        { 'Project Name': 'Sports Complex', 'Progress': '20%', 'Budget': '₹20 Cr', 'Status': 'Planning' },
      ]
    },
    insights: {
      observations: ['Hostel renovation is nearing completion ahead of schedule.', 'Total asset count increased due to new lab equipments.'],
      risks: ['Medical College Expansion is facing regulatory delays.', 'Budget overruns projected for Sports Complex.'],
      opportunities: ['Reallocate funds from completed projects to accelerate delayed ones.', 'Implement predictive maintenance for older assets.']
    }
  },
  'hostels-mess': {
    id: 'hostels-mess',
    name: 'Hostels & Mess',
    description: 'Monitor occupancy, operational costs, utilization, student satisfaction, and service issues.',
    kpis: [
      { label: 'Occupancy Rate', value: '92%', trend: '+4%', trendUp: true },
      { label: 'Total Residents', value: '12,500', trend: '+450', trendUp: true },
      { label: 'Monthly Revenue', value: '₹8.5 Cr', trend: '+6%', trendUp: true },
      { label: 'Operating Cost', value: '₹4.2 Cr', trend: '+2%', trendUp: false },
      { label: 'Student Satisfaction', value: '4.1/5', trend: '+0.2', trendUp: true },
    ],
    charts: [
      {
        title: 'Occupancy Trend (6 Months)',
        type: 'line',
        data: [
          { name: 'Jan', value1: 80, label1: 'Occupancy %' },
          { name: 'Feb', value1: 82, label1: 'Occupancy %' },
          { name: 'Mar', value1: 85, label1: 'Occupancy %' },
          { name: 'Apr', value1: 88, label1: 'Occupancy %' },
          { name: 'May', value1: 90, label1: 'Occupancy %' },
          { name: 'Jun', value1: 92, label1: 'Occupancy %' },
        ]
      },
      {
        title: 'Revenue vs Cost',
        type: 'composed',
        data: [
          { name: 'Jan', value1: 7.5, value2: 3.8, label1: 'Revenue (Cr)', label2: 'Cost (Cr)' },
          { name: 'Feb', value1: 7.8, value2: 3.9, label1: 'Revenue (Cr)', label2: 'Cost (Cr)' },
          { name: 'Mar', value1: 8.0, value2: 4.0, label1: 'Revenue (Cr)', label2: 'Cost (Cr)' },
          { name: 'Apr', value1: 8.2, value2: 4.1, label1: 'Revenue (Cr)', label2: 'Cost (Cr)' },
          { name: 'May', value1: 8.4, value2: 4.2, label1: 'Revenue (Cr)', label2: 'Cost (Cr)' },
          { name: 'Jun', value1: 8.5, value2: 4.2, label1: 'Revenue (Cr)', label2: 'Cost (Cr)' },
        ]
      }
    ],
    table: {
      title: 'Hostel Block Performance',
      headers: ['Block Name', 'Occupancy', 'Complaints', 'Status'],
      rows: [
        { 'Block Name': 'Nelson Mandela', 'Occupancy': '98%', 'Complaints': '12', 'Status': 'Excellent' },
        { 'Block Name': 'Sister Nivedita', 'Occupancy': '95%', 'Complaints': '8', 'Status': 'Excellent' },
        { 'Block Name': 'Beggars Roost', 'Occupancy': '85%', 'Complaints': '45', 'Status': 'Needs Review' },
        { 'Block Name': 'Kalpana Chawla', 'Occupancy': '90%', 'Complaints': '22', 'Status': 'Good' },
      ]
    },
    insights: {
      observations: ['Overall occupancy reached 92% this semester.', 'Student satisfaction improved following new mess menu.'],
      risks: ['High number of maintenance complaints in Beggars Roost.', 'Operating costs are creeping up due to electricity tariffs.'],
      opportunities: ['Optimize mess food waste to further reduce operating costs.', 'Renovate older blocks to command premium fees.']
    }
  },
  'srm-diagnostic-lab': {
    id: 'srm-diagnostic-lab',
    name: 'SRM Diagnostic Lab',
    description: 'Track diagnostic activity, patient volume, revenue, utilization, and operational efficiency.',
    kpis: [
      { label: 'Total Tests', value: '45,890', trend: '+15%', trendUp: true },
      { label: 'Patient Volume', value: '18,400', trend: '+12%', trendUp: true },
      { label: 'Revenue', value: '₹2.4 Cr', trend: '+18%', trendUp: true },
      { label: 'Equipment Util.', value: '82%', trend: '+5%', trendUp: true },
      { label: 'Operational Efficiency', value: '94%', trend: '+2%', trendUp: true },
    ],
    charts: [
      {
        title: 'Test Volume Trend',
        type: 'line',
        data: [
          { name: 'Jan', value1: 30, label1: 'Tests (k)' },
          { name: 'Feb', value1: 32, label1: 'Tests (k)' },
          { name: 'Mar', value1: 35, label1: 'Tests (k)' },
          { name: 'Apr', value1: 40, label1: 'Tests (k)' },
          { name: 'May', value1: 42, label1: 'Tests (k)' },
          { name: 'Jun', value1: 45, label1: 'Tests (k)' },
        ]
      },
      {
        title: 'Test Category Distribution',
        type: 'bar',
        data: [
          { name: 'Blood', value1: 25, label1: 'Volume (k)' },
          { name: 'Imaging', value1: 12, label1: 'Volume (k)' },
          { name: 'Pathology', value1: 5, label1: 'Volume (k)' },
          { name: 'Microbiology', value1: 3, label1: 'Volume (k)' },
        ]
      }
    ],
    table: {
      title: 'Equipment Utilization',
      headers: ['Equipment', 'Utilization', 'Downtime', 'Status'],
      rows: [
        { 'Equipment': 'MRI Scanner', 'Utilization': '95%', 'Downtime': '2 hrs', 'Status': 'Critical High' },
        { 'Equipment': 'CT Scanner', 'Utilization': '88%', 'Downtime': '5 hrs', 'Status': 'Optimal' },
        { 'Equipment': 'X-Ray Machine 1', 'Utilization': '60%', 'Downtime': '12 hrs', 'Status': 'Underutilized' },
        { 'Equipment': 'Ultrasound', 'Utilization': '85%', 'Downtime': '1 hr', 'Status': 'Optimal' },
      ]
    },
    insights: {
      observations: ['Patient volume saw a sharp 12% increase this quarter.', 'MRI Scanner is operating at peak capacity.'],
      risks: ['X-Ray Machine 1 is underutilized and facing frequent downtime.', 'Staffing shortages during peak morning hours.'],
      opportunities: ['Introduce premium health checkup packages to boost revenue.', 'Optimize scheduling for MRI to reduce wait times.']
    }
  },
  'q-mart': {
    id: 'q-mart',
    name: 'Q Mart',
    description: 'Monitor sales, inventory levels, margins, stock turnover, and business growth.',
    kpis: [
      { label: 'Total Sales', value: '₹1.5 Cr', trend: '+8%', trendUp: true },
      { label: 'Revenue', value: '₹1.5 Cr', trend: '+8%', trendUp: true },
      { label: 'Gross Margin', value: '22%', trend: '+1.5%', trendUp: true },
      { label: 'Inventory Value', value: '₹45 L', trend: '-5%', trendUp: true },
      { label: 'Stock Turnover', value: '4.2x', trend: '+0.4x', trendUp: true },
    ],
    charts: [
      {
        title: 'Sales Trend',
        type: 'line',
        data: [
          { name: 'Jan', value1: 1.1, label1: 'Sales (Cr)' },
          { name: 'Feb', value1: 1.2, label1: 'Sales (Cr)' },
          { name: 'Mar', value1: 1.2, label1: 'Sales (Cr)' },
          { name: 'Apr', value1: 1.3, label1: 'Sales (Cr)' },
          { name: 'May', value1: 1.4, label1: 'Sales (Cr)' },
          { name: 'Jun', value1: 1.5, label1: 'Sales (Cr)' },
        ]
      },
      {
        title: 'Category-wise Sales',
        type: 'bar',
        data: [
          { name: 'Groceries', value1: 65, label1: 'Sales (Lakhs)' },
          { name: 'Stationery', value1: 45, label1: 'Sales (Lakhs)' },
          { name: 'Electronics', value1: 25, label1: 'Sales (Lakhs)' },
          { name: 'Apparel', value1: 15, label1: 'Sales (Lakhs)' },
        ]
      }
    ],
    table: {
      title: 'Inventory Status',
      headers: ['Category', 'Stock Value', 'Turnover', 'Margin'],
      rows: [
        { 'Category': 'Groceries', 'Stock Value': '₹15 L', 'Turnover': '6.5x', 'Margin': '15%' },
        { 'Category': 'Stationery', 'Stock Value': '₹12 L', 'Turnover': '3.2x', 'Margin': '35%' },
        { 'Category': 'Electronics', 'Stock Value': '₹10 L', 'Turnover': '2.1x', 'Margin': '25%' },
        { 'Category': 'Apparel', 'Stock Value': '₹8 L', 'Turnover': '1.5x', 'Margin': '40%' },
      ]
    },
    insights: {
      observations: ['Groceries have the highest turnover but lowest margin.', 'Stationery sales spiked due to new semester start.'],
      risks: ['Apparel category has very slow-moving inventory.', 'Occasional stock shortages in daily essentials.'],
      opportunities: ['Promote high-margin stationery and electronics.', 'Implement automated reordering for fast-moving groceries.']
    }
  },
  'net-dtp-center': {
    id: 'net-dtp-center',
    name: 'Net & DTP Center',
    description: 'Track service usage, revenue, service performance, and department-wise utilization.',
    kpis: [
      { label: 'Total Usage', value: '1.2M hrs', trend: '+5%', trendUp: true },
      { label: 'Revenue', value: '₹45 L', trend: '+12%', trendUp: true },
      { label: 'Services Delivered', value: '450k', trend: '+8%', trendUp: true },
      { label: 'Dept Utilization', value: '85%', trend: '+3%', trendUp: true },
      { label: 'Growth Rate', value: '15%', trend: '+2%', trendUp: true },
    ],
    charts: [
      {
        title: 'Usage Trend',
        type: 'line',
        data: [
          { name: 'Jan', value1: 0.8, label1: 'Usage (M hrs)' },
          { name: 'Feb', value1: 0.9, label1: 'Usage (M hrs)' },
          { name: 'Mar', value1: 1.0, label1: 'Usage (M hrs)' },
          { name: 'Apr', value1: 1.1, label1: 'Usage (M hrs)' },
          { name: 'May', value1: 1.1, label1: 'Usage (M hrs)' },
          { name: 'Jun', value1: 1.2, label1: 'Usage (M hrs)' },
        ]
      },
      {
        title: 'Service Distribution',
        type: 'bar',
        data: [
          { name: 'Printing', value1: 200, label1: 'Volume (k)' },
          { name: 'Browsing', value1: 150, label1: 'Volume (k)' },
          { name: 'Binding', value1: 60, label1: 'Volume (k)' },
          { name: 'Design', value1: 40, label1: 'Volume (k)' },
        ]
      }
    ],
    insights: {
      observations: ['Printing services account for nearly 45% of total volume.', 'Design services have the highest profit margin.'],
      risks: ['Legacy printing equipment requires frequent maintenance.', 'Peak hour browsing speeds are occasionally throttled.'],
      opportunities: ['Upgrade printing fleet to reduce maintenance costs.', 'Introduce premium design and thesis formatting services.']
    }
  },
  'transport': {
    id: 'transport',
    name: 'Transport',
    description: 'Monitor fleet operations, route utilization, fuel consumption, maintenance, and operating costs.',
    kpis: [
      { label: 'Total Fleet', value: '125', trend: '0', trendUp: true },
      { label: 'Active Vehicles', value: '118', trend: '+2', trendUp: true },
      { label: 'Fleet Utilization', value: '94%', trend: '+1%', trendUp: true },
      { label: 'Fuel Cost', value: '₹65 L', trend: '-2%', trendUp: true },
      { label: 'Maintenance Cost', value: '₹12 L', trend: '+5%', trendUp: false },
    ],
    charts: [
      {
        title: 'Fuel Consumption Trend',
        type: 'line',
        data: [
          { name: 'Jan', value1: 68, label1: 'Cost (Lakhs)' },
          { name: 'Feb', value1: 67, label1: 'Cost (Lakhs)' },
          { name: 'Mar', value1: 69, label1: 'Cost (Lakhs)' },
          { name: 'Apr', value1: 66, label1: 'Cost (Lakhs)' },
          { name: 'May', value1: 66, label1: 'Cost (Lakhs)' },
          { name: 'Jun', value1: 65, label1: 'Cost (Lakhs)' },
        ]
      },
      {
        title: 'Route Utilization',
        type: 'bar',
        data: [
          { name: 'City Center', value1: 98, label1: 'Occupancy %' },
          { name: 'North Suburbs', value1: 92, label1: 'Occupancy %' },
          { name: 'South End', value1: 85, label1: 'Occupancy %' },
          { name: 'East Coast', value1: 75, label1: 'Occupancy %' },
        ]
      }
    ],
    table: {
      title: 'Fleet Maintenance Status',
      headers: ['Vehicle Type', 'Total', 'Active', 'In Maintenance'],
      rows: [
        { 'Vehicle Type': 'Large Buses', 'Total': 80, 'Active': 76, 'In Maintenance': 4 },
        { 'Vehicle Type': 'Mini Buses', 'Total': 25, 'Active': 24, 'In Maintenance': 1 },
        { 'Vehicle Type': 'Vans/SUVs', 'Total': 20, 'Active': 18, 'In Maintenance': 2 },
      ]
    },
    insights: {
      observations: ['Fuel costs dropped by 2% due to route optimization.', 'City Center routes are operating near 100% capacity.'],
      risks: ['Maintenance costs are rising for older large buses.', 'East Coast route is underutilized (75% occupancy).'],
      opportunities: ['Consolidate East Coast routes to save fuel.', 'Transition mini buses to EV for campus shuttles.']
    }
  }
};
