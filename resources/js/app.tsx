import {
  Activity,
  BadgeCheck,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  ClipboardPlus,
  HeartPulse,
  Hospital,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  Upload,
  UserRound,
  Users,
  Video,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

type AccountType = 'patient' | 'health_worker' | 'facility';
type ModuleId =
  | 'home'
  | 'pharmacy'
  | 'hospitals'
  | 'services'
  | 'medicines'
  | 'community'
  | 'medical-profile'
  | 'accounts';

type Medicine = {
  id: string;
  name: string;
  generic: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  dosage: string;
  prescription: boolean;
  description: string;
  pharmacies: string[];
};

type Facility = {
  id: string;
  name: string;
  type: 'Pharmacy' | 'Hospital' | 'Clinic' | 'Laboratory';
  province: string;
  distance: string;
  status: string;
  rating: string;
  verified: boolean;
  delivery?: boolean;
  services: string[];
  phone: string;
  hours: string;
};

type CartItem = {
  medicineId: string;
  quantity: number;
};

type ActionPanelContent = {
  title: string;
  subtitle: string;
  items: string[];
  primaryAction?: string;
};

const primary = '#1AA6A6';

const medicines: Medicine[] = [
  {
    id: 'paracetamol',
    name: 'Paracetamol 500mg',
    generic: 'Paracetamol',
    brand: 'Yashi',
    category: 'Analgesics',
    price: 35,
    stock: 120,
    dosage: '500mg tablets',
    prescription: false,
    description: 'Used for pain relief and fever reduction.',
    pharmacies: ['fine', 'good-life', 'careplus'],
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin 500mg',
    generic: 'Amoxicillin',
    brand: 'Shalina',
    category: 'Antibiotics',
    price: 75,
    stock: 40,
    dosage: '500mg capsules',
    prescription: true,
    description: 'Antibiotic medicine requiring pharmacist prescription review.',
    pharmacies: ['fine', 'good-life'],
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine 5mg',
    generic: 'Amlodipine',
    brand: 'Denk',
    category: 'Cardiac',
    price: 95,
    stock: 64,
    dosage: '5mg tablets',
    prescription: true,
    description: 'Used for blood pressure control when prescribed by a clinician.',
    pharmacies: ['fine', 'medlink'],
  },
  {
    id: 'metformin',
    name: 'Metformin 500mg',
    generic: 'Metformin',
    brand: 'Denk',
    category: 'Diabetes',
    price: 85,
    stock: 52,
    dosage: '500mg tablets',
    prescription: true,
    description: 'Diabetes medicine used as directed by a healthcare provider.',
    pharmacies: ['good-life', 'careplus'],
  },
  {
    id: 'cough-syrup',
    name: 'Chesty Cough Syrup',
    generic: 'Cough suppressant',
    brand: 'Yashi',
    category: 'Respiratory',
    price: 35,
    stock: 18,
    dosage: '100ml syrup',
    prescription: false,
    description: 'Used for cough relief and respiratory symptoms.',
    pharmacies: ['fine', 'careplus'],
  },
  {
    id: 'insulin',
    name: 'Mixtard Insulin',
    generic: 'Human insulin',
    brand: 'NovoCare',
    category: 'Diabetes',
    price: 210,
    stock: 9,
    dosage: '10ml vial',
    prescription: true,
    description: 'Cold-chain insulin product. Prescription and counselling required.',
    pharmacies: ['medlink'],
  },
];

const facilities: Facility[] = [
  {
    id: 'fine',
    name: 'Fine Pharmacy',
    type: 'Pharmacy',
    province: 'Lusaka',
    distance: '1.2 km',
    status: 'Open Now',
    rating: '4.8',
    verified: true,
    delivery: true,
    services: ['Prescription filling', 'Blood pressure check', 'Medication delivery', 'Ask pharmacist'],
    phone: '+260978000000',
    hours: '08:00 - 22:00',
  },
  {
    id: 'good-life',
    name: 'Good Life Pharmacy',
    type: 'Pharmacy',
    province: 'Lusaka',
    distance: '3.4 km',
    status: 'Open Now',
    rating: '4.5',
    verified: true,
    delivery: true,
    services: ['Prescription review', 'Chronic refill', 'Medication delivery'],
    phone: '+260977103220',
    hours: '08:00 - 20:00',
  },
  {
    id: 'careplus',
    name: 'CarePlus Pharmacy',
    type: 'Pharmacy',
    province: 'Lusaka',
    distance: '6.8 km',
    status: 'Open Now',
    rating: '4.6',
    verified: true,
    delivery: false,
    services: ['Women health', 'Children medicines', 'Blood sugar test'],
    phone: '+260955882771',
    hours: '09:00 - 19:00',
  },
  {
    id: 'medlink',
    name: 'Medlink Pharmacy',
    type: 'Pharmacy',
    province: 'Lusaka',
    distance: '4.1 km',
    status: 'Closing Soon',
    rating: '4.3',
    verified: true,
    delivery: true,
    services: ['Insurance support', 'Chronic medication refill', 'Cold-chain medicines'],
    phone: '+260966222111',
    hours: '08:00 - 18:00',
  },
  {
    id: 'partner-hospital',
    name: 'Medsearch Partner Hospital',
    type: 'Hospital',
    province: 'Lusaka',
    distance: '4.9 km',
    status: 'Open Now',
    rating: '4.8',
    verified: true,
    services: ['X-ray', 'Lab tests', 'Telemedicine', 'Emergency assessment'],
    phone: '+260211000101',
    hours: '24 hours',
  },
  {
    id: 'bert-clinic',
    name: 'Bert Clinic',
    type: 'Clinic',
    province: 'Lusaka',
    distance: '2.8 km',
    status: 'Hours TBC',
    rating: '4.2',
    verified: false,
    services: ['General consultation', 'Child health', 'Vitals monitoring'],
    phone: '+260211000102',
    hours: '08:00 - 17:00',
  },
  {
    id: 'care-lab',
    name: 'CarePlus Laboratory',
    type: 'Laboratory',
    province: 'Lusaka',
    distance: '5.6 km',
    status: 'Open Now',
    rating: '4.4',
    verified: true,
    services: ['Blood tests', 'HIV testing', 'Malaria test', 'COVID-19 testing'],
    phone: '+260211000103',
    hours: '07:30 - 18:00',
  },
];

const serviceCategories = [
  {
    title: 'Patient Services',
    services: ['Appointment Booking', 'Telemedicine', 'Medical Records Access', 'Medication Reminders', 'General Consultation', 'Maternal Health Services'],
  },
  {
    title: 'Clinical & Diagnostic Services',
    services: ['Laboratory Tests', 'Radiology / Imaging', 'X-ray', 'Blood Tests', 'COVID-19 Testing', 'HIV Testing & Counselling'],
  },
  {
    title: 'Pharmacy & Medication Services',
    services: ['Prescription Filling', 'Medicine Review', 'Chronic Refill', 'Medication Delivery'],
  },
  {
    title: 'Wellness & Preventive Care',
    services: ['Blood Pressure Screening', 'Cancer Screening', 'TB Screening', 'Health Education'],
  },
];

const accounts = [
  {
    id: 'patient' as AccountType,
    title: 'Patient / Public User',
    icon: UserRound,
    summary: 'Search, book, buy OTC medicines, save providers and receive notifications.',
    fields: ['Full name', 'NRC or passport', 'Phone OTP', 'Date of birth', 'Gender', 'PIN or biometric login'],
    permissions: [
      'Search hospitals',
      'Search pharmacies',
      'Search doctors',
      'Search medicines',
      'Buy OTC medicines',
      'Book appointments',
      'Use telemedicine',
      'Comment in community',
      'Save favorite providers',
      'Receive notifications',
    ],
  },
  {
    id: 'health_worker' as AccountType,
    title: 'Health Worker',
    icon: Stethoscope,
    summary: 'Create a professional profile, post education, answer questions and offer consultations.',
    fields: ['Profession', 'Registration number', 'Specialty', 'Facility', 'Years of experience'],
    permissions: ['Post text', 'Post image', 'Post video', 'Teleconsultations'],
  },
  {
    id: 'facility' as AccountType,
    title: 'Health Facility',
    icon: Building2,
    summary: 'Manage a facility profile, appointments, workers, services, orders and campaigns.',
    fields: ['Facility name', 'Facility type', 'License number', 'Address', 'GPS', 'Operating hours'],
    permissions: ['Campaigns', 'Analytics', 'Medicine orders', 'Facility content'],
  },
];

const modules = [
  { id: 'pharmacy' as ModuleId, title: 'Pharmacies', icon: Pill, color: 'bg-blue-500' },
  { id: 'hospitals' as ModuleId, title: 'Hospitals', icon: Hospital, color: 'bg-teal-500' },
  { id: 'services' as ModuleId, title: 'Medical Services', icon: ClipboardPlus, color: 'bg-cyan-500' },
  { id: 'medicines' as ModuleId, title: 'Medications', icon: ShoppingCart, color: 'bg-pink-500' },
  { id: 'community' as ModuleId, title: 'Community', icon: Users, color: 'bg-sky-500' },
  { id: 'medical-profile' as ModuleId, title: 'My Medical Profile', icon: ShieldCheck, color: 'bg-emerald-500' },
  { id: 'accounts' as ModuleId, title: 'Accounts', icon: Building2, color: 'bg-orange-500' },
];

const moduleLabels: Record<ModuleId, string> = {
  home: 'Home',
  pharmacy: 'Pharmacies',
  hospitals: 'Hospitals',
  services: 'Medical Services',
  medicines: 'Medications',
  community: 'Community',
  'medical-profile': 'My Medical Profile',
  accounts: 'Accounts',
};

function moduleFromHash(): ModuleId {
  if (typeof window === 'undefined') return 'home';
  const hashModule = window.location.hash.replace(/^#\/?/, '') as ModuleId;
  return ['pharmacy', 'hospitals', 'services', 'medicines', 'community', 'medical-profile', 'accounts'].includes(hashModule)
    ? hashModule
    : 'home';
}

function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>(() => moduleFromHash());
  const [query, setQuery] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('patient');
  const [loggedInAccount, setLoggedInAccount] = useState<AccountType | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState('fine');
  const [selectedMedicineId, setSelectedMedicineId] = useState('paracetamol');
  const [selectedService, setSelectedService] = useState('Appointment Booking');
  const [pharmacyFilter, setPharmacyFilter] = useState('All');
  const [communityTab, setCommunityTab] = useState('Feed');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState('Ready');
  const [actionPanel, setActionPanel] = useState<ActionPanelContent | null>(null);

  const selectedFacility = facilities.find((facility) => facility.id === selectedFacilityId) ?? facilities[0];
  const selectedMedicine = medicines.find((medicine) => medicine.id === selectedMedicineId) ?? medicines[0];

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) =>
      [medicine.name, medicine.generic, medicine.brand, medicine.category, medicine.description]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query]);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) =>
      [facility.name, facility.type, facility.province, facility.services.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query]);

  function navigate(module: ModuleId) {
    if (typeof window !== 'undefined') {
      const nextUrl = module === 'home' ? window.location.pathname : `${window.location.pathname}#/${module}`;
      window.history.pushState({}, '', nextUrl);
    }
    setActiveModule(module);
    setActionPanel(null);
    setToast(`Opened ${module === 'home' ? 'home' : module.replace('-', ' ')}`);
  }

  function openAction(panel: ActionPanelContent) {
    setActionPanel(panel);
    setToast(panel.title);
  }

  function openFacilityWindow(facility: Facility) {
    setSelectedFacilityId(facility.id);
    const inventory = medicines.filter((medicine) => medicine.pharmacies.includes(facility.id));
    openAction({
      title: `${facility.name} profile`,
      subtitle: `${facility.type} · ${facility.distance} away · ${facility.status} · ${facility.rating}/5 rating`,
      items: [
        `Quick actions: Call, Chat, WhatsApp, Directions, Share`,
        `Services Offered: ${facility.services.join(', ')}`,
        `Medicines In Stock: ${inventory.length ? inventory.map((medicine) => medicine.name).join(', ') : 'Service catalogue available'}`,
        `Delivery Services: ${facility.delivery ? 'Delivery available with order tracking' : 'Delivery not currently available'}`,
        `Map and Navigation: live route from current location to ${facility.name}`,
      ],
      primaryAction: 'Open full profile',
    });
  }

  function openMedicineWindow(medicine: Medicine) {
    setSelectedMedicineId(medicine.id);
    const stockFacilities = facilities.filter((facility) => medicine.pharmacies.includes(facility.id));
    openAction({
      title: `${medicine.name} details`,
      subtitle: `${medicine.brand} · ${medicine.generic} · ${medicine.category} · ZMW ${medicine.price}`,
      items: [
        `Photo: ${medicine.brand} ${medicine.name} pack image placeholder`,
        `Description: ${medicine.description}`,
        `Dosage: ${medicine.dosage}`,
        medicine.prescription ? 'Prescription required before checkout or delivery' : 'Available for OTC purchase',
        `Nearby pharmacies with stock: ${stockFacilities.map((facility) => `${facility.name} (${facility.distance})`).join(', ')}`,
      ],
      primaryAction: medicine.prescription ? 'Upload prescription' : 'Add to cart',
    });
  }

  function addToCart(medicineId: string) {
    setCart((items) => {
      const current = items.find((item) => item.medicineId === medicineId);
      if (current) {
        return items.map((item) =>
          item.medicineId === medicineId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { medicineId, quantity: 1 }];
    });
    setToast('Medicine added to cart');
  }

  function updateCart(medicineId: string, amount: number) {
    setCart((items) =>
      items
        .map((item) => item.medicineId === medicineId ? { ...item, quantity: item.quantity + amount } : item)
        .filter((item) => item.quantity > 0),
    );
  }

  const cartTotal = cart.reduce((sum, item) => {
    const medicine = medicines.find((entry) => entry.id === item.medicineId);
    return sum + (medicine?.price ?? 0) * item.quantity;
  }, 0);

  useEffect(() => {
    function handleRouteChange() {
      setActiveModule(moduleFromHash());
    }

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  function currentModuleScreen() {
    if (activeModule === 'pharmacy') {
      return (
        <PharmacyModule
          facilities={filteredFacilities.filter((facility) => facility.type === 'Pharmacy')}
          selectedFacility={selectedFacility}
          pharmacyFilter={pharmacyFilter}
          onSelectFacility={setSelectedFacilityId}
          onPharmacyFilterChange={setPharmacyFilter}
          onOpenFacility={openFacilityWindow}
          onAddToCart={addToCart}
          onOpenAction={openAction}
        />
      );
    }

    if (activeModule === 'hospitals') {
      return (
        <HospitalsModule
          facilities={filteredFacilities.filter((facility) => facility.type !== 'Pharmacy')}
          selectedFacility={selectedFacility}
          onSelectFacility={setSelectedFacilityId}
          onOpenFacility={openFacilityWindow}
          onOpenAction={openAction}
        />
      );
    }

    if (activeModule === 'services') {
      return (
        <Services
          selectedService={selectedService}
          onSelectService={setSelectedService}
          onSelectFacility={setSelectedFacilityId}
          onNavigate={navigate}
          onOpenFacility={openFacilityWindow}
          onOpenAction={openAction}
        />
      );
    }

    if (activeModule === 'medicines') {
      return (
        <Medicines
          medicines={filteredMedicines}
          selectedMedicine={selectedMedicine}
          onSelectMedicine={setSelectedMedicineId}
          onAddToCart={addToCart}
          onNavigate={navigate}
          onOpenMedicine={openMedicineWindow}
          onOpenAction={openAction}
        />
      );
    }

    if (activeModule === 'community') {
      return <Community activeTab={communityTab} onTabChange={setCommunityTab} onOpenAction={openAction} />;
    }

    if (activeModule === 'medical-profile') {
      return <MedicalProfile onOpenAction={openAction} />;
    }

    if (activeModule === 'accounts') {
      return (
        <Accounts
          accountType={accountType}
          loggedInAccount={loggedInAccount}
          onAccountTypeChange={setAccountType}
          onLogin={(type) => {
            setAccountType(type);
            setLoggedInAccount(type);
            setToast(`Logged in as ${type.replace('_', ' ')}`);
          }}
          onNavigate={navigate}
          onOpenAction={openAction}
        />
      );
    }

    return null;
  }

  return (
    <main className="min-h-screen bg-[#F6FBFB]">
      <SiteHeader activeModule={activeModule} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onNavigate={navigate} />
      {activeModule === 'home' ? (
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="space-y-5">
            <Hero onNavigate={navigate} />
            <SearchPanel query={query} onQueryChange={setQuery} />
            <HomeModules onNavigate={navigate} />
          </div>
          <aside className="space-y-5">
            <QuickActions onNavigate={navigate} />
            <CarolineCard onNavigate={navigate} selectedMedicine={selectedMedicine} selectedFacility={selectedFacility} />
            <CartPanel cart={cart} total={cartTotal} onUpdateCart={updateCart} onOpenAction={openAction} />
            <OrdersSnapshot toast={toast} />
          </aside>
        </section>
      ) : (
        <AppPage
          activeModule={activeModule}
          cart={<CartPanel cart={cart} total={cartTotal} onUpdateCart={updateCart} onOpenAction={openAction} />}
          onBack={() => navigate('home')}
          query={query}
          onQueryChange={setQuery}
        >
          {currentModuleScreen()}
          {actionPanel && <ActionPanel panel={actionPanel} onClose={() => setActionPanel(null)} />}
        </AppPage>
      )}
    </main>
  );
}

function SiteHeader({
  activeModule,
  cartCount,
  onNavigate,
}: {
  activeModule: ModuleId;
  cartCount: number;
  onNavigate: (module: ModuleId) => void;
}) {
  const navItems: ModuleId[] = ['pharmacy', 'hospitals', 'services', 'medicines', 'community', 'accounts'];

  return (
    <header className="sticky top-0 z-30 border-b border-teal-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <button className="flex items-center gap-3 text-left" onClick={() => onNavigate('home')}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1AA6A6] text-white shadow-sm">
            <HeartPulse size={24} />
          </span>
          <span>
            <strong className="block text-lg text-slate-950">MedSearch Zambia</strong>
            <small className="text-slate-500">Digital access to health services</small>
          </span>
        </button>
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold ${activeModule === item ? 'bg-[#EAF8F8] text-[#087D7D]' : 'text-slate-600 hover:bg-slate-100'}`}
              key={item}
              onClick={() => onNavigate(item)}
            >
              {item === 'accounts' ? 'Accounts' : item === 'medicines' ? 'Medications' : item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
        <button className="rounded-full bg-[#FF8A00] px-4 py-2 text-sm font-bold text-white shadow-sm" onClick={() => onNavigate('medicines')}>
          Cart {cartCount}
        </button>
      </div>
    </header>
  );
}

function AppPage({
  activeModule,
  cart,
  children,
  onBack,
  query,
  onQueryChange,
}: {
  activeModule: ModuleId;
  cart: ReactNode;
  children: ReactNode;
  onBack: () => void;
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const showCart = activeModule === 'pharmacy' || activeModule === 'medicines';

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <div className="mb-6 rounded-[28px] border border-teal-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#EAF8F8] px-4 py-2 text-sm font-black text-[#087D7D]"
              onClick={onBack}
            >
              <ChevronRight className="rotate-180" size={16} />
              Back to home
            </button>
            <p className="text-sm font-black uppercase tracking-wide text-[#087D7D]">MedSearch page</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">{moduleLabels[activeModule]}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This module now opens as its own web page, matching the app flow instead of stacking everything on the home screen.
            </p>
          </div>
          <span className="rounded-full bg-[#FF8A00] px-4 py-2 text-sm font-black text-white">
            {activeModule === 'accounts' ? 'Demo login enabled' : 'App-style page'}
          </span>
        </div>
        <div className="mt-5">
          <SearchPanel query={query} onQueryChange={onQueryChange} />
        </div>
      </div>
      <div className={showCart ? 'grid gap-8 lg:grid-cols-[1fr_360px]' : ''}>
        <div>{children}</div>
        {showCart && <aside className="space-y-5">{cart}</aside>}
      </div>
    </section>
  );
}

function Hero({ onNavigate }: { onNavigate: (module: ModuleId) => void }) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-[#1AA6A6] p-6 text-white shadow-sm lg:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_260px] md:items-center">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-white/16 px-3 py-1 text-sm font-semibold">MedSearch v2.0</p>
          <h1 className="max-w-2xl text-3xl font-black leading-tight lg:text-5xl">
            Website experience matching the MedSearch app workflows.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/86">
            Search medicines by brand, open facilities, book services, chat, manage cart, and review medical profile tools from the web.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-white px-5 py-3 font-bold text-[#087D7D]" onClick={() => onNavigate('pharmacy')}>
              Find a pharmacy
            </button>
            <button className="rounded-full bg-[#FF8A00] px-5 py-3 font-bold text-white" onClick={() => onNavigate('medical-profile')}>
              My medical profile
            </button>
          </div>
        </div>
        <div className="rounded-3xl bg-white/14 p-4">
          <div className="rounded-2xl bg-white p-4 text-slate-950 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <strong>Live preview</strong>
              <span className="rounded-full bg-[#EAF8F8] px-3 py-1 text-xs font-bold text-[#087D7D]">Interactive</span>
            </div>
            <div className="space-y-3">
              {['Fine Pharmacy: profile + stock', 'Services: facilities + booking', 'Community: tabs + actions'].map((item) => (
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3" key={item}>
                  <span className="h-3 w-3 rounded-full bg-[#1AA6A6]" />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchPanel({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  return (
    <label className="my-5 flex items-center gap-3 rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-sm">
      <Search className="text-slate-400" size={22} />
      <input
        className="w-full bg-transparent text-base outline-none"
        placeholder="Search medicines, brands, pharmacies, hospitals or services"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </label>
  );
}

function HomeModules({ onNavigate }: { onNavigate: (module: ModuleId) => void }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-slate-950">Main modules</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {modules.map((module) => (
          <button
            className={`${module.color} min-h-36 rounded-3xl p-5 text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
            key={module.id}
            onClick={() => onNavigate(module.id)}
          >
            <module.icon size={28} />
            <strong className="mt-5 block text-lg">{module.title}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function PharmacyModule({
  facilities,
  selectedFacility,
  pharmacyFilter,
  onSelectFacility,
  onPharmacyFilterChange,
  onOpenFacility,
  onAddToCart,
  onOpenAction,
}: {
  facilities: Facility[];
  selectedFacility: Facility;
  pharmacyFilter: string;
  onSelectFacility: (id: string) => void;
  onPharmacyFilterChange: (filter: string) => void;
  onOpenFacility: (facility: Facility) => void;
  onAddToCart: (medicineId: string) => void;
  onOpenAction: (panel: ActionPanelContent) => void;
}) {
  const activeFacility = facilities.find((facility) => facility.id === selectedFacility.id) ?? facilities[0] ?? selectedFacility;
  const inventory = medicines.filter((medicine) => medicine.pharmacies.includes(activeFacility.id));
  const filteredPharmacies = facilities
    .filter((facility) =>
      pharmacyFilter === 'All'
      || (pharmacyFilter === 'Verified' && facility.verified)
      || (pharmacyFilter === 'Open Now' && facility.status === 'Open Now')
      || (pharmacyFilter === 'Delivery' && facility.delivery)
      || (pharmacyFilter === 'Consultation' && facility.services.join(' ').toLowerCase().includes('consult'))
      || (pharmacyFilter === '24 Hours' && facility.hours === '24 hours')
      || pharmacyFilter === 'Nearest',
    )
    .sort((a, b) => pharmacyFilter === 'Nearest' ? parseFloat(a.distance) - parseFloat(b.distance) : 0);

  return (
    <section className="space-y-5">
      <SectionHeader title="Pharmacy module" subtitle="Find pharmacies, open profiles, view inventory, chat, call and navigate." />
      <LiveFacilityMap
        title="Live pharmacy map"
        facilities={filteredPharmacies}
        selectedFacility={activeFacility}
        onSelectFacility={onSelectFacility}
        onOpenFacility={onOpenFacility}
      />
      <FilterRow
        values={['All', 'Verified', 'Open Now', 'Delivery', 'Consultation', 'Nearest', '24 Hours']}
        active={pharmacyFilter}
        onChange={onPharmacyFilterChange}
      />
      <FacilityCards title="Nearby pharmacies" facilities={filteredPharmacies} onSelectFacility={onSelectFacility} onOpenFacility={onOpenFacility} />
      <FacilityProfile facility={activeFacility} onOpenAction={onOpenAction} />
      <Inventory title={`${activeFacility.name} medicines in stock`} medicines={inventory} onAddToCart={onAddToCart} onOpenAction={onOpenAction} />
    </section>
  );
}

function HospitalsModule({
  facilities,
  selectedFacility,
  onSelectFacility,
  onOpenFacility,
  onOpenAction,
}: {
  facilities: Facility[];
  selectedFacility: Facility;
  onSelectFacility: (id: string) => void;
  onOpenFacility: (facility: Facility) => void;
  onOpenAction: (panel: ActionPanelContent) => void;
}) {
  const activeFacility = facilities.find((facility) => facility.id === selectedFacility.id) ?? facilities[0] ?? selectedFacility;

  return (
    <section className="space-y-5">
      <SectionHeader title="Health facilities" subtitle="Open facility profiles, services, contact options, appointments and navigation." />
      <LiveFacilityMap
        title="Live health facility map"
        facilities={facilities}
        selectedFacility={activeFacility}
        onSelectFacility={onSelectFacility}
        onOpenFacility={onOpenFacility}
      />
      <FacilityCards title="Hospitals, clinics and labs" facilities={facilities} onSelectFacility={onSelectFacility} onOpenFacility={onOpenFacility} />
      <FacilityProfile facility={activeFacility} onOpenAction={onOpenAction} />
      <AppointmentCard facility={activeFacility} onOpenAction={onOpenAction} />
    </section>
  );
}

function LiveFacilityMap({
  title,
  facilities,
  selectedFacility,
  onSelectFacility,
  onOpenFacility,
}: {
  title: string;
  facilities: Facility[];
  selectedFacility: Facility;
  onSelectFacility: (id: string) => void;
  onOpenFacility: (facility: Facility) => void;
}) {
  const pinPositions = [
    { left: '16%', top: '34%' },
    { left: '46%', top: '56%' },
    { left: '68%', top: '30%' },
    { left: '78%', top: '66%' },
  ];

  return (
    <article className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h3 className="text-lg font-black text-slate-950">{title}</h3>
          <p className="text-sm text-slate-500">Tap a pin or list card to focus the map and open the profile window.</p>
        </div>
        <span className="rounded-full bg-[#EAF8F8] px-4 py-2 text-sm font-black text-[#087D7D]">GPS location detected</span>
      </div>
      <div className="relative mx-5 h-64 overflow-hidden rounded-[28px] bg-[#EAF8F8]">
        <div className="absolute inset-0 opacity-80" style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(26,166,166,.16) 1px, transparent 1px), linear-gradient(rgba(26,166,166,.16) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }} />
        <div className="absolute left-0 top-1/2 h-2 w-full -rotate-12 bg-white/80" />
        <div className="absolute left-1/4 top-0 h-full w-2 rotate-12 bg-white/80" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-black text-[#087D7D] shadow-sm">
          Current location
        </span>
        <span className="absolute bottom-5 left-6 grid h-10 w-10 place-items-center rounded-full border-4 border-white bg-[#1AA6A6] text-xs font-black text-white shadow-lg">
          You
        </span>
        <span className="absolute bottom-12 left-14 h-1 w-40 -rotate-12 rounded-full bg-[#FF8A00]" />
        {facilities.slice(0, 4).map((facility, index) => {
          const isSelected = facility.id === selectedFacility.id;
          return (
            <button
              className={`absolute min-w-28 -translate-x-1/2 rounded-2xl px-3 py-2 text-left text-xs font-black shadow-lg transition hover:-translate-y-1 ${isSelected ? 'bg-[#FF8A00] text-white' : 'bg-white text-slate-800'}`}
              key={facility.id}
              style={pinPositions[index]}
              onClick={() => {
                onSelectFacility(facility.id);
                onOpenFacility(facility);
              }}
            >
              <MapPin className={isSelected ? 'text-white' : 'text-[#087D7D]'} size={16} />
              <span className="block">{facility.name.split(' ')[0]}</span>
              <small className={isSelected ? 'text-white/90' : 'text-slate-500'}>{facility.distance} away</small>
            </button>
          );
        })}
      </div>
      <div className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#087D7D]">Selected on map</p>
          <h4 className="mt-1 text-xl font-black text-slate-950">{selectedFacility.name}</h4>
          <p className="mt-1 text-sm text-slate-600">{selectedFacility.distance} away · {selectedFacility.status} · {selectedFacility.hours}</p>
        </div>
        <button className="rounded-full bg-[#1AA6A6] px-5 py-3 text-sm font-black text-white" onClick={() => onOpenFacility(selectedFacility)}>
          Open profile window
        </button>
      </div>
    </article>
  );
}

function FacilityCards({
  title,
  facilities,
  onSelectFacility,
  onOpenFacility,
}: {
  title: string;
  facilities: Facility[];
  onSelectFacility: (id: string) => void;
  onOpenFacility: (facility: Facility) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-black text-slate-950">{title}</h3>
      <div className="grid gap-4">
        {facilities.map((facility) => (
          <button
            className="rounded-3xl border border-teal-100 bg-white p-5 text-left shadow-sm hover:border-[#1AA6A6]"
            key={facility.id}
            onClick={() => {
              onSelectFacility(facility.id);
              onOpenFacility(facility);
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#087D7D]">{facility.type} · {facility.province}</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">{facility.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{facility.distance} away · {facility.rating}/5 patient rating</p>
              </div>
              <span className="rounded-full bg-[#EAF8F8] px-3 py-1 text-xs font-bold text-[#087D7D]">{facility.status}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {facility.services.slice(0, 4).map((service) => <PillTag key={service}>{service}</PillTag>)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FacilityProfile({ facility, onOpenAction }: { facility: Facility; onOpenAction: (panel: ActionPanelContent) => void }) {
  const inventory = medicines.filter((medicine) => medicine.pharmacies.includes(facility.id));
  const actionPanels = {
    call: {
      title: `Call ${facility.name}?`,
      subtitle: 'This would open the phone dialer in the mobile app.',
      items: [`Phone: ${facility.phone}`, 'Confirmation: Cancel | Call', 'Audio calls use the native phone call flow.'],
      primaryAction: 'Call now',
    },
    chat: {
      title: `Chat with ${facility.name}`,
      subtitle: 'In-app messaging window for pharmacy or facility support.',
      items: ['User: Do you have insulin?', 'Provider: Yes, Humulin and Mixtard are available.', 'Prescription upload, read receipts and typing indicator enabled.'],
      primaryAction: 'Send message',
    },
    directions: {
      title: `Navigate to ${facility.name}`,
      subtitle: 'In-app map and route guidance, not a forced external redirect.',
      items: [`Distance remaining: ${facility.distance}`, 'Turn left in 200m', 'Continue 1km', 'Walking, driving and motorcycle routes available.'],
      primaryAction: 'Start navigation',
    },
    book: {
      title: `Book ${facility.name}`,
      subtitle: 'Choose date and time, then confirm before booking.',
      items: ['Calendar: Today, Tomorrow, Friday', 'Times: 09:00, 11:30, 14:00', 'Confirmation prompt appears before final booking.'],
      primaryAction: 'Open booking',
    },
    rx: {
      title: `Upload prescription to ${facility.name}`,
      subtitle: 'Secure prescription upload for review before order or delivery.',
      items: ['Upload photo or PDF', 'Pharmacist reviews medicine request', 'User receives chat update when approved.'],
      primaryAction: 'Upload prescription',
    },
    whatsapp: {
      title: `WhatsApp ${facility.name}`,
      subtitle: 'Open a prepared WhatsApp message for direct support.',
      items: [`WhatsApp number: ${facility.phone}`, `Message: Hello ${facility.name}, I found you on MedSearch Zambia and would like assistance.`, 'External WhatsApp opening is optional; the app keeps in-app chat available.'],
      primaryAction: 'Open WhatsApp',
    },
    share: {
      title: `Share ${facility.name}`,
      subtitle: 'Share this provider profile with a patient, caregiver or family member.',
      items: [`Provider: ${facility.name}`, `${facility.distance} away`, `${facility.status} · ${facility.hours}`],
      primaryAction: 'Share profile',
    },
  } satisfies Record<string, ActionPanelContent>;

  const profileWindows = [
    {
      title: 'Services Offered',
      subtitle: `Patient services at ${facility.name}`,
      items: facility.services.map((service) => `${service} · Available`),
      primaryAction: 'Book service',
    },
    {
      title: 'Contact Details',
      subtitle: 'One-tap contact options.',
      items: [`Phone: ${facility.phone}`, `WhatsApp: ${facility.phone}`, 'Email: support@medsearch.co.zm', 'After-hours line shown when available.'],
      primaryAction: 'Contact provider',
    },
    {
      title: 'Map and Navigation',
      subtitle: 'In-app movement guidance from your current location.',
      items: [`Distance remaining: ${facility.distance}`, 'Walking route available', 'Driving route available', 'Motorcycle route available', `Turn-by-turn directions to ${facility.name}.`],
      primaryAction: 'Start navigation',
    },
    {
      title: facility.type === 'Pharmacy' ? 'Medicines In Stock' : 'Services and Departments',
      subtitle: facility.type === 'Pharmacy' ? 'Search medicines, compare stock and order.' : 'Clinical services and departments available.',
      items: inventory.length
        ? inventory.map((medicine) => `${medicine.name} · ZMW ${medicine.price} · ${medicine.stock} packs`)
        : facility.services.map((service) => `${service} · Open for patient request`),
      primaryAction: facility.type === 'Pharmacy' ? 'Open inventory' : 'View departments',
    },
    {
      title: 'Prices',
      subtitle: 'Transparent patient-facing costs.',
      items: ['Consultation/service price range shown before booking', 'Insurance and NHIMA support shown where available', 'Generic vs brand pricing visible for medicines.'],
      primaryAction: 'View prices',
    },
    {
      title: 'Delivery System',
      subtitle: facility.delivery ? 'Delivery is available for this provider.' : 'Delivery options depend on this provider.',
      items: facility.delivery
        ? ['Delivery fee from ZMW 20', 'Estimated arrival: 45-90 minutes', 'Prescription upload required where needed', 'Driver tracking appears inside MedSearch.']
        : ['Pickup available', 'Delivery request can be sent if provider enables it', 'User receives confirmation before order.'],
      primaryAction: 'Open delivery',
    },
    {
      title: 'Operational Time',
      subtitle: `${facility.status} · ${facility.hours}`,
      items: [`Today: ${facility.hours}`, 'Weekend hours shown where available', 'Public holiday closure notices appear here.'],
      primaryAction: 'View hours',
    },
    {
      title: 'Patient Rating',
      subtitle: `${facility.rating}/5 patient rating`,
      items: ['Fast service', 'Friendly staff', 'Verified patient reviews only', 'Report issue option available.'],
      primaryAction: 'View reviews',
    },
  ] satisfies ActionPanelContent[];

  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#087D7D]">{facility.type} profile</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">{facility.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{facility.distance} away · {facility.hours} · {facility.rating}/5 rating</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {facility.verified && <PillTag>Verified provider</PillTag>}
          {facility.delivery && <PillTag>Delivery available</PillTag>}
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-4 lg:grid-cols-7">
        <ActionButton icon={Phone} label="Call" onClick={() => onOpenAction(actionPanels.call)} />
        <ActionButton icon={MessageCircle} label="Chat" onClick={() => onOpenAction(actionPanels.chat)} />
        <ActionButton icon={MessageCircle} label="WhatsApp" onClick={() => onOpenAction(actionPanels.whatsapp)} />
        <ActionButton icon={MapPin} label="Directions" onClick={() => onOpenAction(actionPanels.directions)} />
        <ActionButton icon={CalendarDays} label="Book" onClick={() => onOpenAction(actionPanels.book)} />
        <ActionButton icon={Upload} label="Upload Rx" onClick={() => onOpenAction(actionPanels.rx)} />
        <ActionButton icon={ChevronRight} label="Share" onClick={() => onOpenAction(actionPanels.share)} />
      </div>
      <div className="mt-5">
        <h3 className="text-lg font-black text-slate-950">Choose one option</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {profileWindows.map((panel) => (
            <button
              className="rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-[#EAF8F8]"
              key={panel.title}
              onClick={() => onOpenAction(panel)}
            >
              <strong className="text-slate-950">{panel.title}</strong>
              <p className="mt-1 text-sm text-slate-600">{panel.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

function Inventory({
  title,
  medicines,
  onAddToCart,
  onOpenAction,
}: {
  title: string;
  medicines: Medicine[];
  onAddToCart: (id: string) => void;
  onOpenAction: (panel: ActionPanelContent) => void;
}) {
  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-black text-slate-950">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {medicines.map((medicine) => (
          <MedicineCard medicine={medicine} key={medicine.id} onAddToCart={onAddToCart} onOpenAction={onOpenAction} />
        ))}
      </div>
    </article>
  );
}

function Medicines({
  medicines,
  selectedMedicine,
  onSelectMedicine,
  onAddToCart,
  onNavigate,
  onOpenMedicine,
  onOpenAction,
}: {
  medicines: Medicine[];
  selectedMedicine: Medicine;
  onSelectMedicine: (id: string) => void;
  onAddToCart: (id: string) => void;
  onNavigate: (module: ModuleId) => void;
  onOpenMedicine: (medicine: Medicine) => void;
  onOpenAction: (panel: ActionPanelContent) => void;
}) {
  const categories = ['All', ...Array.from(new Set(medicines.map((medicine) => medicine.category)))];
  const brands = ['All', 'Denk', 'Shalina', 'Yashi', 'NovoCare'];
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const visibleMedicines = medicines.filter((medicine) =>
    (category === 'All' || medicine.category === category) && (brand === 'All' || medicine.brand === brand),
  );
  const stockFacilities = facilities.filter((facility) => selectedMedicine.pharmacies.includes(facility.id));

  return (
    <section className="space-y-5">
      <SectionHeader title="Medication marketplace" subtitle="Search by medicine name, generic name, category or brand such as Denk, Shalina and Yashi." />
      <FilterRow values={categories} active={category} onChange={setCategory} />
      <FilterRow values={brands} active={brand} onChange={setBrand} />
      <div className="grid gap-4 md:grid-cols-2">
        {visibleMedicines.map((medicine) => (
          <button className="text-left" key={medicine.id} onClick={() => {
            onSelectMedicine(medicine.id);
            onOpenMedicine(medicine);
          }}>
            <MedicineCard medicine={medicine} onAddToCart={onAddToCart} onOpenAction={onOpenAction} />
          </button>
        ))}
      </div>
      <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black text-slate-950">{selectedMedicine.name}</h3>
        <p className="mt-2 text-sm text-slate-600">{selectedMedicine.description}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <InfoTile label="Generic" value={selectedMedicine.generic} />
          <InfoTile label="Brand" value={selectedMedicine.brand} />
          <InfoTile label="Price" value={`ZMW ${selectedMedicine.price}`} />
        </div>
        <h4 className="mt-5 font-black">Pharmacies with stock</h4>
        <div className="mt-3 grid gap-3">
          {stockFacilities.map((facility) => (
            <button className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-left" key={facility.id} onClick={() => onOpenAction({
              title: `${facility.name} stock window`,
              subtitle: `${selectedMedicine.name} is available at ${facility.name}.`,
              items: [
                `${facility.distance} away · ${facility.status}`,
                `Price: ZMW ${selectedMedicine.price}`,
                `Stock: ${selectedMedicine.stock} packs in catalogue`,
                'Next action can open pharmacy profile, directions, chat or checkout.',
              ],
              primaryAction: 'Open pharmacy profile',
            })}>
              <span><strong>{facility.name}</strong><br /><small>{facility.distance} · {facility.status}</small></span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-full bg-[#1AA6A6] px-5 py-3 font-bold text-white" onClick={() => {
            onAddToCart(selectedMedicine.id);
            onOpenAction({
              title: `${selectedMedicine.name} added to cart`,
              subtitle: 'Cart confirmation window.',
              items: [`Medicine: ${selectedMedicine.name}`, `Price: ZMW ${selectedMedicine.price}`, 'Quantity and delivery can be adjusted before checkout.'],
              primaryAction: 'Open cart',
            });
          }}>
            Add to Cart
          </button>
          <button
            className="rounded-full bg-[#FF8A00] px-5 py-3 font-bold text-white"
            onClick={() => onOpenAction({
              title: `Buy ${selectedMedicine.name}`,
              subtitle: 'Checkout flow for medicine order.',
              items: [`Medicine: ${selectedMedicine.name}`, `Price: ZMW ${selectedMedicine.price}`, 'Delivery or pickup choice', 'Payment confirmation before order is submitted.'],
              primaryAction: 'Proceed to checkout',
            })}
          >
            Buy Now
          </button>
        </div>
      </article>
    </section>
  );
}

function MedicineCard({
  medicine,
  onAddToCart,
  onOpenAction,
}: {
  medicine: Medicine;
  onAddToCart: (id: string) => void;
  onOpenAction?: (panel: ActionPanelContent) => void;
}) {
  return (
    <article className="h-full rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-[#EAF8F8] text-[#087D7D]">
          <Pill size={34} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#087D7D]">{medicine.brand}</p>
          <h3 className="text-lg font-black text-slate-950">{medicine.name}</h3>
          <p className="text-sm text-slate-500">{medicine.generic} · {medicine.category}</p>
          <p className="mt-2 font-black text-slate-950">ZMW {medicine.price}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-3">
        <span className="text-sm font-bold text-slate-600">{medicine.stock} in stock</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${medicine.prescription ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {medicine.prescription ? 'Prescription Required' : 'Available'}
        </span>
      </div>
      <button className="mt-4 w-full rounded-full bg-[#1AA6A6] px-4 py-3 font-bold text-white" onClick={(event) => {
        event.stopPropagation();
        onAddToCart(medicine.id);
        onOpenAction?.({
          title: medicine.prescription ? `Upload prescription for ${medicine.name}` : `${medicine.name} added to cart`,
          subtitle: medicine.prescription ? 'Prescription review window.' : 'Cart confirmation window.',
          items: medicine.prescription
            ? ['Upload prescription photo or PDF', 'Pharmacist reviews before checkout', 'Chat opens after review if clarification is needed.']
            : [`Medicine: ${medicine.name}`, `Price: ZMW ${medicine.price}`, 'Quantity can be adjusted in the cart.'],
          primaryAction: medicine.prescription ? 'Upload prescription' : 'Open cart',
        });
      }}>
        {medicine.prescription ? 'Upload Prescription' : 'Add to Cart'}
      </button>
    </article>
  );
}

function Services({
  selectedService,
  onSelectService,
  onSelectFacility,
  onNavigate,
  onOpenFacility,
  onOpenAction,
}: {
  selectedService: string;
  onSelectService: (service: string) => void;
  onSelectFacility: (id: string) => void;
  onNavigate: (module: ModuleId) => void;
  onOpenFacility: (facility: Facility) => void;
  onOpenAction: (panel: ActionPanelContent) => void;
}) {
  const selected = selectedService.toLowerCase();
  const serviceKeywords = selected.includes('telemedicine')
    ? ['telemedicine']
    : selected.includes('laboratory') || selected.includes('blood') || selected.includes('hiv') || selected.includes('covid') || selected.includes('tb')
      ? ['lab', 'blood', 'hiv', 'covid', 'tb', 'malaria']
      : selected.includes('x-ray') || selected.includes('radiology')
        ? ['x-ray']
        : selected.includes('prescription') || selected.includes('medicine') || selected.includes('chronic') || selected.includes('medication')
          ? ['prescription', 'medicine', 'chronic', 'delivery', 'review']
          : selected.includes('general') || selected.includes('child') || selected.includes('maternal')
            ? ['consultation', 'child', 'maternal']
            : [];

  const offeringFacilities = facilities.filter((facility) => {
    if (selected.includes('appointment')) return true;
    const facilityServices = facility.services.join(' ').toLowerCase();
    return serviceKeywords.some((keyword) => facilityServices.includes(keyword));
  });

  return (
    <section className="space-y-5">
      <SectionHeader title="Medical Services" subtitle="Choose a service category, then see facilities offering that service with distance, status and booking actions." />
      <div className="grid gap-4 md:grid-cols-2">
        {serviceCategories.map((category) => (
          <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={category.title}>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF8F8] text-[#087D7D]"><ClipboardPlus size={24} /></span>
              <h3 className="text-lg font-black text-slate-950">{category.title}</h3>
            </div>
            <div className="mt-4 space-y-2">
              {category.services.map((service) => (
                <button
                  className={`flex w-full items-center justify-between rounded-2xl p-3 text-left text-sm font-bold ${selectedService === service ? 'bg-[#1AA6A6] text-white' : 'bg-slate-50 text-slate-700'}`}
                  key={service}
                  onClick={() => {
                    onSelectService(service);
                    onOpenAction({
                      title: service,
                      subtitle: 'Service information before choosing a facility.',
                      items: ['Short description shown to the patient', 'Price range displayed before facility list', 'Tap a facility to open profile, booking, call or directions.'],
                      primaryAction: 'Find facilities',
                    });
                  }}
                >
                  {service}
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black">Facilities offering {selectedService}</h3>
        <p className="mt-2 text-sm text-slate-600">Price varies by facility. Tap a facility to open its profile.</p>
        <div className="mt-4 grid gap-3">
          {offeringFacilities.slice(0, 4).map((facility) => (
            <button className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-left" key={facility.id} onClick={() => {
              onSelectFacility(facility.id);
              onOpenFacility(facility);
            }}>
              <span><strong>{facility.name}</strong><br /><small>{facility.distance} · {facility.rating}/5 · {facility.status}</small></span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#087D7D]">Book</span>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}

function Community({ activeTab, onTabChange, onOpenAction }: { activeTab: string; onTabChange: (tab: string) => void; onOpenAction: (panel: ActionPanelContent) => void }) {
  const posts = [
    ['Maternity Tour', 'Levy Mwanawasa Hospital', '2:45 video', '25 Likes', '14 Comments'],
    ['How to Use an Inhaler', 'Fine Pharmacy', '60 second health tip', '41 Likes', '22 Comments'],
    ['Managing Hypertension', 'Dr. Mwansa', 'Live Q&A Friday 19:00', '58 Likes', '20 Comments'],
  ];
  const tabs = ['Feed', 'Health Questions', 'Videos', 'Groups', 'Events', 'Alerts'];
  const questionCards = [
    ['Where can I find insulin near me?', 'Answered by 2 verified pharmacists', 'Fine Pharmacy and Medlink Pharmacy have insulin in stock.'],
    ['Is cough syrup safe during pregnancy?', 'Waiting for verified answer', 'A pharmacist or doctor should review the exact product first.'],
    ['Which hospital has X-ray today?', 'Answered by Medsearch Partner Hospital', 'X-ray is available today from 08:00 to 18:00.'],
  ];
  const eventCards = [
    ['Free Cervical Cancer Screening', 'UTH Women & Newborn Hospital · June 12', 'Register'],
    ['Ask a Pharmacist Live Q&A', 'Fine Pharmacy · Friday 19:00', 'Join Session'],
    ['Blood Pressure Awareness Week', 'Lusaka clinics · July 20', 'Attend'],
  ];
  const alertCards = [
    ['Cholera Alert', 'New prevention guidance for selected Lusaka communities', 'View alert'],
    ['Medicine Recall Notice', 'Check product batch before use', 'Check batch'],
    ['Malaria Surge', 'Find testing and treatment facilities near you', 'Find services'],
  ];

  return (
    <section className="space-y-5">
      <SectionHeader title="Healthcare Community" subtitle="A healthcare social network for trusted posts, comments, videos, groups, events and alerts." />
      <FilterRow values={tabs} active={activeTab} onChange={onTabChange} />
      {activeTab === 'Health Questions' ? (
        <div className="grid gap-4">
          {questionCards.map(([question, status, answer]) => (
            <button
              className="rounded-3xl border border-teal-100 bg-white p-5 text-left shadow-sm hover:border-[#1AA6A6]"
              key={question}
              onClick={() => onOpenAction({
                title: question,
                subtitle: status,
                items: [answer, 'Only verified health workers and facilities can answer as providers.', 'Patients can like, comment, save and follow the provider.'],
                primaryAction: 'Open answers',
              })}
            >
              <h3 className="text-lg font-black text-slate-950">{question}</h3>
              <p className="mt-2 text-sm text-slate-600">{status}</p>
            </button>
          ))}
        </div>
      ) : activeTab === 'Groups' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {['Diabetes Community', 'Hypertension Community', 'Maternal Health Community', 'Mental Health Community'].map((group, index) => (
            <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={group}>
              <h3 className="text-lg font-black">{group}</h3>
              <p className="mt-2 text-sm text-slate-600">{[12000, 8500, 6000, 4500][index].toLocaleString()} members</p>
              <button
                className="mt-4 rounded-full bg-[#1AA6A6] px-4 py-2 text-sm font-bold text-white"
                onClick={() => onOpenAction({
                  title: group,
                  subtitle: 'Community group window.',
                  items: ['Post a question', 'Read provider updates', 'Follow verified professionals', 'Receive group notifications.'],
                  primaryAction: 'Join group',
                })}
              >
                Join Group
              </button>
            </article>
          ))}
        </div>
      ) : activeTab === 'Events' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {eventCards.map(([title, detail, action]) => (
            <button
              className="rounded-3xl border border-teal-100 bg-white p-5 text-left shadow-sm hover:border-[#1AA6A6]"
              key={title}
              onClick={() => onOpenAction({
                title,
                subtitle: detail,
                items: ['Calendar reminder available', 'Location and provider profile can be opened', 'Registration confirmation appears before saving.'],
                primaryAction: action,
              })}
            >
              <CalendarDays className="text-[#087D7D]" size={26} />
              <h3 className="mt-3 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{detail}</p>
            </button>
          ))}
        </div>
      ) : activeTab === 'Alerts' ? (
        <div className="grid gap-4">
          {alertCards.map(([title, detail, action]) => (
            <button
              className="rounded-3xl border border-orange-100 bg-white p-5 text-left shadow-sm hover:border-[#FF8A00]"
              key={title}
              onClick={() => onOpenAction({
                title,
                subtitle: detail,
                items: ['Location-based public health notice', 'Trusted provider guidance only', 'Nearby services and saved notification options available.'],
                primaryAction: action,
              })}
            >
              <p className="text-sm font-black uppercase tracking-wide text-[#FF8A00]">Health alert</p>
              <h3 className="mt-2 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{detail}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map(([title, author, detail, likes, comments]) => (
            <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={title}>
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF8F8] text-[#087D7D]"><Video size={24} /></span>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-950">{title}</h3>
                  <p className="text-sm text-slate-500">{author} · {detail}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[likes, comments, '7 Shares', 'Save', 'Follow'].map((item) => (
                      <button
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
                        key={item}
                        onClick={() => onOpenAction({
                          title: `${item} - ${title}`,
                          subtitle: 'Community engagement window.',
                          items: item.includes('Comments')
                            ? ['Jane: Where can I get this service?', 'Fine Pharmacy: Available at our branch.', 'Dr Mwansa: Thank you for asking.']
                            : ['Action recorded in the community feed', 'User notification updated', 'Provider engagement analytics updated.'],
                          primaryAction: item.includes('Comments') ? 'Add comment' : item,
                        })}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function MedicalProfile({ onOpenAction }: { onOpenAction: (panel: ActionPanelContent) => void }) {
  const profileTiles = [
    ['Last BP check', '128/82 mmHg', '25 May 2026'],
    ['Current medications', '2 active', 'Amlodipine, Salbutamol'],
    ['Allergies', 'Penicillin, Sulpha', 'Shown when sharing'],
    ['Emergency contact', 'John Tembo', '+260 966 222 111'],
    ['Latest 5 records', 'Visits, labs, imaging', 'Synced where consent is available'],
    ['SmartCare Folder', 'National EHR', 'Retrieve visits, labs, prescriptions and referrals'],
  ];

  return (
    <section className="space-y-5">
      <SectionHeader title="My Medical Profile" subtitle="Secure health profile with MedSearch Health ID, vitals, medicines, records, emergency contact and SmartCare folder." />
      <div className="rounded-3xl bg-[#1AA6A6] p-6 text-white shadow-sm">
        <p className="text-white/80">Martha Tembo · 34 years · Female</p>
        <h3 className="mt-2 text-2xl font-black">MSZ-2026-000184</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {['NHIMA Active', 'Phone verified', 'SmartCare consent required', 'PIN / biometric login'].map((item) => (
            <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold" key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {profileTiles.map(([title, value, detail]) => (
          <button
            className="text-left"
            key={title}
            onClick={() => onOpenAction({
              title,
              subtitle: value,
              items: [detail, 'PIN or biometric check required for sensitive data', 'Share with provider only after patient consent.'],
              primaryAction: title.includes('SmartCare') ? 'Request SmartCare sync' : 'Open details',
            })}
          >
            <InfoTile label={title} value={value} detail={detail} />
          </button>
        ))}
      </div>
    </section>
  );
}

function Accounts({
  accountType,
  loggedInAccount,
  onAccountTypeChange,
  onLogin,
  onNavigate,
  onOpenAction,
}: {
  accountType: AccountType;
  loggedInAccount: AccountType | null;
  onAccountTypeChange: (type: AccountType) => void;
  onLogin: (type: AccountType) => void;
  onNavigate: (module: ModuleId) => void;
  onOpenAction: (panel: ActionPanelContent) => void;
}) {
  const selected = accounts.find((account) => account.id === accountType) ?? accounts[0];
  const Icon = selected.icon;

  return (
    <section className="space-y-5">
      <SectionHeader title="Login and account types" subtitle="Click an account type to demo-login and see what that role can do." />
      <div className="grid gap-4 md:grid-cols-3">
        {accounts.map((account) => (
          <button
            className={`rounded-3xl border p-5 text-left shadow-sm ${account.id === accountType ? 'border-[#1AA6A6] bg-[#EAF8F8]' : 'border-teal-100 bg-white'}`}
            key={account.id}
            onClick={() => {
              onAccountTypeChange(account.id);
              onLogin(account.id);
              onOpenAction({
                title: `${account.title} login preview`,
                subtitle: account.summary,
                items: [
                  `Registration fields: ${account.fields.join(', ')}`,
                  `Allowed actions: ${account.permissions.join(', ')}`,
                  account.id === 'patient' ? 'Public users can browse, book, buy OTC medicines and comment.' : 'Verification is required before provider-facing features go live.',
                ],
                primaryAction: `Continue as ${account.title}`,
              });
            }}
          >
            <account.icon className="text-[#087D7D]" size={28} />
            <strong className="mt-4 block text-slate-950">{account.title}</strong>
            <p className="mt-2 text-sm text-slate-600">{account.summary}</p>
            <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-[#087D7D]">
              Demo login
            </span>
          </button>
        ))}
      </div>
      <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF8F8] text-[#087D7D]"><Icon size={28} /></span>
          <div>
            <h3 className="text-xl font-black text-slate-950">{selected.title}</h3>
            <p className="text-sm text-slate-500">Verification status appears after signup where required.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <InfoList title="Registration fields" items={selected.fields} />
          <InfoList title="Allowed actions" items={selected.permissions} />
        </div>
        <button className="mt-5 rounded-full bg-[#FF8A00] px-5 py-3 font-bold text-white" onClick={() => {
          onLogin(selected.id);
          onOpenAction({
            title: `${selected.title} session opened`,
            subtitle: 'Demo account workspace is now active.',
            items: ['Role-based menu is loaded', 'Permissions are applied for this account type', 'Next clicks open the relevant module or role window.'],
            primaryAction: 'Open workspace',
          });
        }}>
          Continue as {selected.title}
        </button>
      </article>
      {loggedInAccount && <RoleWorkspace accountType={loggedInAccount} onNavigate={onNavigate} onOpenAction={onOpenAction} />}
    </section>
  );
}

function RoleWorkspace({
  accountType,
  onNavigate,
  onOpenAction,
}: {
  accountType: AccountType;
  onNavigate: (module: ModuleId) => void;
  onOpenAction: (panel: ActionPanelContent) => void;
}) {
  const workspaces = {
    patient: {
      title: 'Patient workspace',
      subtitle: 'For ordinary users seeking care, medicines, bookings and community access.',
      metrics: ['2 active orders', '4 saved providers', '1 upcoming appointment', 'NHIMA active'],
      actions: [
        'Search hospitals',
        'Search pharmacies',
        'Search doctors',
        'Search medicines',
        'Buy OTC medicines',
        'Book appointments',
        'Use telemedicine',
        'Comment in community',
        'Save favorite providers',
        'Receive notifications',
        'My Medical Profile',
      ],
      restricted: ['Cannot post health education', 'Cannot manage facilities', 'Cannot advertise services'],
    },
    health_worker: {
      title: 'Health worker workspace',
      subtitle: 'For verified professionals such as doctors, pharmacists, nurses and clinical officers.',
      metrics: ['Pending verification', '6 bookings', '18 helpful answers', '4.7 rating'],
      actions: ['Update professional profile', 'Answer health questions', 'Post education article', 'Upload health video', 'Offer teleconsultation', 'View bookings'],
      restricted: ['Cannot manage facility subscriptions', 'Cannot run facility campaigns'],
    },
    facility: {
      title: 'Facility workspace',
      subtitle: 'For hospitals, clinics, pharmacies, laboratories and diagnostic centres.',
      metrics: ['Verified provider', '32 medicine orders', '14 appointments today', 'ZMW 4,800 revenue'],
      actions: ['Manage facility profile', 'Add services', 'Add departments', 'Add staff', 'Manage appointments', 'Manage medicine orders', 'Post campaigns', 'View analytics'],
      restricted: ['Facility actions require license verification before going live'],
    },
  } satisfies Record<AccountType, { title: string; subtitle: string; metrics: string[]; actions: string[]; restricted: string[] }>;

  const workspace = workspaces[accountType];
  const routeForAction = (item: string): ModuleId | null => {
    const text = item.toLowerCase();
    if (text.includes('pharmac')) return 'pharmacy';
    if (text.includes('hospital') || text.includes('doctor')) return 'hospitals';
    if (text.includes('medicine') || text.includes('otc')) return 'medicines';
    if (text.includes('appointment') || text.includes('telemedicine')) return 'services';
    if (text.includes('community') || text.includes('comment')) return 'community';
    if (text.includes('medical profile')) return 'medical-profile';
    return null;
  };

  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#087D7D]">Logged in demo</p>
          <h3 className="mt-1 text-2xl font-black text-slate-950">{workspace.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{workspace.subtitle}</p>
        </div>
        <span className="rounded-full bg-[#EAF8F8] px-4 py-2 text-sm font-black text-[#087D7D]">
          Active session
        </span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {workspace.metrics.map((metric) => (
          <div className="rounded-2xl bg-slate-50 p-4" key={metric}>
            <strong className="text-slate-950">{metric}</strong>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <h4 className="font-black text-slate-950">Workspace actions</h4>
          <div className="mt-3 grid gap-2">
            {workspace.actions.map((item) => (
              <button
                className="flex items-center justify-between rounded-2xl bg-white p-3 text-left text-sm font-bold text-slate-700"
                key={item}
                onClick={() => {
                  const route = accountType === 'patient' ? routeForAction(item) : null;
                  if (route) {
                    onNavigate(route);
                    return;
                  }
                  onOpenAction({
                    title: item,
                    subtitle: `${workspace.title} action window.`,
                    items: ['Open action workspace', 'Show relevant records, forms or approvals', 'Save changes to the correct account role.'],
                    primaryAction: 'Open',
                  });
                }}
              >
                {item}
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>
        <InfoList title="Controls and limits" items={workspace.restricted} />
      </div>
    </article>
  );
}

function AppointmentCard({ facility, onOpenAction }: { facility: Facility; onOpenAction: (panel: ActionPanelContent) => void }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('09:00');

  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-black">Book appointment at {facility.name}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {['Today', 'Tomorrow', 'Friday'].map((date) => (
          <button className={`rounded-2xl p-3 font-bold ${selectedDate === date ? 'bg-[#1AA6A6] text-white' : 'bg-slate-50'}`} key={date} onClick={() => {
            setSelectedDate(date);
            onOpenAction({
              title: `Booking date selected`,
              subtitle: `${facility.name} · ${date}`,
              items: ['Choose a time next', 'Patient can still change the date before confirmation', 'Facility receives booking only after final confirmation.'],
              primaryAction: 'Continue',
            });
          }}>{date}</button>
        ))}
        {['09:00', '11:30', '14:00'].map((time) => (
          <button className={`rounded-2xl p-3 font-bold ${selectedTime === time ? 'bg-[#1AA6A6] text-white' : 'bg-[#EAF8F8] text-[#087D7D]'}`} key={time} onClick={() => {
            setSelectedTime(time);
            onOpenAction({
              title: `Booking time selected`,
              subtitle: `${facility.name} · ${selectedDate} at ${time}`,
              items: ['Review appointment details', 'Confirm before sending to facility', 'Reminder notification appears after confirmation.'],
              primaryAction: 'Review booking',
            });
          }}>{time}</button>
        ))}
      </div>
      <button
        className="mt-4 rounded-full bg-[#FF8A00] px-5 py-3 font-bold text-white"
        onClick={() => onOpenAction({
          title: 'Confirm booking',
          subtitle: `${facility.name} - ${selectedDate} at ${selectedTime}`,
          items: ['Patient confirms appointment details', 'Facility receives booking request', 'Reminder notification scheduled.'],
          primaryAction: 'Confirm appointment',
        })}
      >
        Confirm booking
      </button>
    </article>
  );
}

function CartPanel({
  cart,
  total,
  onUpdateCart,
  onOpenAction,
}: {
  cart: CartItem[];
  total: number;
  onUpdateCart: (medicineId: string, amount: number) => void;
  onOpenAction: (panel: ActionPanelContent) => void;
}) {
  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-slate-950">Shopping cart</h2>
        <ShoppingCart size={20} color={primary} />
      </div>
      {cart.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">No medicines added yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {cart.map((item) => {
            const medicine = medicines.find((entry) => entry.id === item.medicineId);
            if (!medicine) return null;
            return (
              <div className="rounded-2xl bg-slate-50 p-3" key={item.medicineId}>
                <div className="flex items-center justify-between gap-2">
                  <span><strong>{medicine.name}</strong><br /><small>ZMW {medicine.price} each</small></span>
                  <span className="flex items-center gap-2">
                    <button className="rounded-full bg-white p-1" onClick={() => onUpdateCart(item.medicineId, -1)}><Minus size={14} /></button>
                    <strong>{item.quantity}</strong>
                    <button className="rounded-full bg-white p-1" onClick={() => onUpdateCart(item.medicineId, 1)}><Plus size={14} /></button>
                  </span>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between border-t border-slate-100 pt-3 font-black">
            <span>Total</span>
            <span>ZMW {total}</span>
          </div>
          <button
            className="w-full rounded-full bg-[#1AA6A6] px-4 py-3 font-bold text-white"
            onClick={() => onOpenAction({
              title: 'Checkout',
              subtitle: `Total: ZMW ${total}`,
              items: ['Choose delivery or pickup', 'Upload prescription if required', 'Select payment method', 'Confirm order before submission.'],
              primaryAction: 'Place order',
            })}
          >
            Proceed to checkout
          </button>
        </div>
      )}
    </section>
  );
}

function QuickActions({ onNavigate }: { onNavigate: (module: ModuleId) => void }) {
  const actions: Array<[string, ModuleId, typeof Pill]> = [
    ['Refill meds', 'medicines', Pill],
    ['Book consult', 'services', CalendarDays],
    ['Find facility', 'hospitals', MapPin],
    ['Community', 'community', Users],
  ];

  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">Quick actions</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {actions.map(([label, module, Icon]) => (
          <button className="rounded-2xl bg-[#EAF8F8] p-4 text-left font-bold text-[#087D7D]" key={label} onClick={() => onNavigate(module)}>
            <Icon size={22} />
            <span className="mt-3 block text-sm">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CarolineCard({ onNavigate, selectedMedicine, selectedFacility }: { onNavigate: (module: ModuleId) => void; selectedMedicine: Medicine; selectedFacility: Facility }) {
  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1AA6A6] text-white"><MessageCircle size={24} /></span>
        <div><h2 className="font-black text-slate-950">Caroline</h2><p className="text-sm text-slate-500">MedSearch helper</p></div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        I found {selectedMedicine.name} at {selectedMedicine.pharmacies.length} pharmacies. Nearest open provider: {selectedFacility.name}.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-full bg-[#EAF8F8] px-3 py-2 text-xs font-bold text-[#087D7D]" onClick={() => onNavigate('medicines')}>Find medicine</button>
        <button className="rounded-full bg-[#EAF8F8] px-3 py-2 text-xs font-bold text-[#087D7D]" onClick={() => onNavigate('pharmacy')}>Nearest pharmacy</button>
      </div>
    </section>
  );
}

function OrdersSnapshot({ toast }: { toast: string }) {
  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-slate-950">Order status</h2>
        <Bell size={20} color={primary} />
      </div>
      <p className="mt-3 rounded-2xl bg-[#EAF8F8] p-3 text-sm font-bold text-[#087D7D]">{toast}</p>
      <div className="mt-4 space-y-3">
        {[['Confirmed', 'Order received', '72%'], ['Preparing', 'Pharmacy checking stock', '46%'], ['Out for delivery', 'Driver route visible', '24%']].map(([title, detail, width]) => (
          <div key={title}>
            <div className="mb-1 flex justify-between text-sm"><strong>{title}</strong><span className="text-slate-500">{detail}</span></div>
            <div className="h-2 rounded-full bg-slate-100"><span className="block h-2 rounded-full bg-[#1AA6A6]" style={{ width }} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActionPanel({ panel, onClose }: { panel: ActionPanelContent; onClose: () => void }) {
  return (
    <section className="mt-6 rounded-[28px] border border-teal-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#087D7D]">Next window</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">{panel.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{panel.subtitle}</p>
        </div>
        <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="mt-5 grid gap-3">
        {panel.items.map((item) => (
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700" key={item}>
            <BadgeCheck size={18} color={primary} />
            {item}
          </div>
        ))}
      </div>
      {panel.primaryAction && (
        <button className="mt-5 rounded-full bg-[#FF8A00] px-5 py-3 font-bold text-white" onClick={onClose}>
          {panel.primaryAction}
        </button>
      )}
    </section>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
    </div>
  );
}

function FilterRow({ values, active, onChange }: { values: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <button className={`rounded-full px-4 py-2 text-sm font-bold ${active === value ? 'bg-[#1AA6A6] text-white' : 'bg-white text-slate-600'}`} key={value} onClick={() => onChange(value)}>
          {value}
        </button>
      ))}
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h4 className="font-black text-slate-950">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => <li className="flex items-center gap-2 text-sm text-slate-600" key={item}><BadgeCheck size={16} color={primary} />{item}</li>)}
      </ul>
    </div>
  );
}

function InfoTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-[#087D7D]">{label}</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">{value}</h3>
      {detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}
    </article>
  );
}

function PillTag({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{children}</span>;
}

function ActionButton({ icon: Icon, label, onClick }: { icon: typeof MapPin; label: string; onClick: () => void }) {
  return (
    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EAF8F8] px-4 py-2 text-sm font-bold text-[#087D7D]" onClick={onClick}>
      <Icon size={16} />
      {label}
    </button>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
