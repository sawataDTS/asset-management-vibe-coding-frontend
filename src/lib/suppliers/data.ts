export type Supplier = {
  id: string
  name: string
  category: string
  website: string
  contactName: string
  contactEmail: string
  contactPhone: string
  address: string
  notes: string
  hardwareCount: number
  softwareCount: number
  hasVendorCert: boolean
}

export const initialSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Apple Store",
    category: "",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    notes: "",
    hardwareCount: 31,
    softwareCount: 50,
    hasVendorCert: false,
  },
  {
    id: "sup-2",
    name: "divya",
    category: "Reseller",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    notes: "",
    hardwareCount: 0,
    softwareCount: 0,
    hasVendorCert: false,
  },
  {
    id: "sup-3",
    name: "Innov8",
    category: "Reseller",
    website: "",
    contactName: "John",
    contactEmail: "john@gmail.com",
    contactPhone: "9991919929",
    address: "",
    notes: "",
    hardwareCount: 0,
    softwareCount: 0,
    hasVendorCert: false,
  },
  {
    id: "sup-4",
    name: "SSVN",
    category: "",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    notes: "",
    hardwareCount: 0,
    softwareCount: 0,
    hasVendorCert: false,
  },
  {
    id: "sup-5",
    name: "Trace",
    category: "",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    notes: "",
    hardwareCount: 5,
    softwareCount: 0,
    hasVendorCert: false,
  },
]
