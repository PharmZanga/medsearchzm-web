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
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

type AccountType = 'patient' | 'health_worker' | 'facility';
type ModuleId = 'home' | 'pharmacy' | 'hospitals' | 'services' | 'medicines' | 'community' | 'medical-profile' | 'accounts';

type Medicine = {
  id: string;
  name: string;
  generic: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
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

type CartItem = { medicineId: string; quantity: number };

const primary = '#1AA6A6';

const medicines: Medicine[] = [
  { id: 'paracetamol', name: 'Paracetamol 500mg', generic: 'Paracetamol', brand: 'Yashi', category: 'Analgesics', price: 35, stock: 120, prescription: false, description: 'Used for pain relief and fever reduction.', pharmacies: ['fine', 'good-life', 'careplus'] },
  { id: 'amoxicillin', name: 'Amoxicillin 500mg', generic: 'Amoxicillin', brand: 'Shalina', category: 'Antibiotics', price: 75, stock: 40, prescription: true, description: 'Antibiotic medicine requiring pharmacist prescription review.', pharmacies: ['fine', 'good-life'] },
  { id: 'amlodipine', name: 'Amlodipine 5mg', generic: 'Amlodipine', brand: 'Denk', category: 'Cardiac', price: 95, stock: 64, prescription: true, description: 'Used for blood pressure control when prescribed by a clinician.', pharmacies: ['fine', 'medlink'] },
  { id: 'metformin', name: 'Metformin 500mg', generic: 'Metformin', brand: 'Denk', category: 'Diabetes', price: 85, stock: 52, prescription: true, description: 'Diabetes medicine used as directed by a healthcare provider.', pharmacies: ['good-life', 'careplus'] },
  { id: 'cough-syrup', name: 'Chesty Cough Syrup', generic: 'Cough suppressant', brand: 'Yashi', category: 'Respiratory', price: 35, stock: 18, prescription: false, description: 'Used for cough relief and respiratory symptoms.', pharmacies: ['fine', 'careplus'] },
  { id: 'insulin', name: 'Mixtard Insulin', generic: 'Human insulin', brand: 'NovoCare', category: 'Diabetes', price: 210, stock: 9, prescription: true, description: 'Cold-chain insulin product. Prescription and counselling required.', pharmacies: ['medlink'] },
];

const facilities: Facility[] = [
  { id: 'fine', name: 'Fine Pharmacy', type: 'Pharmacy', province: 'Lusaka', distance: '1.2 km', status: 'Open Now', rating: '4.8', verified: true, delivery: true, services: ['Prescription filling', 'Blood pressure check', 'Medication delivery', 'Ask pharmacist'], phone: '+260978000000', hours: '08:00 - 22:00' },
  { id: 'good-life', name: 'Good Life Pharmacy', type: 'Pharmacy', province: 'Lusaka', distance: '3.4 km', status: 'Open Now', rating: '4.5', verified: true, delivery: true, services: ['Prescription review', 'Chronic refill', 'Medication delivery'], phone: '+260977103220', hours: '08:00 - 20:00' },
  { id: 'careplus', name: 'CarePlus Pharmacy', type: 'Pharmacy', province: 'Lusaka', distance: '6.8 km', status: 'Open Now', rating: '4.6', verified: true, delivery: false, services: ['Women health', 'Children medicines', 'Blood sugar test'], phone: '+260955882771', hours: '09:00 - 19:00' },
  { id: 'medlink', name: 'Medlink Pharmacy', type: 'Pharmacy', province: 'Lusaka', distance: '4.1 km', status: 'Closing Soon', rating: '4.3', verified: true, delivery: true, services: ['Insurance support', 'Chronic medication refill', 'Cold-chain medicines'], phone: '+260966222111', hours: '08:00 - 18:00' },
  { id: 'partner-hospital', name: 'Medsearch Partner Hospital', type: 'Hospital', province: 'Lusaka', distance: '4.9 km', status: 'Open Now', rating: '4.8', verified: true, services: ['X-ray', 'Lab tests', 'Telemedicine', 'Emergency assessment'], phone: '+260211000101', hours: '24 hours' },
  { id: 'bert-clinic', name: 'Bert Clinic', type: 'Clinic', province: 'Lusaka', distance: '2.8 km', status: 'Hours TBC', rating: '4.2', verified: false, services: ['General consultation', 'Child health', 'Vitals monitoring'], phone: '+260211000102', hours: '08:00 - 17:00' },
  { id: 'care-lab', name: 'CarePlus Laboratory', type: 'Laboratory', province: 'Lusaka', distance: '5.6 km', status: 'Open Now', rating: '4.4', verified: true, services: ['Blood tests', 'HIV testing', 'Malaria test', 'COVID-19 testing'], phone: '+260211000103', hours: '07:30 - 18:00' },
];

const serviceCategories = [
  { title: 'Patient Services', services: ['Appointment Booking', 'Telemedicine', 'Medical Records Access', 'Medication Reminders', 'General Consultation', 'Maternal Health Services'] },
  { title: 'Clinical & Diagnostic Services', services: ['Laboratory Tests', 'Radiology / Imaging', 'X-ray', 'Blood Tests', 'COVID-19 Testing', 'HIV Testing & Counselling'] },
  { title: 'Pharmacy & Medication Services', services: ['Prescription Filling', 'Medicine Review', 'Chronic Refill', 'Medication Delivery'] },
  { title: 'Wellness & Preventive Care', services: ['Blood Pressure Screening', 'Cancer Screening', 'TB Screening', 'Health Education'] },
];

const accounts = [
  { id: 'patient' as AccountType, title: 'Patient / Public User', icon: UserRound, summary: 'Search, book, buy OTC medicines, save providers and receive notifications.', fields: ['Full name', 'NRC or passport', 'Phone OTP', 'Date of birth', 'Gender'], permissions: ['Comment', 'Like', 'Share', 'Save providers'] },
  { id: 'health_worker' as AccountType, title: 'Health Worker', icon: Stethoscope, summary: 'Create a professional profile, post education, answer questions and offer consultations.', fields: ['Profession', 'Registration number', 'Specialty', 'Facility', 'Years of experience'], permissions: ['Post text', 'Post image', 'Post video', 'Teleconsultations'] },
  { id: 'facility' as AccountType, title: 'Health Facility', icon: Building2, summary: 'Manage a facility profile, appointments, workers, services, orders and campaigns.', fields: ['Facility name', 'Facility type', 'License number', 'Address', 'GPS', 'Operating hours'], permissions: ['Campaigns', 'Analytics', 'Medicine orders', 'Facility content'] },
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
  const [selectedFacilityId, setSelectedFacilityId] = useState('fine');
  const [selectedMedicineId, setSelectedMedicineId] = useState('paracetamol');
  const [selectedService, setSelectedService] = useState('Appointment Booking');
  const [communityTab, setCommunityTab] = useState('Feed');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState('Ready');

  const selectedFacility = facilities.find((facility) => facility.id === selectedFacilityId) ?? facilities[0];
  const selectedMedicine = medicines.find((medicine) => medicine.id === selectedMedicineId) ?? medicines[0];
  const filteredMedicines = useMemo(() => medicines.filter((medicine) => [medicine.name, medicine.generic, medicine.brand, medicine.category, medicine.description].join(' ').toLowerCase().includes(query.toLowerCase())), [query]);
  const filteredFacilities = useMemo(() => facilities.filter((facility) => [facility.name, facility.type, facility.province, facility.services.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())), [query]);

  function navigate(module: ModuleId) {
    setActiveModule(module);
    setToast(`Opened ${module === 'home' ? 'home' : module.replace('-', ' ')}`);
  }

  function addToCart(medicineId: string) {
    setCart((items) => {
      const current = items.find((item) => item.medicineId === medicineId);
      if (current) return items.map((item) => item.medicineId === medicineId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { medicineId, quantity: 1 }];
    });
    setToast('Medicine added to cart');
  }

  function updateCart(medicineId: string, amount: number) {
    setCart((items) => items.map((item) => item.medicineId === medicineId ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  }

  const cartTotal = cart.reduce((sum, item) => {
    const medicine = medicines.find((entry) => entry.id === item.medicineId);
    return sum + (medicine?.price ?? 0) * item.quantity;
  }, 0);

  return (
    <main className="min-h-screen bg-[#F6FBFB]">
      <SiteHeader activeModule={activeModule} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onNavigate={navigate} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <Hero onNavigate={navigate} />
          <SearchPanel query={query} onQueryChange={setQuery} />
          {activeModule === 'home' && <HomeModules onNavigate={navigate} />}
          {activeModule === 'pharmacy' && <PharmacyModule facilities={filteredFacilities.filter((facility) => facility.type === 'Pharmacy')} selectedFacility={selectedFacility} onSelectFacility={setSelectedFacilityId} onAddToCart={addToCart} />}
          {activeModule === 'hospitals' && <HospitalsModule facilities={filteredFacilities.filter((facility) => facility.type !== 'Pharmacy')} selectedFacility={selectedFacility} onSelectFacility={setSelectedFacilityId} />}
          {activeModule === 'services' && <Services selectedService={selectedService} onSelectService={setSelectedService} onSelectFacility={setSelectedFacilityId} onNavigate={navigate} />}
          {activeModule === 'medicines' && <Medicines medicines={filteredMedicines} selectedMedicine={selectedMedicine} onSelectMedicine={setSelectedMedicineId} onAddToCart={addToCart} onNavigate={navigate} />}
          {activeModule === 'community' && <Community activeTab={communityTab} onTabChange={setCommunityTab} />}
          {activeModule === 'medical-profile' && <MedicalProfile />}
          {activeModule === 'accounts' && <Accounts accountType={accountType} onAccountTypeChange={setAccountType} />}
        </div>
        <aside className="space-y-5">
          <QuickActions onNavigate={navigate} />
          <CarolineCard onNavigate={navigate} selectedMedicine={selectedMedicine} selectedFacility={selectedFacility} />
          <CartPanel cart={cart} total={cartTotal} onUpdateCart={updateCart} />
          <OrdersSnapshot toast={toast} />
        </aside>
      </section>
    </main>
  );
}

function SiteHeader({ activeModule, cartCount, onNavigate }: { activeModule: ModuleId; cartCount: number; onNavigate: (module: ModuleId) => void }) {
  const navItems: ModuleId[] = ['pharmacy', 'hospitals', 'services', 'medicines', 'community', 'accounts'];
  return (
    <header className="sticky top-0 z-30 border-b border-teal-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <button className="flex items-center gap-3 text-left" onClick={() => onNavigate('home')}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1AA6A6] text-white shadow-sm"><HeartPulse size={24} /></span>
          <span><strong className="block text-lg text-slate-950">MedSearch Zambia</strong><small className="text-slate-500">Digital access to health services</small></span>
        </button>
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => <button className={`rounded-full px-4 py-2 text-sm font-semibold ${activeModule === item ? 'bg-[#EAF8F8] text-[#087D7D]' : 'text-slate-600 hover:bg-slate-100'}`} key={item} onClick={() => onNavigate(item)}>{item === 'accounts' ? 'Accounts' : item === 'medicines' ? 'Medications' : item[0].toUpperCase() + item.slice(1)}</button>)}
        </nav>
        <button className="rounded-full bg-[#FF8A00] px-4 py-2 text-sm font-bold text-white shadow-sm" onClick={() => onNavigate('medicines')}>Cart {cartCount}</button>
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
          <h1 className="max-w-2xl text-3xl font-black leading-tight lg:text-5xl">Website experience matching the MedSearch app workflows.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/86">Search medicines by brand, open facilities, book services, chat, manage cart, and review medical profile tools from the web.</p>
          <div className="mt-6 flex flex-wrap gap-3"><button className="rounded-full bg-white px-5 py-3 font-bold text-[#087D7D]" onClick={() => onNavigate('pharmacy')}>Find a pharmacy</button><button className="rounded-full bg-[#FF8A00] px-5 py-3 font-bold text-white" onClick={() => onNavigate('medical-profile')}>My medical profile</button></div>
        </div>
        <div className="rounded-3xl bg-white/14 p-4"><div className="rounded-2xl bg-white p-4 text-slate-950 shadow-lg"><div className="mb-4 flex items-center justify-between"><strong>Live preview</strong><span className="rounded-full bg-[#EAF8F8] px-3 py-1 text-xs font-bold text-[#087D7D]">Interactive</span></div>{['Fine Pharmacy: profile + stock', 'Services: facilities + booking', 'Community: tabs + actions'].map((item) => <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3" key={item}><span className="h-3 w-3 rounded-full bg-[#1AA6A6]" /><span className="text-sm font-semibold">{item}</span></div>)}</div></div>
      </div>
    </section>
  );
}

function SearchPanel({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  return <label className="my-5 flex items-center gap-3 rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-sm"><Search className="text-slate-400" size={22} /><input className="w-full bg-transparent text-base outline-none" placeholder="Search medicines, brands, pharmacies, hospitals or services" value={query} onChange={(event) => onQueryChange(event.target.value)} /></label>;
}

function HomeModules({ onNavigate }: { onNavigate: (module: ModuleId) => void }) {
  return <section><h2 className="mb-4 text-xl font-black text-slate-950">Main modules</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-3">{modules.map((module) => <button className={`${module.color} min-h-36 rounded-3xl p-5 text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg`} key={module.id} onClick={() => onNavigate(module.id)}><module.icon size={28} /><strong className="mt-5 block text-lg">{module.title}</strong></button>)}</div></section>;
}

function PharmacyModule({ facilities, selectedFacility, onSelectFacility, onAddToCart }: { facilities: Facility[]; selectedFacility: Facility; onSelectFacility: (id: string) => void; onAddToCart: (medicineId: string) => void }) {
  const inventory = medicines.filter((medicine) => medicine.pharmacies.includes(selectedFacility.id));
  return <section className="space-y-5"><SectionHeader title="Pharmacy module" subtitle="Find pharmacies, open profiles, view inventory, chat, call and navigate." /><FacilityCards title="Nearby pharmacies" facilities={facilities} onSelectFacility={onSelectFacility} /><FacilityProfile facility={selectedFacility} /><Inventory title={`${selectedFacility.name} medicines in stock`} medicines={inventory} onAddToCart={onAddToCart} /></section>;
}

function HospitalsModule({ facilities, selectedFacility, onSelectFacility }: { facilities: Facility[]; selectedFacility: Facility; onSelectFacility: (id: string) => void }) {
  return <section className="space-y-5"><SectionHeader title="Health facilities" subtitle="Open facility profiles, services, contact options, appointments and navigation." /><FacilityCards title="Hospitals, clinics and labs" facilities={facilities} onSelectFacility={onSelectFacility} /><FacilityProfile facility={selectedFacility} /><AppointmentCard facility={selectedFacility} /></section>;
}

function FacilityCards({ title, facilities, onSelectFacility }: { title: string; facilities: Facility[]; onSelectFacility: (id: string) => void }) {
  return <div><h3 className="mb-3 text-lg font-black text-slate-950">{title}</h3><div className="grid gap-4">{facilities.map((facility) => <button className="rounded-3xl border border-teal-100 bg-white p-5 text-left shadow-sm hover:border-[#1AA6A6]" key={facility.id} onClick={() => onSelectFacility(facility.id)}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-[#087D7D]">{facility.type} · {facility.province}</p><h3 className="mt-1 text-xl font-black text-slate-950">{facility.name}</h3><p className="mt-2 text-sm text-slate-600">{facility.distance} away · {facility.rating}/5 patient rating</p></div><span className="rounded-full bg-[#EAF8F8] px-3 py-1 text-xs font-bold text-[#087D7D]">{facility.status}</span></div><div className="mt-4 flex flex-wrap gap-2">{facility.services.slice(0, 4).map((service) => <PillTag key={service}>{service}</PillTag>)}</div></button>)}</div></div>;
}

function FacilityProfile({ facility }: { facility: Facility }) {
  return <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-[#087D7D]">{facility.type} profile</p><h2 className="mt-1 text-2xl font-black text-slate-950">{facility.name}</h2><p className="mt-2 text-sm text-slate-600">{facility.distance} away · {facility.hours} · {facility.rating}/5 rating</p></div><div className="flex flex-wrap justify-end gap-2">{facility.verified && <PillTag>Verified provider</PillTag>}{facility.delivery && <PillTag>Delivery available</PillTag>}</div></div><div className="mt-5 grid gap-3 md:grid-cols-5"><ActionButton icon={Phone} label="Call" /><ActionButton icon={MessageCircle} label="Chat" /><ActionButton icon={MapPin} label="Directions" /><ActionButton icon={CalendarDays} label="Book" /><ActionButton icon={Upload} label="Upload Rx" /></div><div className="mt-5 grid gap-4 md:grid-cols-2"><InfoList title="Services offered" items={facility.services} /><InfoList title="Map and movement" items={[`${facility.distance} from current location`, 'Walking route available', 'Driving route available', 'Open in Google Maps optional']} /></div></article>;
}

function Inventory({ title, medicines, onAddToCart }: { title: string; medicines: Medicine[]; onAddToCart: (id: string) => void }) {
  return <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm"><h3 className="mb-4 text-lg font-black text-slate-950">{title}</h3><div className="grid gap-4 md:grid-cols-2">{medicines.map((medicine) => <MedicineCard medicine={medicine} key={medicine.id} onAddToCart={onAddToCart} />)}</div></article>;
}

function Medicines({ medicines, selectedMedicine, onSelectMedicine, onAddToCart, onNavigate }: { medicines: Medicine[]; selectedMedicine: Medicine; onSelectMedicine: (id: string) => void; onAddToCart: (id: string) => void; onNavigate: (module: ModuleId) => void }) {
  const categories = ['All', ...Array.from(new Set(medicines.map((medicine) => medicine.category)))];
  const brands = ['All', 'Denk', 'Shalina', 'Yashi', 'NovoCare'];
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const visibleMedicines = medicines.filter((medicine) => (category === 'All' || medicine.category === category) && (brand === 'All' || medicine.brand === brand));
  const stockFacilities = facilities.filter((facility) => selectedMedicine.pharmacies.includes(facility.id));
  return <section className="space-y-5"><SectionHeader title="Medication marketplace" subtitle="Search by medicine name, generic name, category or brand such as Denk, Shalina and Yashi." /><FilterRow values={categories} active={category} onChange={setCategory} /><FilterRow values={brands} active={brand} onChange={setBrand} /><div className="grid gap-4 md:grid-cols-2">{visibleMedicines.map((medicine) => <button className="text-left" key={medicine.id} onClick={() => onSelectMedicine(medicine.id)}><MedicineCard medicine={medicine} onAddToCart={onAddToCart} /></button>)}</div><article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm"><h3 className="text-xl font-black text-slate-950">{selectedMedicine.name}</h3><p className="mt-2 text-sm text-slate-600">{selectedMedicine.description}</p><div className="mt-4 grid gap-4 md:grid-cols-3"><InfoTile label="Generic" value={selectedMedicine.generic} /><InfoTile label="Brand" value={selectedMedicine.brand} /><InfoTile label="Price" value={`ZMW ${selectedMedicine.price}`} /></div><h4 className="mt-5 font-black">Pharmacies with stock</h4><div className="mt-3 grid gap-3">{stockFacilities.map((facility) => <button className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-left" key={facility.id} onClick={() => onNavigate('pharmacy')}><span><strong>{facility.name}</strong><br /><small>{facility.distance} · {facility.status}</small></span><ChevronRight size={18} /></button>)}</div></article></section>;
}

function MedicineCard({ medicine, onAddToCart }: { medicine: Medicine; onAddToCart: (id: string) => void }) {
  return <article className="h-full rounded-3xl border border-teal-100 bg-white p-5 shadow-sm"><div className="flex gap-4"><div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-[#EAF8F8] text-[#087D7D]"><Pill size={34} /></div><div><p className="text-xs font-black uppercase tracking-wide text-[#087D7D]">{medicine.brand}</p><h3 className="text-lg font-black text-slate-950">{medicine.name}</h3><p className="text-sm text-slate-500">{medicine.generic} · {medicine.category}</p><p className="mt-2 font-black text-slate-950">ZMW {medicine.price}</p></div></div><div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-3"><span className="text-sm font-bold text-slate-600">{medicine.stock} in stock</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${medicine.prescription ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>{medicine.prescription ? 'Prescription Required' : 'Available'}</span></div><button className="mt-4 w-full rounded-full bg-[#1AA6A6] px-4 py-3 font-bold text-white" onClick={(event) => { event.stopPropagation(); onAddToCart(medicine.id); }}>{medicine.prescription ? 'Upload Prescription' : 'Add to Cart'}</button></article>;
}

function Services({ selectedService, onSelectService, onSelectFacility, onNavigate }: { selectedService: string; onSelectService: (service: string) => void; onSelectFacility: (id: string) => void; onNavigate: (module: ModuleId) => void }) {
  const offeringFacilities = facilities.filter((facility) => facility.services.some((service) => service.toLowerCase().includes(selectedService.split(' ')[0].toLowerCase())) || selectedService.includes('Appointment') || selectedService.includes('Telemedicine') || selectedService.includes('Laboratory') || selectedService.includes('X-ray'));
  return <section className="space-y-5"><SectionHeader title="Medical Services" subtitle="Choose a service category, then see facilities offering that service with distance, status and booking actions." /><div className="grid gap-4 md:grid-cols-2">{serviceCategories.map((category) => <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={category.title}><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF8F8] text-[#087D7D]"><ClipboardPlus size={24} /></span><h3 className="text-lg font-black text-slate-950">{category.title}</h3></div><div className="mt-4 space-y-2">{category.services.map((service) => <button className={`flex w-full items-center justify-between rounded-2xl p-3 text-left text-sm font-bold ${selectedService === service ? 'bg-[#1AA6A6] text-white' : 'bg-slate-50 text-slate-700'}`} key={service} onClick={() => onSelectService(service)}>{service}<ChevronRight size={18} /></button>)}</div></article>)}</div><article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm"><h3 className="text-xl font-black">Facilities offering {selectedService}</h3><p className="mt-2 text-sm text-slate-600">Price varies by facility. Tap a facility to open its profile.</p><div className="mt-4 grid gap-3">{offeringFacilities.slice(0, 4).map((facility) => <button className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-left" key={facility.id} onClick={() => { onSelectFacility(facility.id); onNavigate(facility.type === 'Pharmacy' ? 'pharmacy' : 'hospitals'); }}><span><strong>{facility.name}</strong><br /><small>{facility.distance} · {facility.rating}/5 · {facility.status}</small></span><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#087D7D]">Book</span></button>)}</div></article></section>;
}

function Community({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const posts = [['Maternity Tour', 'Levy Mwanawasa Hospital', '2:45 video', '25 Likes', '14 Comments'], ['How to Use an Inhaler', 'Fine Pharmacy', '60 second health tip', '41 Likes', '22 Comments'], ['Managing Hypertension', 'Dr. Mwansa', 'Live Q&A Friday 19:00', '58 Likes', '20 Comments']];
  const tabs = ['Feed', 'Health Questions', 'Videos', 'Groups', 'Events', 'Alerts'];
  return <section className="space-y-5"><SectionHeader title="Healthcare Community" subtitle="A healthcare social network for trusted posts, comments, videos, groups, events and alerts." /><FilterRow values={tabs} active={activeTab} onChange={onTabChange} />{activeTab === 'Groups' ? <div className="grid gap-4 md:grid-cols-2">{['Diabetes Community', 'Hypertension Community', 'Maternal Health Community', 'Mental Health Community'].map((group, index) => <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={group}><h3 className="text-lg font-black">{group}</h3><p className="mt-2 text-sm text-slate-600">{[12000, 8500, 6000, 4500][index].toLocaleString()} members</p><button className="mt-4 rounded-full bg-[#1AA6A6] px-4 py-2 text-sm font-bold text-white">Join Group</button></article>)}</div> : <div className="grid gap-4">{posts.map(([title, author, detail, likes, comments]) => <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm" key={title}><div className="flex items-start gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF8F8] text-[#087D7D]"><Video size={24} /></span><div className="flex-1"><h3 className="text-lg font-black text-slate-950">{title}</h3><p className="text-sm text-slate-500">{author} · {detail}</p><div className="mt-4 flex flex-wrap gap-2">{[likes, comments, '7 Shares', 'Save', 'Follow'].map((item) => <PillTag key={item}>{item}</PillTag>)}</div></div></div></article>)}</div>}</section>;
}

function MedicalProfile() {
  return <section className="space-y-5"><SectionHeader title="My Medical Profile" subtitle="Secure health profile with MedSearch Health ID, vitals, medicines, records, emergency contact and SmartCare folder." /><div className="rounded-3xl bg-[#1AA6A6] p-6 text-white shadow-sm"><p className="text-white/80">Martha Tembo · 34 years · Female</p><h3 className="mt-2 text-2xl font-black">MSZ-2026-000184</h3><div className="mt-4 flex flex-wrap gap-2">{['NHIMA Active', 'Phone verified', 'SmartCare consent required', 'PIN / biometric login'].map((item) => <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold" key={item}>{item}</span>)}</div></div><div className="grid gap-4 md:grid-cols-2">{[['Last BP check', '128/82 mmHg', '25 May 2026'], ['Current medications', '2 active', 'Amlodipine, Salbutamol'], ['Allergies', 'Penicillin, Sulpha', 'Shown when sharing'], ['Emergency contact', 'John Tembo', '+260 966 222 111'], ['Latest 5 records', 'Visits, labs, imaging', 'Synced where consent is available'], ['SmartCare Folder', 'National EHR', 'Retrieve visits, labs, prescriptions and referrals']].map(([title, value, detail]) => <InfoTile key={title} label={title} value={value} detail={detail} />)}</div></section>;
}

function Accounts({ accountType, onAccountTypeChange }: { accountType: AccountType; onAccountTypeChange: (type: AccountType) => void }) {
  const selected = accounts.find((account) => account.id === accountType) ?? accounts[0];
  const Icon = selected.icon;
  return <section className="space-y-5"><SectionHeader title="Login and account types" subtitle="Patients, health workers and facilities receive different menus and permissions after login." /><div className="grid gap-4 md:grid-cols-3">{accounts.map((account) => <button className={`rounded-3xl border p-5 text-left shadow-sm ${account.id === accountType ? 'border-[#1AA6A6] bg-[#EAF8F8]' : 'border-teal-100 bg-white'}`} key={account.id} onClick={() => onAccountTypeChange(account.id)}><account.icon className="text-[#087D7D]" size={28} /><strong className="mt-4 block text-slate-950">{account.title}</strong><p className="mt-2 text-sm text-slate-600">{account.summary}</p></button>)}</div><article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF8F8] text-[#087D7D]"><Icon size={28} /></span><div><h3 className="text-xl font-black text-slate-950">{selected.title}</h3><p className="text-sm text-slate-500">Verification status appears after signup where required.</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><InfoList title="Registration fields" items={selected.fields} /><InfoList title="Allowed actions" items={selected.permissions} /></div><button className="mt-5 rounded-full bg-[#FF8A00] px-5 py-3 font-bold text-white">Continue registration</button></article></section>;
}

function AppointmentCard({ facility }: { facility: Facility }) {
  return <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm"><h3 className="text-lg font-black">Book appointment at {facility.name}</h3><div className="mt-4 grid gap-3 md:grid-cols-3">{['Today', 'Tomorrow', 'Friday', '09:00', '11:30', '14:00'].map((slot) => <button className="rounded-2xl bg-[#EAF8F8] p-3 font-bold text-[#087D7D]" key={slot}>{slot}</button>)}</div><button className="mt-4 rounded-full bg-[#FF8A00] px-5 py-3 font-bold text-white">Confirm booking</button></article>;
}

function CartPanel({ cart, total, onUpdateCart }: { cart: CartItem[]; total: number; onUpdateCart: (medicineId: string, amount: number) => void }) {
  return <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-black text-slate-950">Shopping cart</h2><ShoppingCart size={20} color={primary} /></div>{cart.length === 0 ? <p className="mt-4 text-sm text-slate-600">No medicines added yet.</p> : <div className="mt-4 space-y-3">{cart.map((item) => { const medicine = medicines.find((entry) => entry.id === item.medicineId); if (!medicine) return null; return <div className="rounded-2xl bg-slate-50 p-3" key={item.medicineId}><div className="flex items-center justify-between gap-2"><span><strong>{medicine.name}</strong><br /><small>ZMW {medicine.price} each</small></span><span className="flex items-center gap-2"><button className="rounded-full bg-white p-1" onClick={() => onUpdateCart(item.medicineId, -1)}><Minus size={14} /></button><strong>{item.quantity}</strong><button className="rounded-full bg-white p-1" onClick={() => onUpdateCart(item.medicineId, 1)}><Plus size={14} /></button></span></div></div>; })}<div className="flex justify-between border-t border-slate-100 pt-3 font-black"><span>Total</span><span>ZMW {total}</span></div><button className="w-full rounded-full bg-[#1AA6A6] px-4 py-3 font-bold text-white">Proceed to checkout</button></div>}</section>;
}

function QuickActions({ onNavigate }: { onNavigate: (module: ModuleId) => void }) {
  const actions: Array<[string, ModuleId, LucideIcon]> = [['Refill meds', 'medicines', Pill], ['Book consult', 'services', CalendarDays], ['Find facility', 'hospitals', MapPin], ['Community', 'community', Users]];
  return <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-slate-950">Quick actions</h2><div className="mt-4 grid grid-cols-2 gap-3">{actions.map(([label, module, Icon]) => <button className="rounded-2xl bg-[#EAF8F8] p-4 text-left font-bold text-[#087D7D]" key={label} onClick={() => onNavigate(module)}><Icon size={22} /><span className="mt-3 block text-sm">{label}</span></button>)}</div></section>;
}

function CarolineCard({ onNavigate, selectedMedicine, selectedFacility }: { onNavigate: (module: ModuleId) => void; selectedMedicine: Medicine; selectedFacility: Facility }) {
  return <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1AA6A6] text-white"><MessageCircle size={24} /></span><div><h2 className="font-black text-slate-950">Caroline</h2><p className="text-sm text-slate-500">MedSearch helper</p></div></div><p className="mt-4 text-sm leading-6 text-slate-600">I found {selectedMedicine.name} at {selectedMedicine.pharmacies.length} pharmacies. Nearest open provider: {selectedFacility.name}.</p><div className="mt-4 flex flex-wrap gap-2"><button className="rounded-full bg-[#EAF8F8] px-3 py-2 text-xs font-bold text-[#087D7D]" onClick={() => onNavigate('medicines')}>Find medicine</button><button className="rounded-full bg-[#EAF8F8] px-3 py-2 text-xs font-bold text-[#087D7D]" onClick={() => onNavigate('pharmacy')}>Nearest pharmacy</button></div></section>;
}

function OrdersSnapshot({ toast }: { toast: string }) {
  return <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-black text-slate-950">Order status</h2><Bell size={20} color={primary} /></div><p className="mt-3 rounded-2xl bg-[#EAF8F8] p-3 text-sm font-bold text-[#087D7D]">{toast}</p><div className="mt-4 space-y-3">{[['Confirmed', 'Order received', '72%'], ['Preparing', 'Pharmacy checking stock', '46%'], ['Out for delivery', 'Driver route visible', '24%']].map(([title, detail, width]) => <div key={title}><div className="mb-1 flex justify-between text-sm"><strong>{title}</strong><span className="text-slate-500">{detail}</span></div><div className="h-2 rounded-full bg-slate-100"><span className="block h-2 rounded-full bg-[#1AA6A6]" style={{ width }} /></div></div>)}</div></section>;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <div><h2 className="text-2xl font-black text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p></div>;
}

function FilterRow({ values, active, onChange }: { values: string[]; active: string; onChange: (value: string) => void }) {
  return <div className="flex flex-wrap gap-2">{values.map((value) => <button className={`rounded-full px-4 py-2 text-sm font-bold ${active === value ? 'bg-[#1AA6A6] text-white' : 'bg-white text-slate-600'}`} key={value} onClick={() => onChange(value)}>{value}</button>)}</div>;
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><h4 className="font-black text-slate-950">{title}</h4><ul className="mt-3 space-y-2">{items.map((item) => <li className="flex items-center gap-2 text-sm text-slate-600" key={item}><BadgeCheck size={16} color={primary} />{item}</li>)}</ul></div>;
}

function InfoTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm"><p className="text-sm font-bold text-[#087D7D]">{label}</p><h3 className="mt-1 text-xl font-black text-slate-950">{value}</h3>{detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}</article>;
}

function PillTag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{children}</span>;
}

function ActionButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EAF8F8] px-4 py-2 text-sm font-bold text-[#087D7D]"><Icon size={16} />{label}</button>;
}

createRoot(document.getElementById('root')!).render(<App />);
