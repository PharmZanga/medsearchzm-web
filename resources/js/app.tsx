import {
  Activity,
  BadgeCheck,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardPlus,
  HeartPulse,
  Hospital,
  MapPin,
  MessageCircle,
  Pill,
  Search,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  UserRound,
  Users,
  Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
  name: string;
  generic: string;
  brand: string;
  category: string;
  price: string;
  stock: string;
  prescription: boolean;
};

type Facility = {
  name: string;
  type: string;
  distance: string;
  status: string;
  rating: string;
  services: string[];
};

const primary = '#1AA6A6';

const medicines: Medicine[] = [
  {
    name: 'Paracetamol 500mg',
    generic: 'Paracetamol',
    brand: 'Yashi',
    category: 'Analgesics',
    price: 'ZMW 35',
    stock: '120 packs',
    prescription: false,
  },
  {
    name: 'Amoxicillin 500mg',
    generic: 'Amoxicillin',
    brand: 'Shalina',
    category: 'Antibiotics',
    price: 'ZMW 75',
    stock: '40 packs',
    prescription: true,
  },
  {
    name: 'Amlodipine 5mg',
    generic: 'Amlodipine',
    brand: 'Denk',
    category: 'Cardiac',
    price: 'ZMW 95',
    stock: '64 packs',
    prescription: true,
  },
  {
    name: 'Chesty Cough Syrup',
    generic: 'Cough suppressant',
    brand: 'Yashi',
    category: 'Respiratory',
    price: 'ZMW 35',
    stock: '18 bottles',
    prescription: false,
  },
];

const facilities: Facility[] = [
  {
    name: 'Fine Pharmacy',
    type: 'Pharmacy',
    distance: '1.2 km',
    status: 'Open Now',
    rating: '4.8',
    services: ['Medicine stock', 'Delivery', 'Ask pharmacist'],
  },
  {
    name: 'Good Life Pharmacy',
    type: 'Pharmacy',
    distance: '3.4 km',
    status: 'Open Now',
    rating: '4.5',
    services: ['Prescription review', 'Delivery', 'Chronic refill'],
  },
  {
    name: 'Medsearch Partner Hospital',
    type: 'Hospital',
    distance: '4.9 km',
    status: 'Open Now',
    rating: '4.8',
    services: ['X-ray', 'Lab tests', 'Telemedicine'],
  },
  {
    name: 'Bert Clinic',
    type: 'Clinic',
    distance: '2.8 km',
    status: 'Hours TBC',
    rating: '4.2',
    services: ['General consultation', 'Child health', 'Vitals'],
  },
];

const serviceCategories = [
  {
    title: 'Patient Services',
    services: ['Appointment Booking', 'Telemedicine', 'Medical Records Access', 'Medication Reminders'],
  },
  {
    title: 'Clinical & Diagnostic Services',
    services: ['Laboratory Tests', 'Radiology / Imaging', 'Blood Tests', 'HIV Testing & Counselling'],
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
    fields: ['Full name', 'NRC or passport', 'Phone OTP', 'Date of birth', 'Gender'],
    permissions: ['Comment', 'Like', 'Share', 'Save providers'],
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
];

function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('home');
  const [query, setQuery] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('patient');

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) =>
      [medicine.name, medicine.generic, medicine.brand, medicine.category]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query]);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) =>
      [facility.name, facility.type, facility.services.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-[#F6FBFB]">
      <SiteHeader activeModule={activeModule} onNavigate={setActiveModule} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <Hero onNavigate={setActiveModule} />
          <SearchPanel query={query} onQueryChange={setQuery} />
          {activeModule === 'home' && <HomeModules onNavigate={setActiveModule} />}
          {activeModule === 'pharmacy' && <FacilityList title="Nearby pharmacies" facilities={filteredFacilities.filter((facility) => facility.type === 'Pharmacy')} />}
          {activeModule === 'hospitals' && <FacilityList title="Health facilities" facilities={filteredFacilities.filter((facility) => facility.type !== 'Pharmacy')} />}
          {activeModule === 'services' && <Services />}
          {activeModule === 'medicines' && <Medicines medicines={filteredMedicines} />}
          {activeModule === 'community' && <Community />}
          {activeModule === 'medical-profile' && <MedicalProfile />}
          {activeModule === 'accounts' && <Accounts accountType={accountType} onAccountTypeChange={setAccountType} />}
        </div>
        <aside className="space-y-5">
          <QuickActions onNavigate={setActiveModule} />
          <CarolineCard />
          <OrdersSnapshot />
        </aside>
      </section>
    </main>
  );
}

