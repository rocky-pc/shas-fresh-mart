import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, CheckCircle2, ChevronDown,
  MapPin, Menu, Minus, Plus, Search, ShieldCheck,
  ShoppingBag, Sparkles, Truck, X, LogIn, LogOut,
  ClipboardList, Phone, PackageCheck, Star, Clock,
  Scale, Utensils, MessageCircle, RefreshCw,
  Trash2, PlusCircle, Eye, EyeOff, Tag,
  AlertCircle, Image, Sliders
} from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';

const DEFAULT_PHONE = '6380723356';

const FALLBACK_IMAGES = {
  fish: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sankara_fish_1.JPG?width=1200',
  prawns: 'https://commons.wikimedia.org/wiki/Special:FilePath/Big_size_Prawns.JPG?width=1200',
  chicken: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85',
  mutton: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85',
  default: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sankara_fish_1.JPG?width=1200'
};

const PRESET_IMAGE_SUGGESTIONS = [
  { name: 'Red Snapper (Sankara)', category: 'fish', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sankara_fish_1.JPG?width=1200' },
  { name: 'King Seer Fish (Vanjiram)', category: 'fish', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vanjiram_fish.JPG?width=1200' },
  { name: 'Silver Anchovies (Nethili)', category: 'fish', url: 'https://fresheatstrial.myshopify.com/cdn/shop/products/Anchovies_4122029675_grande.jpeg?v=1465875143' },
  { name: 'White Pomfret (Vaval)', category: 'fish', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vouvaal_fish.JPG?width=1200' },
  { name: 'Jumbo Tiger Prawns', category: 'prawns', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Big_size_Prawns.JPG?width=1200' },
  { name: 'Fresh Sea Squid (Kadama)', category: 'prawns', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Squid_fish.jpg?width=1200' },
  { name: 'Blue Coastal Crab', category: 'prawns', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sea_Crab_In_Chennai.jpeg?width=1200' },
  { name: 'Farm Fresh Chicken', category: 'chicken', url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=90' },
  { name: 'Prime Mountain Mutton', category: 'mutton', url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=90' }
];

const BUTCHERY_PRESETS = [
  'Medium Curry Cut',
  'Thin Tawa Fry Slices',
  'Include Fish Head',
  'Prawns Deveined & Deshelled',
  'Skinless Biryani Cut',
  'Boneless Cubes'
];

const cats = [
  { id: 'all', label: 'All Royal Cuts', icon: '✦' },
  { id: 'fish', label: 'Fresh Ocean Fish', icon: '🐟' },
  { id: 'prawns', label: 'Prawns & Shellfish', icon: '🦐' },
  { id: 'chicken', label: 'Artisanal Chicken', icon: '🍗' },
  { id: 'mutton', label: 'Prime Mutton', icon: '🥩' }
];

const seed = [
  ['sankara-big', 'Big Sankara (Red Snapper)', 'fish', 500, 'Freshly sourced coastal red snapper — sweet, firm, succulent flakes.', '👑 Bestseller', 'https://commons.wikimedia.org/wiki/Special:FilePath/Sankara_fish_1.JPG?width=1200', 'Ideal for spicy tamarind fish curry & pan bake'],
  ['vanjiram', 'Vanjiram (King Seer Fish)', 'fish', 1200, 'The undisputed ocean king — boneless round cuts, unmatched royal taste.', '💎 Royal Catch', 'https://commons.wikimedia.org/wiki/Special:FilePath/Vanjiram_fish.JPG?width=1200', 'Top choice for classic spicy tawa fry & fish biryani'],
  ['sankara-medium', 'Medium Sankara', 'fish', 430, 'Tender family-size red snapper — cleaned and descaled with perfection.', '✨ Fresh Today', 'https://commons.wikimedia.org/wiki/Special:FilePath/Sankara_fish_2.JPG?width=1200', 'The favorite for daily comforting Meen Kulambu'],
  ['sankara-small', 'Small Sankara', 'fish', 350, 'Sweet morning catch, full of coastal sweetness and delicate tenderness.', 'Value Pick', 'https://commons.wikimedia.org/wiki/Special:FilePath/Sankara_fish_1.JPG?width=1200', 'Crisps delightfully for shallow pan fry'],
  ['paara-medium', 'Medium Paara (Trevally)', 'fish', 450, 'Firm-textured sea trevally — expertly descaled, clean white meat.', '🌊 Dawn Catch', 'https://production.ruralindiaonline.org/uploads/04a_PAL_4326_NR_0c80371e5c.jpg', 'Absorbs rich masala for spicy tawa roast'],
  ['nethili', 'Nethili (Silver Anchovies)', 'fish', 450, 'Gleaming ocean anchovies — head trimmed and gutted on request.', '🔥 Popular', 'https://fresheatstrial.myshopify.com/cdn/shop/products/Anchovies_4122029675_grande.jpeg?v=1465875143', 'Unbeatable for crunchy, golden lemon-pepper fry'],
  ['seela-small', 'Small Seela (Barracuda)', 'fish', 350, 'Wild caught sea barracuda with tender white flakes and mild sweet notes.', 'Daily Fresh', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Barracuda_in_Salem_fish_market.jpg/1280px-Barracuda_in_Salem_fish_market.jpg', 'Superb in rustic village-style fish gravy'],
  ['seela-medium', 'Medium Seela', 'fish', 500, 'Carefully selected prime sea barracuda steaks — thick and meaty.', 'Prime Cut', 'https://commons.wikimedia.org/wiki/Special:FilePath/Barracuda_in_Salem_fish_market.jpg?width=1200', 'Perfect for both curry and shallow fry'],
  ['sura', 'Sura (Baby Shark)', 'fish', 450, 'Pure boneless delicacy — rich in protein, cleaned and cubed.', 'Healthy Choice', 'https://commons.wikimedia.org/wiki/Special:FilePath/Sharks_for_sale.JPG?width=1200', 'Legendary for authentic Sura Puttu & pepper gravy'],
  ['vaval', 'Vaval (White Pomfret)', 'fish', 800, 'Silky, delicate coastal white pomfret with exquisite melt-in-mouth texture.', '👑 Premium', 'https://commons.wikimedia.org/wiki/Special:FilePath/Vouvaal_fish.JPG?width=1200', 'World-class for tandoori & whole shallow pan fry'],
  ['kadama-medium', 'Medium Kadama (Squid)', 'prawns', 480, 'Freshly harvested sea squid — thoroughly cleaned, ink-free white tubes.', 'Ocean Delicacy', 'https://commons.wikimedia.org/wiki/Special:FilePath/Squid_fish.jpg?width=1200', 'Great for calamari rings and spicy dry roast'],
  ['kadama-big', 'Big Jumbo Kadama', 'prawns', 600, 'Thick, succulent calamari rings bursting with natural sea sweetness.', 'Chef Choice', 'https://commons.wikimedia.org/wiki/Special:FilePath/Squid_fish.jpg?width=1200', 'Delicious for spicy pepper masala stuffing'],
  ['prawn-medium', 'Medium Coastal Prawns', 'prawns', 550, 'Juicy coastal prawns — sweet, tender, deveined and deshelled upon wish.', '👑 Bestseller', 'https://commons.wikimedia.org/wiki/Special:FilePath/Big_size_Prawns.JPG?width=1200', 'Classic for prawn thokku, biryani & golden fry'],
  ['prawn-big', 'Big Jumbo Tiger Prawns', 'prawns', 680, 'Imperial-sized sea prawns — meaty, sweet bite worthy of a royal feast.', '💎 Royal Feast', 'https://commons.wikimedia.org/wiki/Special:FilePath/Big_size_Prawns.JPG?width=1200', 'Masterpiece for butter garlic roast & royal pulao'],
  ['crab-medium', 'Medium Coastal Blue Crab', 'prawns', 600, 'Wild blue ocean crab with sweet succulent meat and full intact claws.', 'Seafood Special', 'https://commons.wikimedia.org/wiki/Special:FilePath/Sea_Crab_In_Chennai.jpeg?width=1200', 'The holy grail for fiery Chettinad crab curry'],
  ['chicken', 'Farm Fresh Chicken', 'chicken', 300, 'Tender grain-fed cuts — cleaned with purified RO water, zero antibiotics.', '✨ Fresh Daily', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=90', 'Curry cut, biryani cut or boneless breast on request'],
  ['marinated-chicken', 'Royal Marinated Chicken', 'chicken', 450, 'Dressed cuts infused with freshly roasted coastal spices — ready to cook.', '⚡ Quick Meal', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=90', 'Pan to plate in 15 minutes — aromatic tawa fry'],
  ['mutton', 'Prime Mountain Mutton', 'mutton', 0, 'Tender pasture-grazed mutton — expertly trimmed, succulent cuts.', '👑 Royal Prime', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=90', 'Daily market rates apply — enquire for tender cuts']
].map(([id, name, category, price, desc, tag, image, chefTip]) => ({
  id,
  slug: id,
  name,
  category,
  price,
  unit: 'kg',
  description: desc,
  desc,
  tag,
  image,
  image_url: image,
  chefTip: chefTip || 'Prepared fresh upon your order',
  is_available: true
}));

const DEFAULT_SETTINGS = {
  delivery_charge: 40,
  free_delivery_threshold: 500,
  banner_offer_text: '🔥 ROYAL FRESHNESS: Free Express Delivery on orders above ₹500! Code: FRESH10 for 10% OFF',
  offer_enabled: true,
  offer_code: 'FRESH10',
  offer_discount_percent: 10,
  min_order_for_offer: 799,
  store_open: true,
  contact_phone: DEFAULT_PHONE,
  hero_banner_image: supabaseConfigured ? supabase.storage.from('product-images').getPublicUrl('hero-banner/main').data.publicUrl : ''
};

const RECIPES = [
  {
    id: 'curry',
    title: 'Traditional Meen Kulambu & Spicy Curries',
    desc: 'Firm ocean fish cuts that absorb rich tamarind, coconut, and fiery coastal spices without disintegrating in simmering gravies.',
    tag: 'Spicy Coastal Gravy',
    items: ['sankara-big', 'vanjiram', 'sura', 'seela-medium']
  },
  {
    id: 'fry',
    title: 'Crispy Golden Tawa & Pepper Fry Specials',
    desc: 'Delicate skin and firm meat that caramelizes into a crispy outer crust on cast-iron tawa while remaining juicy inside.',
    tag: 'Crispy Crust & Aroma',
    items: ['nethili', 'vanjiram', 'paara-medium', 'prawn-medium']
  },
  {
    id: 'feast',
    title: 'Royal Biryani & Weekend Family Feasts',
    desc: 'Meaty, succulent prime cuts designed for celebration meals, Chettinad roasts, and fragrant slow-cooked biryanis.',
    tag: 'Grand Feast Selection',
    items: ['chicken', 'prawn-big', 'crab-medium', 'mutton']
  }
];

const FAQS = [
  {
    q: 'How fresh is the catch at Shas Fresh Mart?',
    a: 'Every morning at dawn (4:00 AM), our master procurement team hand-selects the top 10% catch directly at coastal fish landing harbors. All cuts are packed on food-grade crushed ice, 100% formalin-free and ammonia-free, and dispatched directly to your kitchen within hours.'
  },
  {
    q: 'Can I request custom cleaning and cutting preferences?',
    a: 'Yes, custom butchery and cleaning is 100% complimentary! Simply tap our quick-cut tags or write your instructions at checkout (e.g., "Medium curry cut", "Include fish head", "Prawns deveined & deshelled", "Thin fry slices"). Our master butchers prepare every cut with RO-purified water.'
  },
  {
    q: 'How do I place an order and track it?',
    a: 'Add your selected items to your royal bag and click "Proceed to Delivery Details". Enter your address to dispatch the order directly into our live kitchen queue with instant on-screen order confirmation and reference ID.'
  },
  {
    q: 'What are your delivery hours and charges?',
    a: 'We deliver 7 days a week from 6:30 AM to 8:30 PM. Enjoy Free Express Cold-Chain Delivery on orders above ₹500 (or a flat ₹40 fee on smaller baskets), delivered in insulated thermal boxes.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Anand Ramaswamy',
    location: 'Velachery',
    text: 'The Vanjiram slices were firm, crystal fresh, and had zero ammonia or stale odor. Cleaned with surgical precision — my family will never buy seafood anywhere else!',
    item: 'Vanjiram King Fish'
  },
  {
    name: 'Priya Sundaram',
    location: 'Thiruvanmiyur',
    text: 'Ordered Big Jumbo Prawns and Sankara for Sunday lunch. Delivered in 40 minutes in insulated ice packs. The prawns were sweet and plump, cooked to perfection.',
    item: 'Big Jumbo Prawns'
  },
  {
    name: 'Karthik Manikandan',
    location: 'Adyar',
    text: 'Transparent weights, honest rates, and instant online confirmation. The farm chicken was tender and flavorful. Outstanding quality and truly royal service.',
    item: 'Farm Fresh Chicken'
  }
];

const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
const catName = id => cats.find(c => c.id === id)?.label || id;

function playOrderChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (err) {
    // Ignore autoplay restriction errors
  }
}

function Logo({ admin = false }) {
  const [fallback, setFallback] = useState(false);
  return (
    <a
      className="royal-brand"
      href="#home"
      onClick={(e) => {
        if (admin) e.preventDefault();
      }}
    >
      <div className="brand-crest">
        <img
          src={fallback ? '/shas-logo.svg' : '/shas-brand.png'}
          alt="Shas Fresh Mart"
          onError={() => setFallback(true)}
        />
      </div>
      <div className="brand-text">
        <span className="brand-name">SHAS FRESH MART</span>
        <span className="brand-subtitle">{admin ? 'STORE WORKSPACE' : '👑 IMPERIAL FRESHNESS'}</span>
      </div>
    </a>
  );
}

function App() {
  // Storefront & Catalog state
  const [products, setProducts] = useState(seed);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('shas_royal_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [menu, setMenu] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Store Settings (Delivery Charge, Free Delivery Threshold, Promo Offers)
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('shas_store_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [settingsForm, setSettingsForm] = useState(settings);
  const [heroBannerFile, setHeroBannerFile] = useState(null);

  // Customer Checkout Details
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', area: '', notes: '' });
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Admin & Routing state
  const [admin, setAdmin] = useState(window.location.pathname.startsWith('/admin'));
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState('orders');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  // Orders Admin State
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const ordersCountRef = useRef(0);

  // Products Admin State
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('all');
  const [newProductModal, setNewProductModal] = useState(false);
  const [editingImageProduct, setEditingImageProduct] = useState(null);
  const [newProductImageFile, setNewProductImageFile] = useState(null);
  const [editingProductImageFile, setEditingProductImageFile] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'fish',
    price: '',
    unit: 'kg',
    description: '',
    image_url: '',
    is_available: true
  });

  // UI state
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeRecipe, setActiveRecipe] = useState('curry');

  const PHONE = settings.contact_phone || DEFAULT_PHONE;

  // Persist customer cart in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shas_royal_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  // Auto-dismiss toast notifications after 4.5 seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  // Listen for browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setAdmin(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch initial catalog, session, and store settings
  useEffect(() => {
    loadProducts();
    loadSettings();

    if (supabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Real-time polling & sync for Admin Orders
  useEffect(() => {
    if (!admin || !session || !supabaseConfigured) return;

    loadOrders();
    const interval = setInterval(() => {
      loadOrders(true);
    }, 8000);

    const channel = supabase
      .channel('schema-orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders(true);
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [admin, session]);

  async function loadProducts() {
    if (!supabaseConfigured) return;
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
      if (!error && data?.length) {
        setProducts(data.map(p => ({
          ...p,
          price: Number(p.price),
          desc: p.description || '',
          image: seed.find(s => s.id === p.id || s.slug === p.slug || s.name === p.name)?.image || p.image_url || FALLBACK_IMAGES[p.category] || FALLBACK_IMAGES.default,
          chefTip: seed.find(s => s.id === p.id)?.chefTip || 'Prepared fresh upon your order',
          is_available: p.is_available !== false
        })));
      }
    } catch (err) {
      console.warn('Failed to load products:', err);
    }
  }

  async function loadSettings() {
    if (!supabaseConfigured) return;
    try {
      const { data, error } = await supabase.from('store_settings').select('*').eq('id', 'main').maybeSingle();
      if (!error && data) {
        const merged = {
          delivery_charge: Number(data.delivery_charge ?? 40),
          free_delivery_threshold: Number(data.free_delivery_threshold ?? 500),
          banner_offer_text: data.banner_offer_text || DEFAULT_SETTINGS.banner_offer_text,
          offer_enabled: data.offer_enabled !== false,
          offer_code: data.offer_code || 'FRESH10',
          offer_discount_percent: Number(data.offer_discount_percent ?? 10),
          min_order_for_offer: Number(data.min_order_for_offer ?? 799),
          store_open: data.store_open !== false,
          contact_phone: data.contact_phone || DEFAULT_PHONE,
          hero_banner_image: data.hero_banner_image || ''
        };
        setSettings(merged);
        setSettingsForm(merged);
        localStorage.setItem('shas_store_settings', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('store_settings check:', err);
    }
  }

  async function loadOrders(silent = false) {
    if (!supabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) {
        if (!silent) setNotice('Unable to load orders. Check database permissions.');
        return;
      }

      if (data) {
        if (ordersCountRef.current > 0 && data.length > ordersCountRef.current) {
          playOrderChime();
          setNotice(`🔔 New Customer Order received from ${data[0].customer_name}!`);
        }
        ordersCountRef.current = data.length;
        setOrders(data);
      }
    } catch (err) {
      console.warn('loadOrders err:', err);
    }
  }

  async function login(e) {
    e.preventDefault();
    setLoginError('');
    if (!supabaseConfigured) {
      setLoginError('Supabase is not configured yet.');
      return;
    }

    setBusy(true);
    let loginEmail = email.trim();
    if (loginEmail === 'admin' || !loginEmail.includes('@')) {
      loginEmail = 'admin@shasfreshmart.com';
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password.trim()
    });

    if (error) {
      setLoginError(error.message || 'Invalid credentials. Please use admin / admin123');
      setBusy(false);
      return;
    }

    const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
    if (p?.role !== 'admin' && loginEmail !== 'admin@shasfreshmart.com') {
      await supabase.auth.signOut();
      setLoginError('This account does not have store administrator privileges.');
      setBusy(false);
      return;
    }

    setSession(data.session);
    setBusy(false);
    loadOrders();
    loadProducts();
    loadSettings();
  }

  async function logout() {
    if (supabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setOrders([]);
  }

  async function updateOrderStatus(id, newStatus) {
    if (!supabaseConfigured) return;
    const { error } = await supabase.from('orders').update({
      status: newStatus,
      updated_at: new Date().toISOString()
    }).eq('id', id);

    if (error) {
      setNotice('Could not update order status: ' + error.message);
    } else {
      setOrders(old => old.map(o => (o.id === id ? { ...o, status: newStatus } : o)));
      setNotice(`Order status changed to "${newStatus.replace(/_/g, ' ')}"`);
    }
  }

  async function updateProductPrice(id, newPrice) {
    const val = parseFloat(newPrice);
    if (isNaN(val) || val < 0) {
      setNotice('Please enter a valid price amount.');
      return;
    }
    if (!supabaseConfigured) {
      setProducts(old => old.map(p => (p.id === id ? { ...p, price: val } : p)));
      setNotice('Price updated locally.');
      return;
    }
    const { error } = await supabase.from('products').update({
      price: val,
      updated_at: new Date().toISOString()
    }).eq('id', id);

    if (error) {
      setNotice('Could not update price in DB: ' + error.message);
    } else {
      setProducts(old => old.map(p => (p.id === id ? { ...p, price: val } : p)));
      setNotice(`Price updated to ${money(val)}`);
    }
  }

  async function uploadProductImage(file, productId) {
    if (!file) return null;
    if (!file.type || !file.type.startsWith('image/')) throw new Error('Please choose an image file.');
    if (file.size > 8 * 1024 * 1024) throw new Error('Image must be smaller than 8 MB.');
    if (!supabaseConfigured) throw new Error('Image uploads require Supabase Storage.');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = productId + '/' + Date.now() + '.' + ext;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (error) throw new Error(error.message);
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  }

  async function updateProductImage(id, newUrl, imageFile) {
    if (!imageFile && !newUrl?.trim()) return;
    setBusy(true);
    let imageUrl = newUrl?.trim() || '';
    try { if (imageFile) imageUrl = await uploadProductImage(imageFile, id); }
    catch (err) { setBusy(false); setNotice('Image upload failed: ' + err.message); return; }
    if (!supabaseConfigured) {
      setBusy(false);
      setProducts(old => old.map(p => (p.id === id ? { ...p, image_url: imageUrl, image: imageUrl } : p)));
      setEditingImageProduct(null); setEditingProductImageFile(null); return;
    }
    const { error } = await supabase.from('products').update({
      image_url: imageUrl,
      updated_at: new Date().toISOString()
    }).eq('id', id);

    setBusy(false);
    if (error) setNotice('Could not update image in DB: ' + error.message);
    else {
      setProducts(old => old.map(p => (p.id === id ? { ...p, image_url: imageUrl, image: imageUrl } : p)));
      setNotice('Product image updated successfully!'); setEditingImageProduct(null); setEditingProductImageFile(null);
    }
  }

  async function toggleProductAvailability(id, currentStatus) {
    const nextStatus = !currentStatus;
    if (!supabaseConfigured) {
      setProducts(old => old.map(p => (p.id === id ? { ...p, is_available: nextStatus } : p)));
      setNotice(nextStatus ? 'Marked In Stock' : 'Marked Out of Stock');
      return;
    }
    const { error } = await supabase.from('products').update({
      is_available: nextStatus,
      updated_at: new Date().toISOString()
    }).eq('id', id);

    if (error) {
      setNotice('Could not update stock status: ' + error.message);
    } else {
      setProducts(old => old.map(p => (p.id === id ? { ...p, is_available: nextStatus } : p)));
      setNotice(nextStatus ? 'Product is now In Stock!' : 'Product marked Out of Stock!');
    }
  }

  async function deleteProduct(id, name) {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) return;
    if (!supabaseConfigured) {
      setProducts(old => old.filter(p => p.id !== id));
      setNotice(`Product "${name}" deleted.`);
      return;
    }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setNotice('Could not delete product: ' + error.message);
    } else {
      setProducts(old => old.filter(p => p.id !== id));
      setNotice(`Product "${name}" removed from catalog.`);
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      setNotice('Please provide product name and price.');
      return;
    }
    const priceVal = parseFloat(newProduct.price);
    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const id = slug;
    setBusy(true);
    let uploadedImageUrl = newProduct.image_url?.trim() || '';
    try { if (newProductImageFile) uploadedImageUrl = await uploadProductImage(newProductImageFile, id); }
    catch (err) { setBusy(false); setNotice('Image upload failed: ' + err.message); return; }
    const entry = {
      id,
      slug,
      name: newProduct.name.trim(),
      category: newProduct.category,
      price: priceVal,
      unit: newProduct.unit || 'kg',
      description: newProduct.description?.trim() || 'Freshly sourced quality cut.',
      image_url: uploadedImageUrl || FALLBACK_IMAGES[newProduct.category] || FALLBACK_IMAGES.default,
      is_available: newProduct.is_available !== false
    };

    if (supabaseConfigured) {
      const { error } = await supabase.from('products').insert([entry]);
      setBusy(false);
      if (error) {
        setNotice('Could not add product to DB: ' + error.message);
        return;
      }
    } else {
      setBusy(false);
    }

    setProducts(old => [...old, {
      ...entry,
      image: entry.image_url,
      desc: entry.description,
      chefTip: 'Prepared fresh upon your order'
    }]);
    setNotice(`Product "${entry.name}" added successfully to store!`);
    setNewProductModal(false);
    setNewProduct({
      name: '',
      category: 'fish',
      price: '',
      unit: 'kg',
      description: '',
      image_url: '',
      is_available: true
    });
    setNewProductImageFile(null);
  }

  async function saveHeroBanner() {
    if (!heroBannerFile) { setNotice('Choose a banner image first.'); return; }
    setBusy(true);
    try {
      if (!supabaseConfigured) throw new Error('Supabase Storage is not configured.');
      if (!heroBannerFile.type?.startsWith('image/')) throw new Error('Please choose an image file.');
      if (heroBannerFile.size > 8 * 1024 * 1024) throw new Error('Image must be smaller than 8 MB.');
      const { error: uploadError } = await supabase.storage.from('product-images').upload('hero-banner/main', heroBannerFile, { cacheControl: '3600', upsert: true, contentType: heroBannerFile.type });
      if (uploadError) throw uploadError;
      const imageUrl = supabase.storage.from('product-images').getPublicUrl('hero-banner/main').data.publicUrl + '?v=' + Date.now();
      const updated = { ...settingsForm, hero_banner_image: imageUrl };
      setSettingsForm(updated); setSettings(updated);
      localStorage.setItem('shas_store_settings', JSON.stringify(updated));
      setHeroBannerFile(null); setNotice('Main banner image uploaded and published!');
    } catch (err) {
      setNotice('Banner upload failed: ' + (err.message || 'Check product-images Storage permissions and store_settings schema.'));
    } finally { setBusy(false); }
  }

  async function saveSettings(e) {
    if (e) e.preventDefault();
    setBusy(true);
    const updated = {
      ...settingsForm,
      delivery_charge: Number(settingsForm.delivery_charge || 40),
      free_delivery_threshold: Number(settingsForm.free_delivery_threshold || 500),
      offer_discount_percent: Number(settingsForm.offer_discount_percent || 10),
      min_order_for_offer: Number(settingsForm.min_order_for_offer || 799)
    };

    setSettings(updated);
    localStorage.setItem('shas_store_settings', JSON.stringify(updated));

    if (supabaseConfigured) {
      try {
        const { error } = await supabase.from('store_settings').upsert({
          id: 'main',
          ...updated,
          updated_at: new Date().toISOString()
        });
        if (error) {
          setNotice('Settings saved locally! (Run store_settings migration in Supabase SQL editor to sync)');
        } else {
          setNotice('Store settings saved and published live!');
        }
      } catch (err) {
        setNotice('Settings saved locally!');
      }
    } else {
      setNotice('Settings saved locally!');
    }
    setBusy(false);
  }

  // Cart calculations
  const items = useMemo(() => Object.values(cart), [cart]);
  const count = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);

  const deliveryCharge = subtotal >= (settings.free_delivery_threshold || 500) ? 0 : (settings.delivery_charge || 40);
  const discountAmount = (appliedPromo && settings.offer_enabled && subtotal >= (settings.min_order_for_offer || 799))
    ? Math.round((subtotal * (settings.offer_discount_percent || 10)) / 100)
    : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discountAmount);

  const add = p => {
    setCart(old => ({
      ...old,
      [p.id]: { ...p, quantity: (old[p.id]?.quantity || 0) + 1 }
    }));
    setNotice(`Added 1 kg of ${p.name} to your Royal Bag`);
  };

  const qty = (id, d) => {
    setCart(old => {
      const n = { ...old };
      if (!n[id]) return old;
      n[id] = { ...n[id], quantity: n[id].quantity + d };
      if (n[id].quantity <= 0) delete n[id];
      return n;
    });
  };

  const appendCutPreset = (presetText) => {
    setCustomer(prev => {
      const existing = prev.notes.trim();
      if (existing.toLowerCase().includes(presetText.toLowerCase())) return prev;
      return {
        ...prev,
        notes: existing ? `${existing}, ${presetText}` : presetText
      };
    });
  };

  const handleImageError = (e, cat) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGES[cat] || FALLBACK_IMAGES.default;
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (!settings.offer_enabled) {
      setNotice('No promotional offer is currently active.');
      return;
    }
    if (clean !== (settings.offer_code || 'FRESH10').toUpperCase()) {
      setNotice(`Invalid promo code. Use code "${settings.offer_code || 'FRESH10'}" for ${settings.offer_discount_percent}% OFF!`);
      return;
    }
    if (subtotal < (settings.min_order_for_offer || 799)) {
      setNotice(`Code ${clean} requires a minimum order of ${money(settings.min_order_for_offer || 799)}.`);
      return;
    }
    setAppliedPromo(clean);
    setNotice(`🎉 Promo code ${clean} applied! You saved ${money(Math.round((subtotal * settings.offer_discount_percent) / 100))}`);
  };

  async function placeCustomerOrder(e) {
    e.preventDefault();
    if (items.length === 0) {
      setNotice('Your shopping bag is empty.');
      return;
    }
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setNotice('Please provide your name, phone number, and delivery address.');
      return;
    }

    setBusy(true);

    const notesSummary = [
      customer.notes ? `Butchery instructions: ${customer.notes}` : '',
      appliedPromo ? `Promo: ${appliedPromo} (-₹${discountAmount})` : '',
      deliveryCharge === 0 ? 'Free Express Delivery applied' : `Delivery fee: ₹${deliveryCharge}`
    ].filter(Boolean).join(' | ');

    if (!supabaseConfigured) {
      setBusy(false);
      const fakeId = 'SHAS-' + Math.floor(100000 + Math.random() * 900000);
      setConfirmedOrder({
        order_id: fakeId,
        customer: { ...customer },
        items: [...items],
        subtotal,
        deliveryCharge,
        discountAmount,
        total: grandTotal
      });
      setCart({});
      setCheckout(false);
      setCartOpen(false);
      setCustomer({ name: '', phone: '', address: '', area: '', notes: '' });
      setAppliedPromo(null);
      return;
    }

    const { data, error } = await supabase.rpc('place_order', {
      p_customer_name: customer.name.trim(),
      p_phone: customer.phone.trim(),
      p_address: customer.address.trim(),
      p_area: customer.area?.trim() || null,
      p_notes: notesSummary || null,
      p_items: items.map(i => ({ product_id: i.id, quantity: i.quantity }))
    });

    setBusy(false);

    if (error) {
      setNotice('Order placement error: ' + error.message);
      return;
    }

    const orderId = data?.order_id || 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    setConfirmedOrder({
      order_id: orderId,
      customer: { ...customer },
      items: [...items],
      subtotal,
      deliveryCharge,
      discountAmount,
      total: grandTotal
    });

    setCart({});
    setCheckout(false);
    setCartOpen(false);
    setCustomer({ name: '', phone: '', address: '', area: '', notes: '' });
    setAppliedPromo(null);
  }

  const availableProducts = useMemo(() => products.filter(p => p.is_available), [products]);

  const shownProducts = useMemo(() => {
    return availableProducts.filter(p => {
      const matchesCat = category === 'all' || p.category === category;
      const query = search.toLowerCase().trim();
      const matchesSearch = !query || `${p.name} ${p.desc || p.description} ${p.chefTip || ''}`.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [availableProducts, category, search]);

  const shownAdminProducts = products.filter(p => {
    const matchesCat = adminCategoryFilter === 'all' || p.category === adminCategoryFilter;
    const query = adminProductSearch.toLowerCase().trim();
    const matchesSearch = !query || `${p.name} ${p.category} ${p.description || ''}`.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const shownOrders = orders.filter(o => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const query = orderSearch.toLowerCase().trim();
    const matchesQuery = !query ||
      `${o.customer_name} ${o.phone} ${o.address} ${o.id}`.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  // ==========================================================================
  // ADMIN WORKSPACE RENDERING
  // ==========================================================================
  if (admin) {
    if (!session) {
      return (
        <div className="admin-login-page">
          <div className="login-card-luxury">
            <div className="login-crest">
              <img src="/shas-brand.png" alt="Shas Fresh Mart" onError={e => { e.currentTarget.src = '/shas-logo.svg'; }} />
            </div>
            <div className="login-badge">
              <ShieldCheck size={14} /> ADMINISTRATIVE WORKSPACE
            </div>
            <h2>Admin Portal Login</h2>
            <p>Sign in to manage live store orders, edit product pricing & images, configure banner offers and delivery charges.</p>

            <form onSubmit={login}>
              <label>
                Username or Email
                <div className="input-group">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin (or admin@shasfreshmart.com)"
                  />
                </div>
              </label>

              <label>
                Password
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="admin123"
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {loginError && (
                <div className="error-alert">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="login-quick-hint">
                <span>Credentials: <strong>admin</strong> / <strong>admin123</strong></span>
                <button
                  type="button"
                  className="chip-hint"
                  onClick={() => {
                    setEmail('admin');
                    setPassword('admin123');
                  }}
                >
                  Auto-Fill
                </button>
              </div>

              <button className="primary-btn full" type="submit" disabled={busy}>
                {busy ? (
                  <>
                    <RefreshCw className="spin" size={17} /> Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={18} /> Sign In to Admin Workspace
                  </>
                )}
              </button>

              <div className="login-footer">
                <button
                  type="button"
                  className="back-store-btn"
                  onClick={() => {
                    window.history.pushState({}, '', '/');
                    setAdmin(false);
                  }}
                >
                  ← Return to Customer Storefront
                </button>
              </div>
            </form>
          </div>
          {notice && (
            <div className="toast" role="status">
              <span>{notice}</span>
              <button onClick={() => setNotice('')}><X size={15} /></button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <Logo admin />
          <p className="side-caption">STORE WORKSPACE</p>

          <button
            className={tab === 'orders' ? 'side-item selected' : 'side-item'}
            onClick={() => setTab('orders')}
          >
            <ClipboardList size={18} />
            <span>Orders</span>
            {pendingOrdersCount > 0 && <span className="badge-count">{pendingOrdersCount}</span>}
          </button>

          <button
            className={tab === 'products' ? 'side-item selected' : 'side-item'}
            onClick={() => setTab('products')}
          >
            <PackageCheck size={18} />
            <span>Products</span>
          </button>

          <button
            className={tab === 'offers' ? 'side-item selected' : 'side-item'}
            onClick={() => setTab('offers')}
          >
            <Tag size={18} />
            <span>Offers & Banner</span>
          </button>

          <button
            className={tab === 'settings' ? 'side-item selected' : 'side-item'}
            onClick={() => setTab('settings')}
          >
            <Sliders size={18} />
            <span>Delivery & Store</span>
          </button>

          <div className="sidebar-foot">
            <span className="live-dot" /> Connected to Supabase
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setAdmin(false);
              }}
            >
              View Storefront <ArrowRight size={14} />
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-head">
            <div>
              <span className="eyebrow">SHAS FRESH MART ADMIN</span>
              <h1>
                {tab === 'orders' && 'Live Customer Orders'}
                {tab === 'products' && 'Product Catalogue & Inventory'}
                {tab === 'offers' && 'Promotions & Banner Offers'}
                {tab === 'settings' && 'Delivery & Store Operations'}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="outline-btn" onClick={logout}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </header>

          {/* TAB 1: ORDERS DASHBOARD */}
          {tab === 'orders' && (
            <>
              <div className="stats-row">
                <div>
                  <span>Total Orders</span>
                  <strong>{orders.length}</strong>
                  <small>Recorded in Supabase</small>
                </div>
                <div>
                  <span>Pending Attention</span>
                  <strong style={{ color: '#fbbf24' }}>{pendingOrdersCount}</strong>
                  <small>Awaiting confirmation</small>
                </div>
                <div>
                  <span>In Kitchen / Prep</span>
                  <strong style={{ color: '#60a5fa' }}>{orders.filter(o => o.status === 'confirmed' || o.status === 'preparing').length}</strong>
                  <small>Under custom butchery</small>
                </div>
                <div>
                  <span>Total Revenue</span>
                  <strong>
                    {money(orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + Number(o.total || 0), 0))}
                  </strong>
                  <small>Non-cancelled orders</small>
                </div>
              </div>

              <div className="admin-toolbar">
                <div className="admin-search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by customer name, phone, order ID..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                  />
                  {orderSearch && <button onClick={() => setOrderSearch('')}><X size={14} /></button>}
                </div>
                <button className="outline-btn" onClick={() => loadOrders(false)}>
                  <RefreshCw size={15} /> Refresh Orders
                </button>
              </div>

              <div className="filter-chips">
                {['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    className={orderFilter === st ? 'filter-chip active' : 'filter-chip'}
                    onClick={() => setOrderFilter(st)}
                  >
                    {st === 'all' ? 'All Orders' : st.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {st === 'pending' && pendingOrdersCount > 0 ? ` (${pendingOrdersCount})` : ''}
                  </button>
                ))}
              </div>

              <section className="admin-panel">
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>Orders Feed ({shownOrders.length})</h2>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                    Live incoming orders from the customer storefront. Automatically synced with Supabase.
                  </p>
                </div>

                {shownOrders.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingBag size={38} />
                    <h3>No orders found</h3>
                    <p>When customers place orders on the store, they will appear here in real-time.</p>
                  </div>
                ) : (
                  shownOrders.map(o => (
                    <article className="order-card" key={o.id}>
                      <div className="order-head">
                        <div>
                          <small>ORDER #{o.id.slice(0, 8).toUpperCase()} • {new Date(o.created_at).toLocaleString('en-IN')}</small>
                          <h3>{o.customer_name}</h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className={`status-pill status-${o.status}`}>
                            {o.status.replace(/_/g, ' ')}
                          </span>
                          <select
                            value={o.status}
                            onChange={e => updateOrderStatus(o.id, e.target.value)}
                            aria-label="Change order status"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out_for_delivery">Out for delivery</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="customer-detail-badge">
                        <p>
                          <Phone size={14} /> Mobile: <a href={`tel:+91${o.phone.replace(/\D/g, '')}`}>{o.phone}</a>
                        </p>
                        <p>
                          <MapPin size={14} /> Address: {o.address}{o.area ? `, ${o.area}` : ''}
                        </p>
                        {o.notes && (
                          <div className="notes-pill">
                            <strong>📝 Custom Butchery & Notes:</strong> {o.notes}
                          </div>
                        )}
                      </div>

                      <div className="order-lines">
                        {(o.order_items || []).map((it, idx) => (
                          <div key={it.id || idx}>
                            <span>{it.product_name} × {it.quantity} kg</span>
                            <strong>{money(it.line_total)}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="order-total">
                        <span>Total Payable</span>
                        <strong>{money(o.total)}</strong>
                      </div>

                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
                        <a
                          className="order-wa"
                          href={`https://wa.me/91${o.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${o.customer_name}, your Shas Fresh Mart order #${o.id.slice(0, 8).toUpperCase()} is currently ${o.status.replace(/_/g, ' ')}. Thank you!`)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle size={15} /> Message Customer on WhatsApp <ArrowRight size={14} />
                        </a>
                      </div>
                    </article>
                  ))
                )}
              </section>
            </>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {tab === 'products' && (
            <>
              <div className="admin-toolbar">
                <div className="admin-search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search products in catalog..."
                    value={adminProductSearch}
                    onChange={e => setAdminProductSearch(e.target.value)}
                  />
                  {adminProductSearch && <button onClick={() => setAdminProductSearch('')}><X size={14} /></button>}
                </div>
                <button className="primary-btn" onClick={() => setNewProductModal(true)}>
                  <PlusCircle size={16} /> Add New Product
                </button>
              </div>

              <div className="filter-chips">
                {cats.map(c => (
                  <button
                    key={c.id}
                    className={adminCategoryFilter === c.id ? 'filter-chip active' : 'filter-chip'}
                    onClick={() => setAdminCategoryFilter(c.id)}
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>

              <div className="product-admin-grid">
                {shownAdminProducts.map(p => (
                  <div
                    className={p.is_available ? 'product-admin-card' : 'product-admin-card out-of-stock'}
                    key={p.id}
                  >
                    <div className="prod-admin-thumb">
                      <img src={p.image || p.image_url} alt={p.name} onError={e => handleImageError(e, p.category)} />
                      <div className="prod-admin-badges">
                        <span className="badge-cat">{catName(p.category)}</span>
                        <span className={p.is_available ? 'badge-stock in' : 'badge-stock out'}>
                          {p.is_available ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <div className="prod-admin-body">
                      <h3>{p.name}</h3>
                      <p>{p.desc || p.description || 'Fresh daily catch'}</p>

                      <div className="price-edit-row">
                        <span>₹</span>
                        <input
                          type="number"
                          defaultValue={p.price}
                          onKeyDown={e => {
                            if (e.key === 'Enter') updateProductPrice(p.id, e.currentTarget.value);
                          }}
                          id={`price-input-${p.id}`}
                          aria-label={`Price for ${p.name}`}
                        />
                        <small>/ {p.unit || 'kg'}</small>
                        <button
                          className="btn-mini-save"
                          onClick={() => {
                            const val = document.getElementById(`price-input-${p.id}`)?.value;
                            updateProductPrice(p.id, val);
                          }}
                        >
                          Save
                        </button>
                      </div>

                      <div className="prod-admin-actions">
                        <button
                          className="stock-toggle-btn"
                          onClick={() => toggleProductAvailability(p.id, p.is_available)}
                        >
                          {p.is_available ? 'Mark Out of Stock' : 'Mark In Stock'}
                        </button>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="stock-toggle-btn"
                            onClick={() => setEditingImageProduct(p)}
                            title="Change product image"
                          >
                            <Image size={15} /> Photo
                          </button>
                          <button
                            className="icon-btn-danger"
                            onClick={() => deleteProduct(p.id, p.name)}
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB 3: OFFERS & PROMO BANNER */}
          {tab === 'offers' && (
            <div className="settings-grid">
              <div className="settings-card">
                <h3>Storefront Announcement Banner</h3>
                <p>Customize the royal top ribbon shown at the very top of the customer storefront.</p>
                <form onSubmit={saveSettings}>
                  <div className="settings-form-row">
                    <label>Banner Announcement Text</label>
                    <textarea
                      rows={3}
                      value={settingsForm.banner_offer_text}
                      onChange={e => setSettingsForm({ ...settingsForm, banner_offer_text: e.target.value })}
                      placeholder="e.g. 🔥 ROYAL FRESHNESS: Free Express Delivery on orders above ₹500! Code: FRESH10 for 10% OFF"
                    />
                  </div>

                  <div className="offer-preview-box">
                    <small>LIVE BANNER PREVIEW:</small>
                    <p style={{ margin: '6px 0 0', fontWeight: 700 }}>{settingsForm.banner_offer_text}</p>
                  </div>

                  <button className="primary-btn" type="submit" disabled={busy} style={{ marginTop: 18 }}>
                    Save Banner Announcement
                  </button>
                </form>
              </div>

              <div className="settings-card">
                <h3>Main Customer Hero Banner</h3>
                <p>Upload the homepage hero image directly from your device. This reuses the existing product-images bucket.</p>
                {(heroBannerFile || settingsForm.hero_banner_image) && <div className="image-upload-preview hero-banner-admin-preview"><img src={heroBannerFile ? URL.createObjectURL(heroBannerFile) : settingsForm.hero_banner_image} alt="Main hero banner preview" /><span>{heroBannerFile ? heroBannerFile.name : 'Current live hero banner'}</span></div>}
                <label className="image-upload-field" style={{ marginTop: 12 }}>
                  Choose main banner image
                  <input type="file" accept="image/*" onChange={e => setHeroBannerFile(e.target.files?.[0] || null)} />
                  <small>JPG, PNG or WebP. Maximum 8 MB.</small>
                </label>
                <button className="primary-btn" type="button" disabled={busy || !heroBannerFile} onClick={saveHeroBanner} style={{ marginTop: 16 }}>{busy ? 'Uploading…' : 'Upload & Publish Hero Banner'}</button>
              </div>

              <div className="settings-card">
                <h3>Promo Code & Cart Discount</h3>
                <p>Set a promotional discount code that customers can apply inside their shopping bag.</p>
                <form onSubmit={saveSettings}>
                  <div className="settings-form-row">
                    <label>Offer Status</label>
                    <select
                      value={settingsForm.offer_enabled ? 'enabled' : 'disabled'}
                      onChange={e => setSettingsForm({ ...settingsForm, offer_enabled: e.target.value === 'enabled' })}
                    >
                      <option value="enabled">Active / Enabled</option>
                      <option value="disabled">Inactive / Disabled</option>
                    </select>
                  </div>

                  <div className="settings-form-row">
                    <label>Coupon Code</label>
                    <input
                      type="text"
                      value={settingsForm.offer_code}
                      onChange={e => setSettingsForm({ ...settingsForm, offer_code: e.target.value.toUpperCase() })}
                      placeholder="FRESH10"
                    />
                  </div>

                  <div className="settings-form-row">
                    <label>Discount Percentage (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={settingsForm.offer_discount_percent}
                      onChange={e => setSettingsForm({ ...settingsForm, offer_discount_percent: e.target.value })}
                      placeholder="10"
                    />
                  </div>

                  <div className="settings-form-row">
                    <label>Minimum Cart Value for Offer (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.min_order_for_offer}
                      onChange={e => setSettingsForm({ ...settingsForm, min_order_for_offer: e.target.value })}
                      placeholder="799"
                    />
                  </div>

                  <button className="primary-btn" type="submit" disabled={busy}>
                    Save Offer Rules
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: DELIVERY & STORE OPERATIONS */}
          {tab === 'settings' && (
            <div className="settings-grid">
              <div className="settings-card">
                <h3>Delivery Charges & Threshold</h3>
                <p>Configure the standard delivery fee and qualifying cart value for Free Express Delivery.</p>
                <form onSubmit={saveSettings}>
                  <div className="settings-form-row">
                    <label>Standard Delivery Charge (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.delivery_charge}
                      onChange={e => setSettingsForm({ ...settingsForm, delivery_charge: e.target.value })}
                      placeholder="40"
                    />
                    <small style={{ color: 'var(--text-muted)' }}>Charged when cart is below free delivery threshold.</small>
                  </div>

                  <div className="settings-form-row">
                    <label>Free Delivery Threshold (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.free_delivery_threshold}
                      onChange={e => setSettingsForm({ ...settingsForm, free_delivery_threshold: e.target.value })}
                      placeholder="500"
                    />
                    <small style={{ color: 'var(--text-muted)' }}>Orders at or above this amount automatically receive Free Delivery.</small>
                  </div>

                  <button className="primary-btn" type="submit" disabled={busy} style={{ marginTop: 18 }}>
                    Save Delivery Rates
                  </button>
                </form>
              </div>

              <div className="settings-card">
                <h3>Store Operations & Contact</h3>
                <p>Manage store opening status and customer helpline contact numbers.</p>
                <form onSubmit={saveSettings}>
                  <div className="settings-form-row">
                    <label>Store Accepting Orders</label>
                    <select
                      value={settingsForm.store_open ? 'open' : 'closed'}
                      onChange={e => setSettingsForm({ ...settingsForm, store_open: e.target.value === 'open' })}
                    >
                      <option value="open">Open (Accepting Online Orders)</option>
                      <option value="closed">Paused / Closed for Maintenance</option>
                    </select>
                  </div>

                  <div className="settings-form-row">
                    <label>Store Helpline Phone Number</label>
                    <input
                      type="tel"
                      value={settingsForm.contact_phone}
                      onChange={e => setSettingsForm({ ...settingsForm, contact_phone: e.target.value })}
                      placeholder="6380723356"
                    />
                  </div>

                  <button className="primary-btn" type="submit" disabled={busy} style={{ marginTop: 18 }}>
                    Save Store Status
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>

        {/* MODAL: Add New Product */}
        {newProductModal && (
          <div className="backdrop modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setNewProductModal(false); }}>
            <div className="modal-luxury">
              <div className="drawer-head">
                <div>
                  <span className="eyebrow">STORE INVENTORY</span>
                  <h2>Add New Product</h2>
                  <p>Create a new item in your Supabase catalog.</p>
                </div>
                <button className="icon-btn" onClick={() => setNewProductModal(false)}><X size={20} /></button>
              </div>

              <form onSubmit={addProduct} style={{ marginTop: 18 }}>
                <label>
                  Product Name
                  <input
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Fresh Red Snapper Cuts"
                  />
                </label>

                <div className="form-two" style={{ marginTop: 12 }}>
                  <label>
                    Category
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      <option value="fish">Fresh Ocean Fish</option>
                      <option value="prawns">Prawns & Shellfish</option>
                      <option value="chicken">Artisanal Chicken</option>
                      <option value="mutton">Prime Mutton</option>
                    </select>
                  </label>

                  <label>
                    Price in ₹ (per unit)
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="550"
                    />
                  </label>
                </div>

                <label style={{ marginTop: 12 }}>
                  Description / Chef Cut Notes
                  <textarea
                    rows={2}
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="e.g. Freshly descaled, clean firm slices perfect for tawa fry"
                  />
                </label>

                <label className="image-upload-field" style={{ marginTop: 12 }}>
                  Upload product photo
                  <input type="file" accept="image/*" onChange={e => setNewProductImageFile(e.target.files?.[0] || null)} />
                  <small>Choose an image from your device. JPG, PNG or WebP; maximum 8 MB.</small>
                </label>
                {newProductImageFile && <div className="image-upload-preview"><img src={URL.createObjectURL(newProductImageFile)} alt="Selected product preview" /><span>{newProductImageFile.name}</span><button type="button" className="preset-pill" onClick={() => setNewProductImageFile(null)}>Remove photo</button></div>}

                <div className="preset-images-box">
                  <span>Quick High-Res Presets:</span>
                  <div className="preset-pills">
                    {PRESET_IMAGE_SUGGESTIONS.map(sug => (
                      <button
                        type="button"
                        key={sug.name}
                        className="preset-pill"
                        onClick={() => setNewProduct({ ...newProduct, image_url: sug.url, category: sug.category })}
                      >
                        {sug.name}
                      </button>
                    ))}
                  </div>
                </div>

                {newProduct.image_url && (
                  <div style={{ height: 140, borderRadius: 10, overflow: 'hidden', margin: '12px 0', background: '#02070f' }}>
                    <img src={newProduct.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <button className="primary-btn full" type="submit" disabled={busy} style={{ marginTop: 16 }}>
                  {busy ? 'Saving to Supabase...' : 'Save & Publish Product'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Edit Product Image */}
        {editingImageProduct && (
          <div className="backdrop modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setEditingImageProduct(null); }}>
            <div className="modal-luxury">
              <div className="drawer-head">
                <div>
                  <span className="eyebrow">UPDATE PHOTO</span>
                  <h2>Change Image for {editingImageProduct.name}</h2>
                </div>
                <button className="icon-btn" onClick={() => setEditingImageProduct(null)}><X size={20} /></button>
              </div>

              <div style={{ marginTop: 16 }}>
                <label className="image-upload-field">
                  Upload a new photo for this product
                  <input type="file" accept="image/*" onChange={e => setEditingProductImageFile(e.target.files?.[0] || null)} />
                  <small>This changes only this product's photo. Maximum 8 MB.</small>
                </label>
                {editingProductImageFile && <div className="image-upload-preview"><img src={URL.createObjectURL(editingProductImageFile)} alt="New photo preview" /><span>{editingProductImageFile.name}</span></div>}
                <input type="hidden" id="update-img-input" defaultValue={editingImageProduct.image_url || editingImageProduct.image} />

                <div className="preset-images-box" style={{ marginTop: 14 }}>
                  <span>Or Pick From Seafood & Meat Presets:</span>
                  <div className="preset-pills">
                    {PRESET_IMAGE_SUGGESTIONS.map(sug => (
                      <button
                        type="button"
                        key={sug.name}
                        className="preset-pill"
                        onClick={() => {
                          const el = document.getElementById('update-img-input');
                          if (el) el.value = sug.url;
                        }}
                      >
                        {sug.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="primary-btn full"
                  style={{ marginTop: 18 }}
                  disabled={busy}
                  onClick={() => {
                    const val = document.getElementById('update-img-input')?.value;
                    updateProductImage(editingImageProduct.id, val, editingProductImageFile);
                  }}
                >
                  {busy ? 'Uploading & Saving…' : 'Upload & Save Photo'}
                </button>
              </div>
            </div>
          </div>
        )}

        {notice && (
          <div className="toast" role="status">
            <span>{notice}</span>
            <button onClick={() => setNotice('')}><X size={15} /></button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // CUSTOMER STOREFRONT RENDERING
  // ==========================================================================
  return (
    <div id="home">
      {/* Royal Top Ribbon Announcement Bar */}
      <div className="announcement">
        <div className="announcement-inner">
          <span className="announcement-badge"><CrownIcon /> DAWN CATCH 4:00 AM</span>
          <span>{settings.banner_offer_text}</span>
          <span className="separator">•</span>
          <span>Ice-Packed Express Delivery</span>
          <span className="separator">•</span>
          <a href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
            <MessageCircle size={13} /> VIP WhatsApp: +91 {PHONE}
          </a>
        </div>
      </div>

      {/* Royal Sticky Glass Header */}
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className={menu ? 'nav-links nav-open' : 'nav-links'}>
            <a href="#shop" onClick={() => setMenu(false)}>Imperial Catch</a>
            <a href="#categories" onClick={() => setMenu(false)}>Categories</a>
            <a href="#standard" onClick={() => setMenu(false)}>Royal Standard</a>
            <a href="#culinary" onClick={() => setMenu(false)}>Chef's Guide</a>
            <a href="#reviews" onClick={() => setMenu(false)}>Patron Praise</a>
            <a href="#faq" onClick={() => setMenu(false)}>FAQ</a>
          </nav>
          <div className="header-actions">
            <a className="header-wa-btn" href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> WhatsApp Order
            </a>
            <button
              className="icon-btn"
              onClick={() => {
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => document.getElementById('search')?.focus(), 350);
              }}
              aria-label="Search catalog"
            >
              <Search size={18} />
            </button>
            <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open Shopping Bag">
              <ShoppingBag size={17} />
              <span>Bag</span>
              <b>{count}</b>
              {subtotal > 0 && <span className="cart-amount-preview">{money(subtotal)}</span>}
            </button>
            <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
              {menu ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Cinematic Royal Hero */}
        <section className="hero">
          {settings.hero_banner_image ? (
            <img className="hero-banner-image" src={settings.hero_banner_image} alt="Fresh seafood market banner" onError={() => setSettings(current => current.hero_banner_image ? { ...current, hero_banner_image: '' } : current)} />
          ) : <video
            className="hero-wave-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.pexels.com/videos/6981339/sea-waves-rippling-towards-the-shore-6981339.jpeg?auto=compress&cs=tinysrgb&w=1600"
            aria-hidden="true"
          >
            <source src="https://videos.pexels.com/video-files/6981339/6981339-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>}

          <div className="hero-copy">
            <div className="kicker">
              <Sparkles size={15} /> 100% CHEMICAL-FREE • DAWN HARBOR PROCUREMENT
            </div>
            <h1>
              The King of <span>Fresh Seafood</span> & Artisanal Meats
            </h1>
            <p>
              Hand-selected from coastal fishing harbors at 4:00 AM every morning.
              Cold-chain packed on crushed food-grade ice with zero preservatives, formalin, or compromise.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#shop">
                Explore Today's Catch <ArrowRight size={17} />
              </a>
              <a className="secondary-btn" href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
                <MessageCircle size={17} /> VIP Concierge Order
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>4:00 AM</strong>
                <span>Harbor landing</span>
              </div>
              <div>
                <strong>0%</strong>
                <span>Formalin or ammonia</span>
              </div>
              <div>
                <strong>100% Free</strong>
                <span>Custom RO butchery</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-photo">
              <img
                src="https://images.unsplash.com/photo-1574745529486-2abeed35edbd?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=85&w=1800"
                alt="Finest ocean catch"
              />
              <div className="floating-note">
                <CrownIcon />
                <div>
                  <strong>Imperial Seer Fish (Vanjiram)</strong>
                  <small>Fresh boneless round cuts arriving daily</small>
                </div>
              </div>
              <div className="photo-stamp">
                <Sparkles size={15} />
                <strong>TOP 10%</strong>
                <small>Export Grade</small>
              </div>
            </div>
          </div>
        </section>

        {/* Cold-Chain Telemetry & Trust Strip */}
        <section className="trust-strip" aria-label="Store quality assurances">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon"><Clock size={20} /></div>
              <div>
                <h4>4:00 AM Harbor Auction</h4>
                <p>Procured directly from day-boat catamarans at dawn</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon"><ShieldCheck size={20} /></div>
              <div>
                <h4>100% Chemical & Formalin Free</h4>
                <p>Zero ammonia, zero preservatives — pure ocean catch</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon"><Utensils size={20} /></div>
              <div>
                <h4>RO-Purified Custom Butchery</h4>
                <p>Complimentary curry cuts, fry slices & deveining</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon"><Truck size={20} /></div>
              <div>
                <h4>0°C–4°C Chilled Express Box</h4>
                <p>Free delivery on orders above {money(settings.free_delivery_threshold || 500)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Categories Bento Grid */}
        <section className="category-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ROYAL SPECTRUM</span>
              <h2>Curated Meat & Ocean Categories</h2>
            </div>
            <p>Every cut inspected for firm texture, natural ocean sheen, and culinary excellence.</p>
          </div>

          <div className="category-grid">
            <div
              className="category-card"
              onClick={() => {
                setCategory('fish');
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <img src="https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=900&q=85" alt="Sea & Coastal Fish" />
              <div className="category-overlay">
                <span className="category-tag">🐟 OCEAN HARVEST</span>
                <strong>Sea & Coastal Fish</strong>
                <p>Red Snapper, Vanjiram, White Pomfret, Anchovies & Trevally.</p>
              </div>
            </div>

            <div
              className="category-card"
              onClick={() => {
                setCategory('prawns');
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Big_size_Prawns.JPG?width=1200" alt="Prawns & Shellfish" />
              <div className="category-overlay">
                <span className="category-tag">🦐 COASTAL DELICACIES</span>
                <strong>Prawns, Squid & Crab</strong>
                <p>Jumbo Tiger Prawns, Sea Squid & Fresh Blue Coastal Crabs.</p>
              </div>
            </div>

            <div
              className="category-card"
              onClick={() => {
                setCategory('chicken');
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <img src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85" alt="Farm Fresh Chicken" />
              <div className="category-overlay">
                <span className="category-tag">🍗 ARTISANAL POULTRY</span>
                <strong>Farm Fresh Chicken</strong>
                <p>RO-water cleaned tender cuts & chef-marinated specialities.</p>
              </div>
            </div>

            <div
              className="category-card"
              onClick={() => {
                setCategory('mutton');
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <img src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85" alt="Prime Mutton" />
              <div className="category-overlay">
                <span className="category-tag">🥩 MOUNTAIN GRAZED</span>
                <strong>Prime Mutton</strong>
                <p>Tender pasture-grazed cuts trimmed with master precision.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Imperial Market Showcase (Product Catalog) */}
        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TODAY'S SELECTION</span>
              <h2>Imperial Market Showcase</h2>
            </div>
            <p>Sourced fresh at 4:00 AM • Custom cutting & cleaning is complimentary</p>
          </div>

          <div className="shop-command-bar">
            <div className="category-pills">
              {cats.map(c => {
                const catCount = c.id === 'all'
                  ? availableProducts.length
                  : availableProducts.filter(p => p.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    className={category === c.id ? 'cat-pill active' : 'cat-pill'}
                    onClick={() => setCategory(c.id)}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label} ({catCount})</span>
                  </button>
                );
              })}
            </div>

            <div className="search-box">
              <Search size={17} />
              <input
                id="search"
                type="text"
                placeholder="Search Vanjiram, Sankara, prawns, curry cut..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {shownProducts.length === 0 ? (
            <div className="empty-state">
              <Search size={38} />
              <h3>No matching cuts found</h3>
              <p>Try clearing your search filter or switching to "All Royal Cuts".</p>
              <button className="primary-btn" onClick={() => { setCategory('all'); setSearch(''); }}>
                Show All Fresh Cuts
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {shownProducts.map(p => {
                const inBagQty = cart[p.id]?.quantity || 0;
                return (
                  <article className="product-card" key={p.id}>
                    <div className="product-image">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        onError={e => handleImageError(e, p.category)}
                      />
                      {p.tag && <span className="product-badge">{p.tag}</span>}
                      {inBagQty > 0 && <span className="in-bag-pill">✓ {inBagQty} kg in Bag</span>}
                      <span className="category-chip">{catName(p.category)}</span>
                    </div>

                    <div className="product-info">
                      <h3>{p.name}</h3>
                      <p>{p.desc}</p>
                      <div className="chef-tip">
                        <Utensils size={13} />
                        <span>{p.chefTip}</span>
                      </div>

                      <div className="product-bottom">
                        <div>
                          {p.price > 0 ? (
                            <>
                              <small>Price per {p.unit || 'kg'}</small>
                              <strong>{money(p.price)}</strong>
                            </>
                          ) : (
                            <>
                              <small>Daily Market Price</small>
                              <strong style={{ fontSize: 16 }}>Enquire Rate</strong>
                            </>
                          )}
                        </div>

                        {p.price > 0 ? (
                          inBagQty > 0 ? (
                            <div className="card-stepper" aria-label={`Quantity stepper for ${p.name}`}>
                              <button onClick={() => qty(p.id, -1)} aria-label="Decrease quantity">
                                <Minus size={14} />
                              </button>
                              <span>{inBagQty} kg</span>
                              <button onClick={() => qty(p.id, 1)} aria-label="Increase quantity">
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="add-btn"
                              onClick={() => add(p)}
                              aria-label={`Add ${p.name} to royal bag`}
                            >
                              <Plus size={15} />
                              <span>Add to Bag</span>
                            </button>
                          )
                        ) : (
                          <button
                            className="wa-ask-btn"
                            onClick={() => {
                              const text = encodeURIComponent(`Hi Shas Fresh Mart! I would like to inquire today's market price for ${p.name}.`);
                              window.open(`https://wa.me/91${PHONE}?text=${text}`, '_blank');
                            }}
                          >
                            <MessageCircle size={15} /> Ask Rate
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* The Royal Standard / Cold-Chain Promise */}
        <section className="promise-section" id="standard">
          <div className="promise-content">
            <span className="eyebrow">OUR ROYAL OATH</span>
            <h2>How Shas Guarantees Unmatched Freshness</h2>
            <p>
              In traditional markets, seafood changes hands multiple times and sits on melting ice for days.
              At Shas Fresh Mart, our cold-chain process delivers directly from harbor landing to your kitchen within hours.
            </p>

            <div className="promise-points">
              <div className="promise-item">
                <div className="promise-icon"><Clock size={22} /></div>
                <div>
                  <strong>Harbor-Direct Dawn Sourcing</strong>
                  <p>Procured at 4:00 AM straight from traditional fishing catamarans and deep-sea trawlers.</p>
                </div>
              </div>

              <div className="promise-item">
                <div className="promise-icon"><ShieldCheck size={22} /></div>
                <div>
                  <strong>0% Chemical & Formalin Guarantee</strong>
                  <p>Certified chemical-free. Every batch undergoes strict gill, eye-clarity, and firmness inspection.</p>
                </div>
              </div>

              <div className="promise-item">
                <div className="promise-icon"><Scale size={22} /></div>
                <div>
                  <strong>Complimentary Custom Butchery</strong>
                  <p>Curry cut, tawa fry slices, skin-on or boneless fillets cleaned with purified RO water.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="promise-visual">
            <div className="promise-photo">
              <img
                src="https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1000&q=85"
                alt="Imperial Fresh Mart Promise"
              />
              <div>
                <strong>Ice-Chilled Thermal Transit</strong>
                <small>Maintained at 0°C–4°C in food-grade insulated containers</small>
              </div>
            </div>
          </div>
        </section>

        {/* Chef's Interactive Culinary Pairing Studio */}
        <section className="culinary-section" id="culinary">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CULINARY EXCELLENCE</span>
              <h2>Chef's Preparation Guide</h2>
            </div>
            <p>Select your dish style to discover the ideal ocean or farm cuts for maximum flavor.</p>
          </div>

          <div className="recipe-selector">
            {RECIPES.map(r => (
              <button
                key={r.id}
                className={activeRecipe === r.id ? 'recipe-tab active' : 'recipe-tab'}
                onClick={() => setActiveRecipe(r.id)}
              >
                {r.title}
              </button>
            ))}
          </div>

          {(() => {
            const active = RECIPES.find(r => r.id === activeRecipe) || RECIPES[0];
            return (
              <div className="culinary-card">
                <div className="culinary-info">
                  <span className="culinary-badge">{active.tag}</span>
                  <h3>{active.title}</h3>
                  <p>{active.desc}</p>
                  <small>Tap any recommended cut on the right to add directly to your bag →</small>
                </div>

                <div className="culinary-items">
                  {active.items.map(itemId => {
                    const item = products.find(p => p.id === itemId);
                    if (!item) return null;
                    return (
                      <div
                        key={itemId}
                        className="culinary-chip"
                        onClick={() => {
                          if (item.price > 0) {
                            add(item);
                          } else {
                            const text = encodeURIComponent(`Hi Shas Fresh Mart! I would like to inquire today's market price for ${item.name}.`);
                            window.open(`https://wa.me/91${PHONE}?text=${text}`, '_blank');
                          }
                        }}
                      >
                        <div className="culinary-chip-meta">
                          <img src={item.image} alt={item.name} onError={e => handleImageError(e, item.category)} />
                          <div>
                            <span>{item.name}</span>
                            <b>{item.price > 0 ? `${money(item.price)} / kg` : 'Enquire Rate'}</b>
                          </div>
                        </div>
                        <div className="culinary-chip-add">
                          <Plus size={15} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </section>

        {/* Customer Testimonials */}
        <section className="testimonials-section" id="reviews">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PATRON APPRECIATION</span>
              <h2>Praise from Discerning Kitchens</h2>
            </div>
            <p>Trusted by seafood connoisseurs, home chefs, and families across Chennai.</p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, idx) => (
              <article className="testimonial-card" key={idx}>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f5d061" color="#f5d061" />
                  ))}
                </div>
                <p>"{t.text}"</p>
                <div className="testimonial-foot">
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.location}</span>
                  </div>
                  <small>{t.item}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Interactive FAQ Accordion */}
        <section className="faq-section" id="faq">
          <div className="section-heading">
            <div>
              <span className="eyebrow">COMMON INQUIRIES</span>
              <h2>Frequently Asked Questions</h2>
            </div>
            <p>Everything you need to know about our dawn harbor sourcing, cold-chain delivery, and custom butchery.</p>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, idx) => (
              <div
                className={activeFaq === idx ? 'faq-item open' : 'faq-item'}
                key={idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="faq-q">
                  <span>{faq.q}</span>
                  <ChevronDown size={18} />
                </div>
                {activeFaq === idx && <p className="faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Royal Delivery Callout Banner */}
        <section className="delivery-banner">
          <div>
            <span className="eyebrow">DIRECT TO YOUR DOORSTEP</span>
            <h2>Experience Imperial Seafood at Home</h2>
            <p>Delivered on crushed ice in food-grade thermal containers. Ready for your pan or curry pot.</p>
          </div>
          <button className="primary-btn" onClick={() => setCartOpen(true)}>
            Open Shopping Bag ({count}) <ArrowRight size={17} />
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>
              Chennai’s premier direct-from-harbor seafood and artisanal meat purveyor.
              Supplying fine households with pristine ocean harvests every morning.
            </p>
            <div className="footer-contact-info">
              <p><MapPin size={15} /> Chennai, Tamil Nadu • Fresh Coastal Harbor Dispatch</p>
              <p><Phone size={15} /> Direct Helpline: +91 {PHONE}</p>
            </div>
          </div>

          <div>
            <h4>Cuts & Catches</h4>
            <ul>
              <li><a href="#shop" onClick={() => setCategory('fish')}>Red Snapper (Sankara)</a></li>
              <li><a href="#shop" onClick={() => setCategory('fish')}>King Seer Fish (Vanjiram)</a></li>
              <li><a href="#shop" onClick={() => setCategory('prawns')}>Jumbo Tiger Prawns</a></li>
              <li><a href="#shop" onClick={() => setCategory('chicken')}>Farm Fresh Chicken</a></li>
              <li><a href="#shop" onClick={() => setCategory('mutton')}>Prime Mountain Mutton</a></li>
            </ul>
          </div>

          <div>
            <h4>The Royal Standard</h4>
            <ul>
              <li><a href="#standard">Harbor Sourcing at 4:00 AM</a></li>
              <li><a href="#standard">100% Formalin-Free Oath</a></li>
              <li><a href="#standard">Complimentary Custom Cuts</a></li>
              <li><a href="#culinary">Chef's Recipe Guide</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
            </ul>
          </div>

          <div>
            <h4>Imperial Assurance</h4>
            <div className="assurance-badge">
              <ShieldCheck size={28} />
              <div>
                <strong>Zero Preservatives</strong>
                <p>100% natural, pristine ocean fish packed on fresh crushed ice every morning.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Shas Fresh Mart. All rights reserved. Imperial Quality Seafood & Meats.</span>
          <button onClick={() => { window.history.pushState({}, '', '/admin'); setAdmin(true); }}>
            Store Workspace Login
          </button>
        </div>
      </footer>

      {/* Slide-Over Shopping Bag Drawer */}
      {cartOpen && (
        <div className="backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}>
          <aside className="cart-drawer">
            <div className="drawer-head">
              <div>
                <span className="eyebrow">YOUR ROYAL SELECTION</span>
                <h2>Your Shopping Bag ({count})</h2>
                <p>Inspected, ice-packed, and custom cut upon checkout.</p>
              </div>
              <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close Bag">
                <X size={20} />
              </button>
            </div>

            {items.length ? (
              <>
                <div className="delivery-perk-bar">
                  <div className="perk-text">
                    {subtotal >= (settings.free_delivery_threshold || 500) ? (
                      <span>🎉 Unlocked: Complimentary Express Ice Packing & FREE Delivery!</span>
                    ) : (
                      <span>Add {money((settings.free_delivery_threshold || 500) - subtotal)} more for FREE Express Delivery!</span>
                    )}
                  </div>
                  <div className="perk-progress">
                    <div
                      className="perk-fill"
                      style={{ width: `${Math.min(100, (subtotal / (settings.free_delivery_threshold || 500)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="cart-lines">
                  {items.map(i => (
                    <div className="cart-line" key={i.id}>
                      <img src={i.image} alt={i.name} onError={e => handleImageError(e, i.category)} />
                      <div className="cart-line-info">
                        <strong>{i.name}</strong>
                        <span>{money(i.price)} / kg</span>
                        <div className="qty-control">
                          <button onClick={() => qty(i.id, -1)} aria-label="Reduce quantity"><Minus size={13} /></button>
                          <b>{i.quantity}</b>
                          <button onClick={() => qty(i.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                          <small>kg</small>
                        </div>
                      </div>
                      <strong>{money(i.price * i.quantity)}</strong>
                    </div>
                  ))}
                </div>

                {settings.offer_enabled && (
                  <div>
                    {!appliedPromo ? (
                      <form className="coupon-row" onSubmit={handleApplyPromo}>
                        <input
                          type="text"
                          placeholder={`Promo Code (e.g. ${settings.offer_code || 'FRESH10'})`}
                          value={promoInput}
                          onChange={e => setPromoInput(e.target.value)}
                        />
                        <button type="submit" className="coupon-btn">Apply</button>
                      </form>
                    ) : (
                      <div className="coupon-applied">
                        <span>🏷️ Code <strong>{appliedPromo}</strong> applied (-{settings.offer_discount_percent}%)</span>
                        <button type="button" className="coupon-remove" onClick={() => setAppliedPromo(null)}>Remove</button>
                      </div>
                    )}
                  </div>
                )}

                <div className="cart-summary">
                  <div>
                    <span>Items Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  <div>
                    <span>Express Cold-Chain Delivery</span>
                    <strong>
                      {deliveryCharge === 0 ? <span style={{ color: '#34d399' }}>FREE</span> : money(deliveryCharge)}
                    </strong>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ color: '#34d399' }}>
                      <span>Discount ({settings.offer_discount_percent}%)</span>
                      <strong>-{money(discountAmount)}</strong>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, marginTop: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Total Payable</span>
                    <strong style={{ fontSize: 20, color: 'var(--gold-bright)' }}>{money(grandTotal)}</strong>
                  </div>

                  <button
                    className="primary-btn full"
                    onClick={() => { setCartOpen(false); setCheckout(true); }}
                    style={{ marginTop: 14 }}
                  >
                    Proceed to Delivery Details <ArrowRight size={17} />
                  </button>
                  <button className="text-btn center" onClick={() => setCartOpen(false)}>
                    + Add More Fresh Catch
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <ShoppingBag size={42} />
                <h3>Your Royal Bag is Empty</h3>
                <p>Explore today's fresh harbor landings and add your favorites.</p>
                <button
                  className="primary-btn"
                  onClick={() => {
                    setCartOpen(false);
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Browse Today's Catch <ArrowRight size={16} />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Customer Delivery & Custom Butchery Checkout Modal */}
      {checkout && (
        <div className="backdrop modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setCheckout(false); }}>
          <section className="checkout-modal">
            <div className="drawer-head">
              <div>
                <span className="eyebrow">DIRECT ORDER DISPATCH</span>
                <h2>Delivery & Custom Butchery Details</h2>
                <p>Tell our master butchers how to prepare and where to deliver your order.</p>
              </div>
              <button className="icon-btn" onClick={() => setCheckout(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form className="checkout-form" onSubmit={placeCustomerOrder}>
              <label>
                Full Name
                <input
                  required
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                />
              </label>

              <div className="form-two">
                <label>
                  Mobile Number (WhatsApp Active)
                  <input
                    required
                    inputMode="tel"
                    pattern="[0-9+() -]{8,16}"
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                  />
                </label>
                <label>
                  Locality / Landmark
                  <input
                    required
                    value={customer.area}
                    onChange={e => setCustomer({ ...customer, area: e.target.value })}
                    placeholder="e.g. Near Velachery Bus Stand"
                  />
                </label>
              </div>

              <label>
                Full Delivery Address
                <textarea
                  required
                  rows={2}
                  value={customer.address}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Door/Flat No, Apartment Name, Street..."
                />
              </label>

              <div>
                <label>
                  Custom Cutting & Cleaning Instructions <span className="muted">(Complimentary — Tap to add)</span>
                  <textarea
                    rows={2}
                    value={customer.notes}
                    onChange={e => setCustomer({ ...customer, notes: e.target.value })}
                    placeholder="e.g. Vanjiram thin fry slices, Sankara curry cuts, Prawns deveined & deshelled..."
                  />
                </label>
                <div className="cut-quick-pills">
                  {BUTCHERY_PRESETS.map(preset => (
                    <button
                      type="button"
                      key={preset}
                      className="cut-pill"
                      onClick={() => appendCutPreset(preset)}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="checkout-total">
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13, color: 'var(--text-muted)' }}>
                    <span>Items Subtotal ({count} kg)</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13, color: 'var(--text-muted)' }}>
                    <span>Express Cold-Chain Delivery</span>
                    <span>{deliveryCharge === 0 ? <strong style={{ color: '#34d399' }}>FREE</strong> : money(deliveryCharge)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13, color: '#34d399' }}>
                      <span>Discount ({appliedPromo})</span>
                      <span>-{money(discountAmount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 16 }}>
                    <span style={{ fontWeight: 700 }}>Total Payable</span>
                    <strong style={{ color: 'var(--gold-bright)' }}>{money(grandTotal)}</strong>
                  </div>
                  <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                    💵 Payment Mode: Cash on Delivery or UPI upon arrival.
                  </small>
                </div>
              </div>

              <button className="primary-btn full" type="submit" disabled={busy}>
                {busy ? (
                  <>
                    <RefreshCw className="spin" size={17} /> Placing Order in Kitchen Queue...
                  </>
                ) : (
                  <>
                    Confirm & Place Order <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="checkout-legal">
                <ShieldCheck size={14} /> 100% Secure & Private • Hand-Delivered In Insulated Food-Grade Boxes
              </p>
            </form>
          </section>
        </div>
      )}

      {/* MODAL: Customer Order Confirmation */}
      {confirmedOrder && (
        <div className="backdrop modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setConfirmedOrder(null); }}>
          <div className="order-success-card">
            <div className="success-celebrate-crest">
              <CheckCircle2 size={42} />
            </div>
            <div className="order-ref-pill">
              ORDER REFERENCE: #{confirmedOrder.order_id.slice(0, 8).toUpperCase()}
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>
              Thank you, <strong>{confirmedOrder.customer.name}</strong>! Your order has been dispatched directly into our
              Store Admin workspace queue. Our master butchers are preparing your fresh cuts.
            </p>

            <div className="success-details-box">
              <p><span>Customer Phone:</span> <strong>{confirmedOrder.customer.phone}</strong></p>
              <p><span>Delivery Address:</span> <strong>{confirmedOrder.customer.address}, {confirmedOrder.customer.area}</strong></p>
              <p><span>Total Payable:</span> <strong>{money(confirmedOrder.total)} (Cash / UPI on Delivery)</strong></p>
              <p><span>Estimated Dispatch:</span> <strong>Within 45–60 Minutes</strong></p>
            </div>

            <div className="success-actions">
              <button
                className="primary-btn full"
                onClick={() => setConfirmedOrder(null)}
              >
                Back to Storefront
              </button>

              <a
                className="secondary-btn center"
                href={`https://wa.me/91${PHONE}?text=${encodeURIComponent(`Hi Shas Fresh Mart, I have placed order #${confirmedOrder.order_id.slice(0, 8).toUpperCase()} for ${money(confirmedOrder.total)}. Please confirm dispatch!`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} /> Optional: Share Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick Order Dock */}
      <nav className="mobile-royal-dock" aria-label="Mobile quick actions">
        <a className="dock-btn dock-call" href={`tel:+91${PHONE}`}>
          <Phone size={15} /> Call
        </a>
        <a className="dock-btn dock-wa" href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
          <MessageCircle size={15} /> WhatsApp
        </a>
        <button className="dock-btn dock-cart" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={15} />
          <span>Bag ({count})</span>
        </button>
      </nav>

      {/* Floating Toast Notification */}
      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} aria-label="Dismiss notice">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function CrownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 19h20v2H2zM2 5l5 7 5-7 5 7 5-7v12H2z" />
    </svg>
  );
}

export default App;
