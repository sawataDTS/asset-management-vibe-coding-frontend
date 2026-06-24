export const suppliers = [
  "Trace",
  "InnovB",
  "Dell Direct",
  "Apple Store",
  "Lenovo Direct",
  "Logitech Store",
] as const

export const hardwareCategories = [
  "Laptop",
  "Monitor",
  "Phone",
  "Tablet",
  "Accessory",
  "Desktop",
  "Other",
] as const

export const softwareCategories = [
  "Productivity",
  "Design",
  "Development",
  "Security",
  "Communication",
  "Other",
] as const

export const intakeModes = [
  "Pooled Seats (1 subscription, N seats)",
  "Individual Keys (1 license per unit)",
] as const

export const billingPeriods = ["Monthly", "Annually", "One-time"] as const

export const csvSpreadsheetTypes = ["Hardware Inventory", "Software License", "Employees"] as const

export const csvColumnOrders: Record<(typeof csvSpreadsheetTypes)[number], string> = {
  "Hardware Inventory":
    "supplier_name, asset_tag, serial_number, item_name, category, brand, model, purchase_date, unit_cost, warranty_expiry, status, condition, location, notes",
  "Software License":
    "supplier_name, software_name, vendor, category, seats, unit_cost, billing_period, start_date, renewal_date, po_number, reference, notes",
  Employees:
    "employee_id, full_name, email, phone, job_title, department, manager, start_date, address, city, state, zip, country, status, notes",
}