function SiteHeader({
  activeModule,
  onNavigate,
}: {
  activeModule: ModuleId;
  onNavigate: (module: ModuleId) => void;
}) {
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
          {['pharmacy', 'hospitals', 'services', 'medicines', 'community', 'accounts'].map((item) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold ${activeModule === item ? 'bg-[#EAF8F8] text-[#087D7D]' : 'text-slate-600 hover:bg-slate-100'}`}
              key={item}
              onClick={() => onNavigate(item as ModuleId)}
            >
              {item === 'accounts' ? 'Accounts' : item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
        <button className="rounded-full bg-[#FF8A00] px-4 py-2 text-sm font-bold text-white shadow-sm" onClick={() => onNavigate('accounts')}>
          Sign in
        </button>
      </div>
    </header>
  );
}

function Hero({ onNavigate }: { onNavigate: (module: ModuleId) => void }) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-[#1AA6A6] p-6 text-white shadow-sm lg:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_260px] md:items-center">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-white/16 px-3 py-1 text-sm font-semibold">MedSearch v2.0</p>
          <h1 className="max-w-2xl text-3xl font-black leading-tight lg:text-5xl">
            Find medicines, facilities, health services and trusted community care.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/86">
            A mobile-first healthcare marketplace for Zambia, now replicated into a website experience.
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
              <strong>Today</strong>
              <span className="rounded-full bg-[#EAF8F8] px-3 py-1 text-xs font-bold text-[#087D7D]">Open providers</span>
            </div>
            <div className="space-y-3">
              {['Fine Pharmacy: 1.2 km', 'Hospital services: X-ray', 'Community: 14 new answers'].map((item) => (
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

function FacilityList({ title, facilities }: { title: string; facilities: Facility[] }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-slate-950">{title}</h2>
      <div className="grid gap-4">
        {facilities.map((facility) => (
          <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={facility.name}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#087D7D]">{facility.type}</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">{facility.name}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {facility.distance} away · {facility.rating}/5 patient rating
                </p>
              </div>
              <span className="rounded-full bg-[#EAF8F8] px-3 py-1 text-xs font-bold text-[#087D7D]">{facility.status}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {facility.services.map((service) => (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600" key={service}>
                  {service}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <ActionButton icon={MapPin} label="Directions" />
              <ActionButton icon={MessageCircle} label="Chat" />
              <ActionButton icon={CalendarDays} label="Book" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-slate-950">Medical Services</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {serviceCategories.map((category) => (
          <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={category.title}>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF8F8] text-[#087D7D]">
                <ClipboardPlus size={24} />
              </span>
              <h3 className="text-lg font-black text-slate-950">{category.title}</h3>
            </div>
            <div className="mt-4 space-y-2">
              {category.services.map((service) => (
                <button className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-3 text-left text-sm font-bold text-slate-700" key={service}>
                  {service}
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Medicines({ medicines }: { medicines: Medicine[] }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-slate-950">Medication marketplace</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {medicines.map((medicine) => (
          <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={medicine.name}>
            <div className="flex gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-[#EAF8F8] text-[#087D7D]">
                <Pill size={34} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#087D7D]">{medicine.brand}</p>
                <h3 className="text-lg font-black text-slate-950">{medicine.name}</h3>
                <p className="text-sm text-slate-500">{medicine.generic} · {medicine.category}</p>
                <p className="mt-2 font-black text-slate-950">{medicine.price}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-3">
              <span className="text-sm font-bold text-slate-600">{medicine.stock}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${medicine.prescription ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {medicine.prescription ? 'Prescription Required' : 'Available'}
              </span>
            </div>
            <button className="mt-4 w-full rounded-full bg-[#1AA6A6] px-4 py-3 font-bold text-white">
              {medicine.prescription ? 'Upload Prescription' : 'Add to Cart'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Community() {
  const posts = [
    ['Maternity Tour', 'Levy Mwanawasa Hospital', '2:45 video'],
    ['How to Use an Inhaler', 'Fine Pharmacy', '60 second health tip'],
    ['Managing Hypertension', 'Dr. Mwansa', 'Live Q&A Friday 19:00'],
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-slate-950">Healthcare Community</h2>
      <div className="grid gap-4">
        {posts.map(([title, author, detail]) => (
          <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={title}>
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF8F8] text-[#087D7D]">
                <Video size={24} />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-950">{title}</h3>
                <p className="text-sm text-slate-500">{author} · {detail}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['25 Likes', '14 Comments', '7 Shares', 'Save', 'Follow'].map((item) => (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MedicalProfile() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-slate-950">My Medical Profile</h2>
      <div className="rounded-3xl bg-[#1AA6A6] p-6 text-white shadow-sm">
        <p className="text-white/80">Martha Tembo · 34 years · Female</p>
        <h3 className="mt-2 text-2xl font-black">MSZ-2026-000184</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {['NHIMA Active', 'Phone verified', 'SmartCare consent required'].map((item) => (
            <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold" key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {[
          ['Last BP check', '128/82 mmHg', '25 May 2026'],
          ['Current medications', '2 active', 'Amlodipine, Salbutamol'],
          ['Allergies', 'Penicillin, Sulpha', 'Shown when sharing'],
          ['Emergency contact', 'John Tembo', '+260 966 222 111'],
          ['SmartCare Folder', 'National EHR', 'Visits, labs and prescriptions'],
          ['Share My Health Info', 'QR code', 'For trusted providers'],
        ].map(([title, value, detail]) => (
          <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={title}>
            <p className="text-sm font-bold text-[#087D7D]">{title}</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{value}</h3>
            <p className="mt-1 text-sm text-slate-500">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Accounts({
  accountType,
  onAccountTypeChange,
}: {
  accountType: AccountType;
  onAccountTypeChange: (type: AccountType) => void;
}) {
  const selected = accounts.find((account) => account.id === accountType) ?? accounts[0];
  const Icon = selected.icon;

  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-slate-950">Login and account types</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {accounts.map((account) => (
          <button
            className={`rounded-3xl border p-5 text-left shadow-sm ${account.id === accountType ? 'border-[#1AA6A6] bg-[#EAF8F8]' : 'border-teal-100 bg-white'}`}
            key={account.id}
            onClick={() => onAccountTypeChange(account.id)}
          >
            <account.icon className="text-[#087D7D]" size={28} />
            <strong className="mt-4 block text-slate-950">{account.title}</strong>
            <p className="mt-2 text-sm text-slate-600">{account.summary}</p>
          </button>
        ))}
      </div>
      <article className="mt-5 rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF8F8] text-[#087D7D]">
            <Icon size={28} />
          </span>
          <div>
            <h3 className="text-xl font-black text-slate-950">{selected.title}</h3>
            <p className="text-sm text-slate-500">Verification status appears after signup where required.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <InfoList title="Registration fields" items={selected.fields} />
          <InfoList title="Allowed actions" items={selected.permissions} />
        </div>
        <button className="mt-5 rounded-full bg-[#FF8A00] px-5 py-3 font-bold text-white">Continue registration</button>
      </article>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h4 className="font-black text-slate-950">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li className="flex items-center gap-2 text-sm text-slate-600" key={item}>
            <BadgeCheck size={16} color={primary} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuickActions({ onNavigate }: { onNavigate: (module: ModuleId) => void }) {
  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">Quick actions</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          ['Refill meds', 'medicines', Pill],
          ['Book consult', 'services', CalendarDays],
          ['Find facility', 'hospitals', MapPin],
          ['Emergency', 'services', Activity],
        ].map(([label, module, Icon]) => (
          <button className="rounded-2xl bg-[#EAF8F8] p-4 text-left font-bold text-[#087D7D]" key={label as string} onClick={() => onNavigate(module as ModuleId)}>
            <Icon size={22} />
            <span className="mt-3 block text-sm">{label as string}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CarolineCard() {
  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1AA6A6] text-white">
          <MessageCircle size={24} />
        </span>
        <div>
          <h2 className="font-black text-slate-950">Caroline</h2>
          <p className="text-sm text-slate-500">MedSearch helper</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        I can help find medicines, compare prices, locate nearby providers, and guide you through MedSearch.
      </p>
    </section>
  );
}

function OrdersSnapshot() {
  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-slate-950">Order status</h2>
        <Bell size={20} color={primary} />
      </div>
      <div className="mt-4 space-y-3">
        {[
          ['Confirmed', 'Order received', '72%'],
          ['Preparing', 'Pharmacy checking stock', '46%'],
          ['Out for delivery', 'Driver route visible', '24%'],
        ].map(([title, detail, width]) => (
          <div key={title}>
            <div className="mb-1 flex justify-between text-sm">
              <strong>{title}</strong>
              <span className="text-slate-500">{detail}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <span className="block h-2 rounded-full bg-[#1AA6A6]" style={{ width }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActionButton({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full bg-[#EAF8F8] px-4 py-2 text-sm font-bold text-[#087D7D]">
      <Icon size={16} />
      {label}
    </button>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
