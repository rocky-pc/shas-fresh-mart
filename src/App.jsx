import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, BadgeCheck, CheckCircle2, ChevronDown, ChevronRight,
  Fish, Heart, Leaf, MapPin, Menu, Minus, Plus, Search, ShieldCheck,
  ShoppingBag, ShoppingCart, Sparkles, Truck, X, LogIn, LogOut,
  ClipboardList, Phone, PackageCheck, Star, Award, Flame, Clock,
  Scale, Utensils, MessageCircle, HelpCircle, Check, Info, RefreshCw, Zap
} from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';

const PHONE = '6380723356';

const FALLBACK_IMAGES = {
  fish: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=900&q=85',
  prawns: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85',
  chicken: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85',
  mutton: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85',
  default: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=900&q=85'
};

const cats = [
  { id: 'all', label: 'All Royal Cuts', icon: '✦' },
  { id: 'fish', label: 'Fresh Ocean Fish', icon: '🐟' },
  { id: 'prawns', label: 'Prawns & Shellfish', icon: '🦐' },
  { id: 'chicken', label: 'Artisanal Chicken', icon: '🍗' },
  { id: 'mutton', label: 'Prime Mutton', icon: '🥩' }
];

const seed = [
  ['sankara-big', 'Big Sankara (Red Snapper)', 'fish', 500, 'Freshly sourced coastal red snapper — sweet, firm, succulent flakes.', '👑 Bestseller', 'https://dukaan.b-cdn.net/700x700/webp/2360978/ac487292-5509-42e5-a921-8486b4e00e03/1607927836441.png', 'Ideal for spicy tamarind fish curry & pan bake'],
  ['vanjiram', 'Vanjiram (King Seer Fish)', 'fish', 1200, 'The undisputed ocean king — boneless round cuts, unmatched royal taste.', '💎 Royal Catch', 'https://commons.wikimedia.org/wiki/Special:FilePath/Vanjiram_fish.JPG?width=1200', 'Top choice for classic spicy tawa fry & fish biryani'],
  ['sankara-medium', 'Medium Sankara', 'fish', 430, 'Tender family-size red snapper — cleaned and descaled with perfection.', '✨ Fresh Today', 'https://dukaan.b-cdn.net/700x700/webp/2360978/ac487292-5509-42e5-a921-8486b4e00e03/1607927836441.png', 'The favorite for daily comforting Meen Kulambu'],
  ['sankara-small', 'Small Sankara', 'fish', 350, 'Sweet morning catch, full of coastal sweetness and delicate tenderness.', 'Value Pick', 'https://dukaan.b-cdn.net/700x700/webp/2360978/ac487292-5509-42e5-a921-8486b4e00e03/1607927836441.png', 'Crisps delightfully for shallow pan fry'],
  ['paara-medium', 'Medium Paara (Trevally)', 'fish', 450, 'Firm-textured sea trevally — expertly descaled, clean white meat.', '🌊 Dawn Catch', 'https://production.ruralindiaonline.org/uploads/04a_PAL_4326_NR_0c80371e5c.jpg', 'Absorbs rich masala for spicy tawa roast'],
  ['nethili', 'Nethili (Silver Anchovies)', 'fish', 450, 'Gleaming ocean anchovies — head trimmed and gutted on request.', '🔥 Popular', 'https://fresheatstrial.myshopify.com/cdn/shop/products/Anchovies_4122029675_grande.jpeg?v=1465875143', 'Unbeatable for crunchy, golden lemon-pepper fry'],
  ['seela-small', 'Small Seela (Barracuda)', 'fish', 350, 'Wild caught sea barracuda with tender white flakes and mild sweet notes.', 'Daily Fresh', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Barracuda_in_Salem_fish_market.jpg/1280px-Barracuda_in_Salem_fish_market.jpg', 'Superb in rustic village-style fish gravy'],
  ['seela-medium', 'Medium Seela', 'fish', 500, 'Carefully selected prime sea barracuda steaks — thick and meaty.', 'Prime Cut', 'https://commons.wikimedia.org/wiki/Special:FilePath/Barracuda_in_Salem_fish_market.jpg?width=1200', 'Perfect for both curry and shallow fry'],
  ['sura', 'Sura (Baby Shark)', 'fish', 450, 'Pure boneless delicacy — rich in protein, cleaned and cubed.', 'Healthy Choice', 'https://dukaan.b-cdn.net/1000x1000/webp/2360978/ac487292-5509-42e5-a921-8486b4e00e03/107775-cbyzjflxch-1544446102.jpg', 'Legendary for authentic Sura Puttu & pepper gravy'],
  ['vaval', 'Vaval (White Pomfret)', 'fish', 800, 'Silky, delicate coastal white pomfret with exquisite melt-in-mouth texture.', '👑 Premium', 'https://dukaan.b-cdn.net/700x700/webp/591197/9886c76f-2a7c-4145-8dfe-fb6bc17c45e7.png', 'World-class for tandoori & whole shallow pan fry'],
  ['kadama-medium', 'Medium Kadama (Squid)', 'prawns', 480, 'Freshly harvested sea squid — thoroughly cleaned, ink-free white tubes.', 'Ocean Delicacy', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=90', 'Great for calamari rings and spicy dry roast'],
  ['kadama-big', 'Big Jumbo Kadama', 'prawns', 600, 'Thick, succulent calamari rings bursting with natural sea sweetness.', 'Chef Choice', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=90', 'Delicious for spicy pepper masala stuffing'],
  ['prawn-medium', 'Medium Coastal Prawns', 'prawns', 550, 'Juicy coastal prawns — sweet, tender, deveined and deshelled upon wish.', '👑 Bestseller', 'https://kmamarineinternational.com/images/products/whole-shrimp.jpg', 'Classic for prawn thokku, biryani & golden fry'],
  ['prawn-big', 'Big Jumbo Tiger Prawns', 'prawns', 680, 'Imperial-sized sea prawns — meaty, sweet bite worthy of a royal feast.', '💎 Royal Feast', 'https://static.freshtohome.com/media/catalog/product/cache/1/image/18ae109e34f485bd0b0c075abec96b2e/w/h/whiteprawn-small-whiteprawnswhole_3_2.jpg', 'Masterpiece for butter garlic roast & royal pulao'],
  ['crab-medium', 'Medium Coastal Blue Crab', 'prawns', 600, 'Wild blue ocean crab with sweet succulent meat and full intact claws.', 'Seafood Special', 'https://commons.wikimedia.org/wiki/Special:FilePath/Fresh_Crab.jpg?width=1200', 'The holy grail for fiery Chettinad crab curry'],
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

const RECIPES = [
  {
    id: 'curry',
    title: 'Traditional Meen Kulambu & Spicy Curries',
    desc: 'Firm ocean fish cuts that absorb rich tamarind, coconut, and fiery coastal spices without disintegrating.',
    tag: 'Spicy Coastal Gravy',
    items: ['sankara-big', 'vanjiram', 'sura', 'seela-medium']
  },
  {
    id: 'fry',
    title: 'Crispy Golden Tawa & Pepper Fry Specials',
    desc: 'Delicate skin and firm meat that caramelizes into a crispy outer crust while remaining juicy inside.',
    tag: 'Crispy Crust & Aroma',
    items: ['nethili', 'vanjiram', 'paara-medium', 'prawn-medium']
  },
  {
    id: 'feast',
    title: 'Royal Biryani & Weekend Family Feasts',
    desc: 'Meaty, succulent prime cuts designed for celebration meals and fragrant slow-cooked biryanis.',
    tag: 'Grand Feast Selection',
    items: ['chicken', 'prawn-big', 'crab-medium', 'mutton']
  }
];

const FAQS = [
  {
    q: 'How fresh is the catch at Shas Fresh Mart?',
    a: 'Every morning at dawn (4:00 AM), our master procurement team hand-selects the top 10% catch directly at coastal fish landing harbors. All cuts are packed on food-grade ice, 100% formalin-free and chemical-free, and dispatched directly to your kitchen within hours.'
  },
  {
    q: 'Can I request custom cleaning and cutting preferences?',
    a: 'Yes, custom butchery and cleaning is 100% free! Simply add your instructions in the order note (e.g. "Medium curry cut", "Separate fish head", "Prawns deveined & deshelled", "Boneless chicken breast"). Our master butchers prepare every cut exactly to your cooking needs.'
  },
  {
    q: 'How do I place an order and track it?',
    a: 'You can add items to your bag and proceed through our royal checkout, or click any "WhatsApp Order" button across the store. Your order summary with total, items, and address is sent straight to our WhatsApp helpline (+91 6380723356) for instant confirmation.'
  },
  {
    q: 'What are your delivery hours and charges?',
    a: 'We operate 7 days a week from 6:30 AM to 8:30 PM. Morning orders placed early are delivered with priority for weekend lunch. We offer free express delivery for orders meeting the qualifying bag amount!'
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
    text: 'Transparent weights, honest rates, and instant WhatsApp confirmation. The country chicken was tender and flavorful. Outstanding quality and truly royal service.',
    item: 'Farm Fresh Chicken'
  }
];

const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const catName = id => cats.find(c => c.id === id)?.label || id;

function Logo({ admin = false }) {
  const [fallback, setFallback] = useState(false);
  return (
    <a className="royal-brand" href="#home">
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
  const [products, setProducts] = useState(seed);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [menu, setMenu] = useState(false);
  const [admin, setAdmin] = useState(location.pathname.startsWith('/admin'));
  const [session, setSession] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', area: '', notes: '' });
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeRecipe, setActiveRecipe] = useState('curry');

  useEffect(() => {
    if (!supabaseConfigured) return;
    supabase.from('products').select('*').eq('is_available', true).then(({ data }) => {
      if (data?.length) {
        setProducts(data.map(p => ({
          ...p,
          price: Number(p.price),
          desc: p.description,
          image: seed.find(s => s.id === p.id)?.image || p.image_url || seed[0].image,
          chefTip: seed.find(s => s.id === p.id)?.chefTip || 'Prepared fresh daily upon order'
        })));
      }
    });
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => l.subscription.unsubscribe();
  }, []);

  const items = useMemo(() => Object.values(cart), [cart]);
  const count = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);

  const shown = products.filter(p => {
    const matchesCat = category === 'all' || p.category === category;
    const query = search.toLowerCase().trim();
    const matchesSearch = !query || `${p.name} ${p.desc || p.description} ${p.chefTip || ''}`.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const add = p => {
    setCart(old => ({
      ...old,
      [p.id]: { ...p, quantity: (old[p.id]?.quantity || 0) + 1 }
    }));
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

  const handleImageError = (e, cat) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGES[cat] || FALLBACK_IMAGES.default;
  };

  const quickWa = product => {
    const text = encodeURIComponent(
      `👑 Hi Shas Fresh Mart! I would like to order *${product.name}* (${product.price > 0 ? money(product.price) + '/kg' : 'Inquiring today\'s market rate'}). Could you please confirm availability and earliest delivery?`
    );
    window.open(`https://wa.me/91${PHONE}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  async function login(e) {
    e.preventDefault();
    setLoginError('');
    if (!supabaseConfigured) {
      setLoginError('Supabase is not configured yet.');
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
      return;
    }
    const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
    if (p?.role !== 'admin') {
      await supabase.auth.signOut();
      setLoginError('This account does not have admin access.');
      return;
    }
    setSession(data.session);
    loadOrders();
  }

  async function loadOrders() {
    if (!supabaseConfigured) return;
    const { data, error } = await supabase.from('orders').select('*,order_items(*)').order('created_at', { ascending: false });
    if (error) setNotice('Unable to load orders. Check admin profile and database policies.');
    else setOrders(data || []);
  }

  useEffect(() => {
    if (session && admin) loadOrders();
  }, [session, admin]);

  async function status(id, value) {
    const { error } = await supabase.from('orders').update({ status: value }).eq('id', id);
    if (error) setNotice('Could not update order status.');
    else setOrders(old => old.map(o => o.id === id ? { ...o, status: value } : o));
  }

  async function place(e) {
    e.preventDefault();
    const orderLines = items.map(i => `• *${i.name}* x ${i.quantity} kg — ${money(i.price * i.quantity)}`).join('\n');
    const noteText = customer.notes ? `\n📝 *Cleaning/Cut Notes:* ${customer.notes}` : '';
    const formattedWaMsg = encodeURIComponent(
      `👑 *SHAS FRESH MART — ROYAL ORDER REQUEST*\n` +
      `-----------------------------------------\n` +
      `${orderLines}\n` +
      `-----------------------------------------\n` +
      `💰 *Estimated Subtotal:* ${money(subtotal)}\n\n` +
      `👤 *Customer Name:* ${customer.name}\n` +
      `📞 *Mobile:* ${customer.phone}\n` +
      `📍 *Address:* ${customer.address}${customer.area ? ', ' + customer.area : ''}` +
      `${noteText}\n\n` +
      `_Please confirm availability and dispatch time. Thank you!_`
    );

    if (!supabaseConfigured) {
      setCart({});
      setCheckout(false);
      setCartOpen(false);
      setCustomer({ name: '', phone: '', address: '', area: '', notes: '' });
      setNotice('Royal order compiled! Opening WhatsApp to confirm dispatch with the shop...');
      window.open(`https://wa.me/91${PHONE}?text=${formattedWaMsg}`, '_blank', 'noopener,noreferrer');
      return;
    }

    setBusy(true);
    const { data, error } = await supabase.rpc('place_order', {
      p_customer_name: customer.name,
      p_phone: customer.phone,
      p_address: customer.address,
      p_area: customer.area || null,
      p_notes: customer.notes || null,
      p_items: items.map(i => ({ product_id: i.id, quantity: i.quantity }))
    });
    setBusy(false);

    if (error) {
      setNotice(error.message || 'Order could not be saved to DB. Forwarding via WhatsApp...');
    }

    setCart({});
    setCheckout(false);
    setCartOpen(false);
    setCustomer({ name: '', phone: '', address: '', area: '', notes: '' });
    setNotice('Imperial order placed! Opening WhatsApp to notify Shas Fresh Mart...');
    window.open(`https://wa.me/91${PHONE}?text=${formattedWaMsg}`, '_blank', 'noopener,noreferrer');
  }

  // Preserve admin layout functionality
  if (admin) {
    return (
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <Logo admin />
          <p className="side-caption">STORE WORKSPACE</p>
          <button className={tab === 'orders' ? 'side-item selected' : 'side-item'} onClick={() => setTab('orders')}>
            <ClipboardList size={18} /> Orders
          </button>
          <button className={tab === 'products' ? 'side-item selected' : 'side-item'} onClick={() => setTab('products')}>
            <PackageCheck size={18} /> Products
          </button>
          <div className="sidebar-foot">
            <span className="live-dot" /> Store dashboard
            <button onClick={() => { history.pushState({}, '', '/'); setAdmin(false); }}>
              View store <ArrowRight size={14} />
            </button>
          </div>
        </aside>
        <main className="admin-main">
          <header className="admin-head">
            <div>
              <span className="eyebrow">SHAS FRESH MART</span>
              <h1>Store management</h1>
            </div>
            {session && (
              <button className="outline-btn" onClick={async () => { await supabase.auth.signOut(); setSession(null); }}>
                <LogOut size={16} /> Sign out
              </button>
            )}
          </header>
          {!session ? (
            <div className="login-center">
              <form className="login-card" onSubmit={login}>
                <div className="login-symbol"><ShieldCheck size={27} /></div>
                <span className="eyebrow">ADMIN ACCESS</span>
                <h2>Welcome back</h2>
                <p>Sign in to manage orders and store activity.</p>
                <label>
                  Email address
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@shasfreshmart.com" />
                </label>
                <label>
                  Password
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" />
                </label>
                {loginError && <p className="error-text">{loginError}</p>}
                <button className="primary-btn full" type="submit"><LogIn size={17} /> Sign in securely</button>
                <small className="secure-note"><ShieldCheck size={14} /> Secured by Supabase Auth and RLS</small>
              </form>
            </div>
          ) : tab === 'orders' ? (
            <>
              <div className="stats-row">
                <div><span>All orders</span><strong>{orders.length}</strong><small>Orders received</small></div>
                <div><span>Pending</span><strong>{orders.filter(o => o.status === 'pending').length}</strong><small>Needs attention</small></div>
                <div><span>Confirmed</span><strong>{orders.filter(o => o.status === 'confirmed').length}</strong><small>Being prepared</small></div>
                <div><span>Order value</span><strong>{money(orders.filter(o => o.status !== 'cancelled').reduce((n, o) => n + Number(o.total || 0), 0))}</strong><small>Non-cancelled orders</small></div>
              </div>
              <section className="admin-panel">
                <div className="panel-title">
                  <div><h2>Recent orders</h2><p>Customer details and fulfilment status.</p></div>
                  <button className="outline-btn" onClick={loadOrders}>Refresh</button>
                </div>
                {orders.length === 0 ? (
                  <div className="empty-state"><ShoppingBag size={30} /><h3>No orders yet</h3><p>Customer orders will show here.</p></div>
                ) : orders.map(o => (
                  <article className="order-card" key={o.id}>
                    <div className="order-head">
                      <div>
                        <small>ORDER {o.id.slice(0, 8).toUpperCase()} · {new Date(o.created_at).toLocaleString('en-IN')}</small>
                        <h3>{o.customer_name}</h3>
                      </div>
                      <select value={o.status} onChange={e => status(o.id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for delivery</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <p><Phone size={15} /> {o.phone}</p>
                    <p><MapPin size={15} /> {o.address}{o.area ? ', ' + o.area : ''}</p>
                    <div className="order-lines">
                      {(o.order_items || []).map((it, i) => (
                        <div key={i}><span>{it.product_name} × {it.quantity} kg</span><strong>{money(it.line_total)}</strong></div>
                      ))}
                    </div>
                    {o.notes && <p className="order-note">Note: {o.notes}</p>}
                    <div className="order-total"><span>Total</span><strong>{money(o.total)}</strong></div>
                    <a className="order-wa" href={'https://wa.me/91' + o.phone.replace(/\D/g, '') + '?text=' + encodeURIComponent('Hi ' + o.customer_name + ', your Shas Fresh Mart order is ' + o.status.replaceAll('_', ' ') + '.')} target="_blank" rel="noreferrer">
                      Message customer on WhatsApp <ArrowRight size={15} />
                    </a>
                  </article>
                ))}
              </section>
            </>
          ) : (
            <section className="admin-panel">
              <div className="panel-title"><div><h2>Product catalogue</h2><p>Manage availability and prices in Supabase.</p></div></div>
              {products.map(p => (
                <div className="product-admin-row" key={p.id}>
                  <span>{p.name}<small>{catName(p.category)}</small></span>
                  <strong>{money(p.price)} / kg</strong>
                </div>
              ))}
            </section>
          )}
        </main>
        {notice && <div className="toast">{notice}<button onClick={() => setNotice('')}><X size={15} /></button></div>}
      </div>
    );
  }

  // Enhanced storefront experience
  return (
    <div id="home">
      {/* Royal Marquee Announcement Bar */}
      <div className="announcement">
        <div className="announcement-inner">
          <span className="announcement-badge"><CrownIcon /> DAWN CATCH 4:00 AM</span>
          <span>Imperial Ocean Seafood, Artisanal Chicken & Tender Mutton</span>
          <span className="separator">•</span>
          <span>Ice-Packed Express Home Delivery</span>
          <span className="separator">•</span>
          <a href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
            <MessageCircle size={14} /> VIP WhatsApp Order: +91 {PHONE}
          </a>
        </div>
      </div>

      {/* Royal Sticky Header */}
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className={menu ? 'nav-links nav-open' : 'nav-links'}>
            <a href="#shop" onClick={() => setMenu(false)}>Imperial Catch</a>
            <a href="#categories" onClick={() => setMenu(false)}>Categories</a>
            <a href="#standard" onClick={() => setMenu(false)}>Royal Standard</a>
            <a href="#culinary" onClick={() => setMenu(false)}>Chef's Guide</a>
            <a href="#reviews" onClick={() => setMenu(false)}>Customer Praise</a>
            <a href="#faq" onClick={() => setMenu(false)}>FAQ</a>
          </nav>
          <div className="header-actions">
            <a className="header-wa-btn" href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> WhatsApp Order
            </a>
            <button className="icon-btn" onClick={() => document.getElementById('search')?.focus()} aria-label="Search">
              <Search size={19} />
            </button>
            <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open Shopping Bag">
              <ShoppingBag size={18} />
              <span>Bag</span>
              <b>{count}</b>
              {subtotal > 0 && <span className="cart-amount-preview">{money(subtotal)}</span>}
            </button>
            <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Cinematic Royal Hero */}
        <section className="hero">
          <video
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
          </video>

          <div className="hero-copy">
            <div className="kicker">
              <span /> PURVEYORS OF IMPERIAL OCEAN CATCH & FRESH MEATS
            </div>
            <h1>
              Freshness Fit For <br />
              <em>Royalty.</em>
            </h1>
            <p>
              Direct from pristine coastal harbors at dawn. Descaled and cleaned with surgical care,
              sub-zero ice insulated, and brought straight to your family's table.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#shop">
                Explore Today's Catch <ArrowRight size={17} />
              </a>
              <a className="text-btn" href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
                <MessageCircle size={17} /> WhatsApp VIP Order
              </a>
            </div>
            <div className="hero-trust">
              <span><BadgeCheck size={18} /> 100% Formalin-Free</span>
              <span><Truck size={18} /> 45-Min Express Delivery</span>
              <span><Scale size={18} /> Honest Net-Weight Only</span>
            </div>
          </div>

          <div className="hero-photo">
            <img
              src="https://i0.wp.com/thelocavore.in/wp-content/uploads/2024/02/IMG_2286-1-scaled.jpg?fit=1920%2C2560&ssl=1"
              alt="Imperial Fresh Seafood on Ice"
              onError={e => handleImageError(e, 'fish')}
            />
            <div className="floating-note">
              <span><Leaf size={22} /></span>
              <div>
                <strong>The Royal Cold-Chain</strong>
                <small>Harvested 4:00 AM • Zero Chemical Preservatives</small>
              </div>
              <BadgeCheck size={24} />
            </div>
            <div className="photo-stamp">
              <span>ROYAL</span>
              <strong>SEAL</strong>
              <small>100% PURE CATCH</small>
            </div>
          </div>

          <div className="hero-foot">
            <span>👑 THE GOLD STANDARD IN FRESHNESS</span>
            <span>DAILY MORNING LANDINGS • DISPATCHING NOW</span>
          </div>
        </section>

        {/* 4 Pillars Trust Highlights */}
        <section className="trust-strip">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon"><Flame size={22} /></div>
              <div>
                <h4>Dawn Dockside Selection</h4>
                <p>Selected at 4:00 AM coastal harbor landings</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon"><ShieldCheck size={22} /></div>
              <div>
                <h4>Zero Chemical Guarantee</h4>
                <p>100% chemical & formalin-free pure catch</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon"><Utensils size={22} /></div>
              <div>
                <h4>Free Custom Butchery</h4>
                <p>Curry cut, fry slices & deveining on request</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon"><Zap size={22} /></div>
              <div>
                <h4>Sub-Zero Ice Express</h4>
                <p>Chilled insulated boxes delivered to your door</p>
              </div>
            </div>
          </div>
        </section>

        {/* Royal Category Showcase */}
        <section className="category-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE ROYAL SELECTION</span>
              <h2>Curated Imperial Categories<span className="yellow-dot">.</span></h2>
            </div>
            <p>Every cut inspected for peak freshness, firmness, and natural flavor.</p>
          </div>
          <div className="category-grid">
            {[
              { id: 'fish', label: 'Fresh Ocean Fish', sub: '10 Handpicked Varieties', count: '10 items', image: seed[0].image },
              { id: 'prawns', label: 'Prawns & Shellfish', sub: 'Coastal Sweetness', count: '5 items', image: seed[12].image },
              { id: 'chicken', label: 'Artisanal Chicken', sub: 'RO Cleaned • Tender', count: '2 cuts', image: seed[15].image },
              { id: 'mutton', label: 'Prime Mountain Mutton', sub: 'Tender Pasture Cuts', count: 'Daily rate', image: seed[17].image }
            ].map(c => (
              <button
                key={c.id}
                className="category-card"
                onClick={() => {
                  setCategory(c.id);
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img src={c.image} alt={c.label} onError={e => handleImageError(e, c.id)} />
                <span className="cat-shade" />
                <span className="cat-copy">
                  <small>{c.sub}</small>
                  <strong>{c.label}</strong>
                  <span>{c.count}</span>
                  <i><ArrowRight size={17} /></i>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* The Royal Market / Catalogue */}
        <section className="shop-section" id="shop">
          <div className="section-heading shop-heading">
            <div>
              <span className="eyebrow">TODAY'S MORNING HARVEST</span>
              <h2>Imperial Catch & Prime Cuts<span className="yellow-dot">.</span></h2>
              <p>Transparent pricing, weighed after cleaning upon request. Add to bag or order directly on WhatsApp.</p>
            </div>
            <div className="shop-command-bar">
              <div className="search-box">
                <Search size={18} />
                <input
                  id="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search Vanjiram, Sankara, Prawns, Chicken…"
                />
                {search && (
                  <button className="search-clear-btn" onClick={() => setSearch('')} aria-label="Clear search">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="filter-row">
            {cats.map(c => (
              <button
                key={c.id}
                className={category === c.id ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setCategory(c.id)}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
            <span>Showing {shown.length} of {products.length} products</span>
          </div>

          <div className="product-grid">
            {shown.map(p => (
              <article className="product-card" key={p.id}>
                <div className="product-image">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    onError={e => handleImageError(e, p.category)}
                  />
                  {p.tag && (
                    <span className={`product-tag ${p.tag.includes('Fresh') ? 'fresh-tag' : ''}`}>
                      {p.tag}
                    </span>
                  )}
                  {p.price > 0 && (
                    cart[p.id] ? (
                      <div className="card-qty-control" aria-label={p.name + ' quantity stepper'}>
                        <button type="button" onClick={() => qty(p.id, -1)} aria-label={'Remove one ' + p.name}>
                          <Minus size={14} />
                        </button>
                        <strong>{cart[p.id].quantity} kg</strong>
                        <button type="button" onClick={() => qty(p.id, 1)} aria-label={'Add one ' + p.name}>
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button className="quick-add" onClick={() => add(p)} aria-label={'Quick add ' + p.name}>
                        <Plus size={20} />
                      </button>
                    )
                  )}
                </div>

                <div className="product-info">
                  <span className="product-cat">{catName(p.category)}</span>
                  <h3>{p.name}</h3>
                  <p>{p.desc || p.description}</p>
                  <div className="product-chef-tip">
                    <Utensils size={13} />
                    <span>{p.chefTip}</span>
                  </div>

                  <div className="product-bottom">
                    {p.price > 0 ? (
                      <>
                        <div>
                          <strong>{money(p.price)}</strong>
                          <span> / kg</span>
                        </div>
                        <div className="product-actions">
                          <button
                            className={cart[p.id] ? 'add-btn added' : 'add-btn'}
                            onClick={() => add(p)}
                          >
                            {cart[p.id] ? <CheckCircle2 size={15} /> : <Plus size={15} />}
                            {cart[p.id] ? 'Add more' : 'Add to Bag'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <strong>Ask for Today's Rate</strong>
                        </div>
                        <button className="wa-ask-btn" onClick={() => quickWa(p)}>
                          <MessageCircle size={15} /> WhatsApp
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!shown.length && (
            <div className="empty-state">
              <ShoppingBag size={38} />
              <h3>No match found in today's catch</h3>
              <p>Try searching for Vanjiram, Sankara, Prawns, or clear your filters.</p>
              <button className="primary-btn" onClick={() => { setSearch(''); setCategory('all'); }}>
                Reset Catalogue Filters
              </button>
            </div>
          )}
        </section>

        {/* The Royal Standard (Why Discerning Families Choose Shas) */}
        <section className="promise-section" id="standard">
          <div className="promise-photo">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85"
              alt="Fresh Coastal Fish Harvest"
              onError={e => handleImageError(e, 'fish')}
            />
            <div>
              <span>THE ROYAL PROMISE</span>
              <strong>Uncompromising Freshness.<br />Honest Royal Service.</strong>
            </div>
          </div>

          <div className="promise-copy">
            <span className="eyebrow">THE SHAS QUALITY CHARTER</span>
            <h2>We believe your family deserves royal purity on every plate.</h2>
            <p>
              We bypass intermediate warehouses and commercial cold storage that sit for days.
              Every order is hand-selected from dawn landings, prepared with surgical hygiene,
              and delivered fresh on ice.
            </p>

            <div className="promise-item">
              <span><Award size={22} /></span>
              <div>
                <strong>Dockside Selection at 4:00 AM</strong>
                <p>Only the top 10% premium catch is chosen from local coastal fishermen every dawn.</p>
              </div>
            </div>

            <div className="promise-item">
              <span><ShieldCheck size={22} /></span>
              <div>
                <strong>100% Chemical & Formalin Free</strong>
                <p>Preserved purely on natural crushed food-grade ice. Zero chemicals or artificial glazing.</p>
              </div>
            </div>

            <div className="promise-item">
              <span><Scale size={22} /></span>
              <div>
                <strong>True Net-Weight Policy</strong>
                <p>Cleaned, gutted, descaled. You pay only for the cleaned net weight — zero waste charging.</p>
              </div>
            </div>

            <div className="promise-item">
              <span><Truck size={22} /></span>
              <div>
                <strong>Sub-Zero Insulated Cold Chain</strong>
                <p>Packed in food-grade insulated boxes that keep seafood under 4°C right to your kitchen door.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chef's Culinary Guide / Cooking Pairings */}
        <section className="culinary-section" id="culinary">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CHEF'S INSPIRATION</span>
              <h2>What Are You Cooking Today?<span className="yellow-dot">.</span></h2>
            </div>
            <p>Choose your planned recipe for our master butcher's recommended catch.</p>
          </div>

          <div className="culinary-nav">
            {RECIPES.map(r => (
              <button
                key={r.id}
                className={activeRecipe === r.id ? 'culinary-tab active' : 'culinary-tab'}
                onClick={() => setActiveRecipe(r.id)}
              >
                <Utensils size={15} />
                <span>{r.title.split('&')[0]}</span>
              </button>
            ))}
          </div>

          {(() => {
            const currentRecipe = RECIPES.find(r => r.id === activeRecipe) || RECIPES[0];
            const matchingProducts = products.filter(p => currentRecipe.items.includes(p.id));

            return (
              <div className="culinary-card">
                <div className="culinary-info">
                  <span className="culinary-badge">{currentRecipe.tag}</span>
                  <h3>{currentRecipe.title}</h3>
                  <p>{currentRecipe.desc}</p>
                  <a className="primary-btn" href="#shop" onClick={() => setCategory('all')}>
                    Order Recommended Cuts <ArrowRight size={16} />
                  </a>
                </div>

                <div className="culinary-recs">
                  {matchingProducts.map(p => (
                    <div className="rec-item" key={p.id} onClick={() => add(p)}>
                      <img src={p.image} alt={p.name} onError={e => handleImageError(e, p.category)} />
                      <strong>{p.name}</strong>
                      <span>{p.price > 0 ? money(p.price) + '/kg' : 'Market Price'}</span>
                      <small style={{ color: '#10b981', display: 'block', fontSize: 10, marginTop: 4 }}>
                        + Add to Bag
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

        {/* Customer Praise & Royal Testimonials */}
        <section className="testimonials-section" id="reviews">
          <div className="section-heading">
            <div>
              <span className="eyebrow">VERIFIED PRAISE</span>
              <h2>Loved by 2,500+ Discerning Families<span className="yellow-dot">.</span></h2>
            </div>
            <p>Here is why home chefs and families rate Shas Fresh Mart 4.9 out of 5 stars.</p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, idx) => (
              <div className="testimonial-card" key={idx}>
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f5d061" />)}
                </div>
                <p>"{t.text}"</p>
                <div className="testimonial-footer">
                  <div className="testimonial-user">
                    <strong>{t.name}</strong>
                    <span>{t.location} • {t.item}</span>
                  </div>
                  <span className="verified-tag">
                    <CheckCircle2 size={13} /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VIP Express Delivery Banner */}
        <section className="delivery-banner" id="delivery">
          <div className="delivery-symbol">
            <Truck size={30} />
          </div>
          <div>
            <span className="eyebrow">CHILLED TO PERFECTION</span>
            <h2>Direct Express Delivery Straight to Your Palace.</h2>
            <p>
              Order online in seconds or message our master fishmongers directly on WhatsApp.
              We pack every order with food-grade ice and dispatch immediately.
            </p>
          </div>
          <a className="primary-btn light" href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> Chat with Shop <ArrowRight size={17} />
          </a>
        </section>

        {/* Interactive FAQ Section */}
        <section className="faq-section" id="faq">
          <div className="faq-heading">
            <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
            <h2>Everything You Need to Know<span className="yellow-dot">.</span></h2>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={activeFaq === i ? 'faq-item open' : 'faq-item'}
              >
                <button
                  className="faq-question"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  aria-expanded={activeFaq === i}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={19} />
                </button>
                {activeFaq === i && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Royal Footer */}
      <footer className="footer">
        <div className="footer-main">
          <div>
            <Logo />
            <p>
              Purveyors of imperial ocean seafood, artisanal country chicken, and tender mountain mutton.
              Cleaned with surgical hygiene, delivered ice-chilled to your kitchen.
            </p>
          </div>
          <div>
            <strong>Quick Navigation</strong>
            <a href="#shop">Imperial Catch</a>
            <a href="#categories">Product Categories</a>
            <a href="#standard">Our Royal Charter</a>
            <a href="#culinary">Chef's Recipe Guide</a>
            <a href="#reviews">Customer Reviews</a>
            <a href="#faq">Frequently Asked</a>
          </div>
          <div>
            <strong>Order & Enquiries</strong>
            <a href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> WhatsApp: +91 {PHONE}
            </a>
            <a href={`tel:+91${PHONE}`}>
              <Phone size={15} /> Call: +91 {PHONE}
            </a>
            <span>Operating Hours: 6:30 AM – 8:30 PM (7 Days)</span>
          </div>
          <div className="footer-promise">
            <ShieldCheck size={28} />
            <span>100% Purity &<br />Freshness Guarantee</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Shas Fresh Mart. All rights reserved. Imperial Quality Seafood & Meats.</span>
          <button onClick={() => { history.pushState({}, '', '/admin'); setAdmin(true); }}>
            Store Workspace Login
          </button>
        </div>
      </footer>

      {/* Royal Cart Drawer */}
      {cartOpen && (
        <div className="backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}>
          <aside className="cart-drawer">
            <div className="drawer-head">
              <div>
                <span className="eyebrow">YOUR ROYAL SELECTION</span>
                <h2>Your Shopping Bag ({count})</h2>
                <p>Inspected, ice-packed, and prepared upon checkout.</p>
              </div>
              <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close Bag">
                <X size={20} />
              </button>
            </div>

            {items.length ? (
              <>
                <div className="delivery-perk-bar">
                  <div className="perk-text">
                    {subtotal >= 1000 ? (
                      <span>🎉 Unlocked: Complimentary Express Ice Packing & Priority Delivery!</span>
                    ) : (
                      <span>Add {money(1000 - subtotal)} more for VIP Priority Cold Packaging</span>
                    )}
                  </div>
                  <div className="perk-progress">
                    <div className="perk-fill" style={{ width: `${Math.min(100, (subtotal / 1000) * 100)}%` }} />
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

                <div className="cart-summary">
                  <div>
                    <span>Estimated Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  <small>
                    Delivery charge and final net weight are confirmed transparently by the store.
                  </small>
                  <button
                    className="primary-btn full"
                    onClick={() => { setCartOpen(false); setCheckout(true); }}
                  >
                    Proceed to Delivery Details <ArrowRight size={17} />
                  </button>
                  <button className="text-btn center" onClick={() => setCartOpen(false)}>
                    Add More Fresh Catch
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

      {/* Royal Checkout Modal */}
      {checkout && (
        <div className="backdrop modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setCheckout(false); }}>
          <section className="checkout-modal">
            <div className="drawer-head">
              <div>
                <span className="eyebrow">FINAL STEP</span>
                <h2>Delivery & Custom Butchery Details</h2>
                <p>Tell our master butchers where to deliver your ice-chilled order.</p>
              </div>
              <button className="icon-btn" onClick={() => setCheckout(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form className="checkout-form" onSubmit={place}>
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
                    value={customer.area}
                    onChange={e => setCustomer({ ...customer, area: e.target.value })}
                    placeholder="e.g. Near Velachery Bus Terminus"
                  />
                </label>
              </div>

              <label>
                Full Delivery Address
                <textarea
                  required
                  rows={3}
                  value={customer.address}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Apartment name, door number, street..."
                />
              </label>

              <label>
                Custom Cutting & Cleaning Instructions <span className="muted">(Complimentary)</span>
                <textarea
                  rows={2}
                  value={customer.notes}
                  onChange={e => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder="e.g. Vanjiram thin fry slices, Sankara curry cuts, Prawns deveined..."
                />
              </label>

              <div className="checkout-total">
                <span>
                  Order Subtotal <small>{count} kg in bag</small>
                </span>
                <strong>{money(subtotal)}</strong>
              </div>

              {!supabaseConfigured && (
                <p className="form-hint">
                  👑 Online order connects directly with Shas Fresh Mart WhatsApp for instant dispatch.
                </p>
              )}

              <button className="primary-btn full" type="submit" disabled={busy}>
                {busy ? 'Dispatching Request…' : (
                  <>
                    Confirm & Send to WhatsApp <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="checkout-legal">
                <ShieldCheck size={14} /> 100% Secure & Private • Delivered In Insulated Food-Grade Boxes
              </p>
            </form>
          </section>
        </div>
      )}

      {/* Mobile Sticky Quick Order Dock */}
      <nav className="mobile-royal-dock" aria-label="Mobile quick actions">
        <a className="dock-btn dock-call" href={`tel:+91${PHONE}`}>
          <Phone size={16} /> Call
        </a>
        <a className="dock-btn dock-wa" href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">
          <MessageCircle size={16} /> WhatsApp
        </a>
        <button className="dock-btn dock-cart" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={16} />
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
      <path d="M2 19h20v2H2zM2 5l5 7 5-7 5 7 5-7v12H2z"/>
    </svg>
  );
}

export default App;
