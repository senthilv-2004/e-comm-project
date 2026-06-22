// src/data/products.js — Static product catalog with 10 products
// Each product includes: images, color variants, reviews, specs, offers, related products

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    category: "Smartphones",
    brand: "Apple",
    description: "The iPhone 15 Pro Max features a groundbreaking A17 Pro chip, the first to be built on a 3-nanometer process. It delivers a massive leap in GPU performance for high-end mobile gaming and pro-level creative workflows. The new titanium design is both strong and incredibly light, while the 6.7-inch Super Retina XDR display with ProMotion delivers an always-on, stunning visual experience with up to 2000 nits of outdoor brightness.",
    shortDescription: "Titanium design. A17 Pro chip. 48MP camera system.",
    price: 1199.00,
    originalPrice: 1399.00,
    discount: 14,
    rating: 4.8,
    reviewCount: 2847,
    stock: 45,
    isFeatured: true,
    specifications: {
      "Display": "6.7\" Super Retina XDR OLED, 2796×1290, ProMotion 120Hz",
      "Processor": "A17 Pro chip, 6-core CPU, 6-core GPU",
      "Storage": "256GB / 512GB / 1TB",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
      "Battery": "Up to 29 hours video playback",
      "OS": "iOS 17",
      "Connectivity": "5G, Wi-Fi 6E, Bluetooth 5.3, USB-C",
      "Weight": "221 g"
    },
    highlights: [
      "A17 Pro chip — the most powerful chip ever in a smartphone",
      "48MP main camera with 5x optical zoom telephoto",
      "Titanium design — strongest and lightest Pro material",
      "Action Button for instant access to your favorite feature",
      "USB-C with USB 3 speeds for pro workflows"
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80"
    ],
    colorVariants: [
      { name: "Natural Titanium", hex: "#8F8A81", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80" },
      { name: "Blue Titanium", hex: "#394E5C", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80" },
      { name: "White Titanium", hex: "#F2F1ED", image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80" },
      { name: "Black Titanium", hex: "#3C3C3D", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "Alex R.", avatar: "AR", rating: 5, date: "2024-11-15", title: "Best iPhone ever made", comment: "The titanium build is incredible. Feels so light yet premium. Camera system is absolutely next level, especially the 5x telephoto." },
      { id: 2, user: "Sarah M.", avatar: "SM", rating: 5, date: "2024-10-28", title: "Worth every penny", comment: "Upgraded from iPhone 13 Pro and the difference is staggering. Battery easily lasts all day with heavy use. The Action Button is surprisingly useful." },
      { id: 3, user: "James K.", avatar: "JK", rating: 4, date: "2024-12-03", title: "Great but pricey", comment: "Excellent phone in every way. Only reason for 4 stars is the price — it's getting steep. But if you can afford it, you won't be disappointed." },
      { id: 4, user: "Priya D.", avatar: "PD", rating: 5, date: "2024-11-22", title: "Photography beast", comment: "As a photographer, the camera improvements are stunning. The 48MP sensor captures incredible detail, and the telephoto zoom is a game changer." },
      { id: 5, user: "Mike L.", avatar: "ML", rating: 4, date: "2024-12-10", title: "Solid upgrade", comment: "USB-C finally! Transfer speeds are blazing fast. The titanium frame doesn't scratch as easily as the old stainless steel models." }
    ],
    offers: [
      { type: "discount", text: "Save $200 — Limited Time Holiday Offer" },
      { type: "bank", text: "Extra 5% off with Premium Credit Cards" },
      { type: "exchange", text: "Up to $600 off with eligible trade-in" },
      { type: "shipping", text: "Free Express Shipping" }
    ],
    relatedProducts: [2, 7, 10, 3],
    warranty: "1-Year Apple Limited Warranty"
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    category: "Smartphones",
    brand: "Samsung",
    description: "The Samsung Galaxy S24 Ultra introduces a new era of Galaxy AI, built into the very core of the device. Powered by the Snapdragon 8 Gen 3 for Galaxy, it delivers unmatched performance and intelligent features. The stunning 6.8-inch Dynamic AMOLED 2X display with 2600 nits brightness ensures vivid visuals in any environment. With its embedded S Pen, titanium frame, and the most advanced Galaxy camera system ever, it redefines what a smartphone can do.",
    shortDescription: "Galaxy AI. Snapdragon 8 Gen 3. 200MP camera. S Pen built-in.",
    price: 1299.00,
    originalPrice: 1419.99,
    discount: 9,
    rating: 4.7,
    reviewCount: 2156,
    stock: 38,
    isFeatured: true,
    specifications: {
      "Display": "6.8\" Dynamic AMOLED 2X, 3088×1440, 120Hz Adaptive",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "Storage": "256GB / 512GB / 1TB",
      "Camera": "200MP Main + 12MP Ultra Wide + 50MP 5x + 10MP 3x Telephoto",
      "Battery": "5000mAh, 45W Wired + 15W Wireless",
      "OS": "Android 14 with One UI 6.1",
      "Connectivity": "5G, Wi-Fi 7, Bluetooth 5.3, UWB",
      "Weight": "232 g"
    },
    highlights: [
      "Galaxy AI — Circle to Search, Live Translate, Chat Assist",
      "200MP sensor captures ultra-detailed photos day and night",
      "Built-in S Pen for notes, sketches, and remote control",
      "Titanium frame with Armor Aluminum — toughest Galaxy ever",
      "7 years of OS and security updates guaranteed"
    ],
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80",
      "https://images.unsplash.com/photo-1600087626014-e652e18bbff2?w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886571?w=800&q=80"
    ],
    colorVariants: [
      { name: "Titanium Gray", hex: "#9B9B9B", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80" },
      { name: "Titanium Black", hex: "#2D2D2D", image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80" },
      { name: "Titanium Violet", hex: "#9B8DB7", image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80" },
      { name: "Titanium Yellow", hex: "#E8D59E", image: "https://images.unsplash.com/photo-1600087626014-e652e18bbff2?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "David T.", avatar: "DT", rating: 5, date: "2024-02-10", title: "AI features are incredible", comment: "Circle to Search alone is worth the upgrade. Galaxy AI features feel like the future of smartphones. The 200MP camera is insane." },
      { id: 2, user: "Emily C.", avatar: "EC", rating: 5, date: "2024-03-05", title: "Perfect for productivity", comment: "The S Pen is invaluable for my work. Taking notes, signing documents, and the new AI translate feature during calls is a game changer." },
      { id: 3, user: "Ryan B.", avatar: "RB", rating: 4, date: "2024-02-28", title: "Almost perfect", comment: "Amazing phone. The only minor issue is the size — it's a big phone. But the screen quality and camera make it worth carrying around." },
      { id: 4, user: "Lisa W.", avatar: "LW", rating: 5, date: "2024-04-12", title: "Best Android phone period", comment: "Battery lasts all day easily. The screen is the best I've ever seen on any device. Photo editing AI tools are mind-blowing." }
    ],
    offers: [
      { type: "discount", text: "Save $120 — Spring Sale Event" },
      { type: "bank", text: "No-cost EMI available on select cards" },
      { type: "exchange", text: "Up to $500 off with Galaxy trade-in" },
      { type: "bundle", text: "Free Galaxy Buds FE with purchase" }
    ],
    relatedProducts: [1, 8, 7, 10],
    warranty: "1-Year Samsung Manufacturer Warranty"
  },
  {
    id: 3,
    name: "Apple Watch Series 9",
    slug: "apple-watch-series-9",
    category: "Wearables",
    brand: "Apple",
    description: "The Apple Watch Series 9 brings a magical new way to interact with your watch using Double Tap — simply tap your index finger and thumb together to answer calls, snooze alarms, and control apps without touching the display. Powered by the S9 SiP chip, it features an incredibly bright 2000-nit always-on Retina display, advanced health sensors including blood oxygen monitoring, ECG, and temperature sensing. The perfect companion for fitness, health tracking, and staying connected.",
    shortDescription: "Double Tap gesture. S9 chip. 2000-nit display.",
    price: 399.00,
    originalPrice: 429.00,
    discount: 7,
    rating: 4.6,
    reviewCount: 1893,
    stock: 72,
    isFeatured: true,
    specifications: {
      "Display": "45mm Always-On Retina LTPO OLED, 2000 nits",
      "Processor": "Apple S9 SiP with 64-bit dual-core",
      "Storage": "64GB",
      "Sensors": "Blood Oxygen, ECG, Temperature, Accelerometer, Gyroscope",
      "Battery": "Up to 18 hours (36 hours Low Power Mode)",
      "Water Resistance": "WR50 (50 meters)",
      "Connectivity": "Wi-Fi, Bluetooth 5.3, NFC, Ultra Wideband",
      "Compatibility": "iPhone Xs or later with iOS 17+"
    },
    highlights: [
      "Double Tap — control your watch without touching the screen",
      "Brightest Apple Watch display ever at 2000 nits",
      "Advanced health monitoring: Blood O2, ECG, temperature",
      "Precision Finding for iPhone with Ultra Wideband chip",
      "Carbon neutral with sport loop band options"
    ],
    images: [
      "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=800&q=80",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80"
    ],
    colorVariants: [
      { name: "Midnight", hex: "#1C1C1E", image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&q=80" },
      { name: "Starlight", hex: "#F5E6D3", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80" },
      { name: "Silver", hex: "#C0C0C0", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" },
      { name: "(PRODUCT)RED", hex: "#BF0013", image: "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "Nina F.", avatar: "NF", rating: 5, date: "2024-10-20", title: "Love the Double Tap!", comment: "The Double Tap gesture is incredibly useful when my hands are full. Health tracking is comprehensive and accurate." },
      { id: 2, user: "Carlos G.", avatar: "CG", rating: 4, date: "2024-11-05", title: "Great fitness companion", comment: "Tracks my runs and workouts perfectly. The screen brightness is amazing outdoors. Battery could be a bit better though." },
      { id: 3, user: "Hannah L.", avatar: "HL", rating: 5, date: "2024-12-01", title: "Essential daily wear", comment: "Can't imagine life without it now. The health features give peace of mind, and the display is gorgeous." },
      { id: 4, user: "Tom S.", avatar: "TS", rating: 4, date: "2024-11-18", title: "Solid smartwatch", comment: "Great upgrade from Series 7. The S9 chip makes everything snappier. Wish the battery lasted 2 days though." }
    ],
    offers: [
      { type: "discount", text: "Save $30 — Apple Watch Event" },
      { type: "bundle", text: "Free extra band with purchase" },
      { type: "shipping", text: "Free standard shipping" },
      { type: "applecare", text: "AppleCare+ available for $79" }
    ],
    relatedProducts: [1, 10, 4, 7],
    warranty: "1-Year Apple Limited Warranty"
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5",
    category: "Audio",
    brand: "Sony",
    description: "The Sony WH-1000XM5 headphones set the benchmark for premium noise cancellation. Featuring two processors controlling eight microphones, the Auto NC Optimizer automatically adapts noise cancellation to your environment. The newly designed soft-fit leather provides exceptional comfort for all-day listening. With 30mm drivers precisely engineered for crystal-clear audio, LDAC support for Hi-Res wireless audio, and up to 30 hours of battery life, these headphones deliver an unrivaled listening experience.",
    shortDescription: "Industry-leading noise cancellation. 30-hour battery. Hi-Res Audio.",
    price: 349.99,
    originalPrice: 399.99,
    discount: 13,
    rating: 4.7,
    reviewCount: 3421,
    stock: 120,
    isFeatured: true,
    specifications: {
      "Driver": "30mm, dome type (CCAW Voice Coil)",
      "Frequency Response": "4 Hz – 40,000 Hz",
      "Noise Cancellation": "Dual Processor, 8 microphones, Auto NC Optimizer",
      "Battery": "Up to 30 hours (NC On), 40 hours (NC Off)",
      "Charging": "USB-C, 3-min quick charge = 3 hours playback",
      "Bluetooth": "5.2, Multipoint (2 devices simultaneously)",
      "Codec Support": "SBC, AAC, LDAC",
      "Weight": "250 g"
    },
    highlights: [
      "Industry-leading noise cancellation with Auto NC Optimizer",
      "30-hour battery life — your all-day listening companion",
      "Speak-to-Chat pauses music when you start talking",
      "Multipoint connection — switch between 2 devices seamlessly",
      "Ultra-light 250g with premium soft-fit leather headband"
    ],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80"
    ],
    colorVariants: [
      { name: "Black", hex: "#1A1A1A", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
      { name: "Silver", hex: "#D4D4D4", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80" },
      { name: "Midnight Blue", hex: "#1E3A5F", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "Jessica W.", avatar: "JW", rating: 5, date: "2024-08-15", title: "Best headphones I've owned", comment: "The noise cancellation is unreal. I use these on flights and in the office. Sound quality with LDAC is audiophile-level." },
      { id: 2, user: "Mark D.", avatar: "MD", rating: 5, date: "2024-09-02", title: "Worth the investment", comment: "Comfortable enough to wear all day. The Speak-to-Chat feature is genius — no more taking them off to talk to coworkers." },
      { id: 3, user: "Anna P.", avatar: "AP", rating: 4, date: "2024-07-20", title: "Amazing sound, minor gripe", comment: "Sound quality is exceptional. My only complaint is they don't fold flat like the XM4s did. But sonically, they're superior in every way." },
      { id: 4, user: "Kevin C.", avatar: "KC", rating: 5, date: "2024-10-08", title: "Commuter's dream", comment: "Multipoint connection lets me switch between laptop and phone effortlessly. 30-hour battery means I charge once a week." },
      { id: 5, user: "Olivia R.", avatar: "OR", rating: 4, date: "2024-11-15", title: "Premium experience", comment: "The leather feels luxurious and the sound is rich and detailed. A bit pricey but the quality justifies it completely." }
    ],
    offers: [
      { type: "discount", text: "Save $50 — Holiday Audio Sale" },
      { type: "bank", text: "Extra 10% cashback on select cards" },
      { type: "shipping", text: "Free Next-Day Delivery" },
      { type: "bundle", text: "Free carrying case included" }
    ],
    relatedProducts: [10, 3, 1, 8],
    warranty: "1-Year Sony Manufacturer Warranty"
  },
  {
    id: 5,
    name: "Samsung French Door Refrigerator",
    slug: "samsung-french-door-refrigerator",
    category: "Appliances",
    brand: "Samsung",
    description: "The Samsung Bespoke 4-Door French Door Refrigerator combines stunning design with innovative technology. With customizable color panels, you can match your fridge to your kitchen aesthetic. The 29 cu. ft. capacity provides ample storage, while the Beverage Center™ with AutoFill Water Pitcher and built-in infuser make hydration effortless. Dual Ice Maker produces both cubed and Ice Bites™ ice. SmartThings integration lets you control temperature, get filter alerts, and more from your phone.",
    shortDescription: "Bespoke design. 29 cu. ft. Beverage Center™. Wi-Fi connected.",
    price: 1899.00,
    originalPrice: 2399.00,
    discount: 21,
    rating: 4.5,
    reviewCount: 876,
    stock: 15,
    isFeatured: false,
    specifications: {
      "Capacity": "29 cu. ft. total (17.3 Fridge + 11.7 Freezer)",
      "Dimensions": "35.75\" W × 70\" H × 33.75\" D",
      "Ice Maker": "Dual Auto Ice Maker (Cubed + Ice Bites)",
      "Cooling": "Twin Cooling Plus™, FlexZone™ Drawer",
      "Display": "Internal Cameras, Family Hub™ Ready",
      "Energy": "Energy Star Certified",
      "Connectivity": "Wi-Fi, SmartThings Compatible",
      "Finish": "Fingerprint Resistant Stainless Steel"
    },
    highlights: [
      "Bespoke customizable color panels to match your kitchen",
      "Beverage Center™ with built-in water dispenser and infuser",
      "Dual Ice Maker — cubed ice and Ice Bites™ for fast chilling",
      "Twin Cooling Plus™ keeps fridge humid and freezer dry",
      "SmartThings App for remote monitoring and diagnostics"
    ],
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80",
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80",
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80",
      "https://images.unsplash.com/photo-1536353284924-9220c464e262?w=800&q=80"
    ],
    colorVariants: [
      { name: "Stainless Steel", hex: "#C8C8C8", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80" },
      { name: "Matte Black", hex: "#2C2C2C", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80" },
      { name: "Navy Blue", hex: "#1B2838", image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80" },
      { name: "White Glass", hex: "#F5F5F5", image: "https://images.unsplash.com/photo-1536353284924-9220c464e262?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "Martha K.", avatar: "MK", rating: 5, date: "2024-06-20", title: "Dream kitchen upgrade", comment: "This refrigerator is stunning. The customizable panels let me match it perfectly to my kitchen. The Beverage Center is incredibly convenient." },
      { id: 2, user: "Robert J.", avatar: "RJ", rating: 4, date: "2024-07-10", title: "Huge capacity, great features", comment: "Plenty of space for our family of 5. The dual ice maker is a nice touch. Wi-Fi connectivity is handy for monitoring temps." },
      { id: 3, user: "Christine L.", avatar: "CL", rating: 5, date: "2024-08-05", title: "Worth the splurge", comment: "The quality is outstanding. Everything feels premium — from the soft-close drawers to the LED lighting. Best fridge we've ever owned." },
      { id: 4, user: "Daniel H.", avatar: "DH", rating: 4, date: "2024-09-15", title: "Great fridge, minor noise", comment: "Love the features and capacity. It makes a slight humming noise sometimes but nothing disruptive. Overall very happy with the purchase." }
    ],
    offers: [
      { type: "discount", text: "Save $500 — Major Appliance Event" },
      { type: "install", text: "Free professional installation included" },
      { type: "shipping", text: "Free White-Glove Delivery" },
      { type: "financing", text: "0% APR for 24 months with approval" }
    ],
    relatedProducts: [9, 8, 2, 6],
    warranty: "1-Year Samsung Parts & Labor Warranty"
  },
  {
    id: 6,
    name: 'MacBook Pro 16"',
    slug: "macbook-pro-16",
    category: "Laptops",
    brand: "Apple",
    description: "The MacBook Pro 16-inch with M3 Max chip delivers extraordinary performance for the most demanding professional workflows. With up to 128GB of unified memory and a 16-core CPU paired with a 40-core GPU, it handles everything from 8K video editing to complex 3D rendering with ease. The stunning 16.2-inch Liquid Retina XDR display offers 1000 nits sustained brightness, P3 wide color, and ProMotion 120Hz adaptive refresh. Up to 22 hours of battery life means you can work unplugged all day.",
    shortDescription: "M3 Max chip. 16.2\" Liquid Retina XDR. Up to 22-hour battery.",
    price: 2499.00,
    originalPrice: 2699.00,
    discount: 7,
    rating: 4.9,
    reviewCount: 1567,
    stock: 28,
    isFeatured: true,
    specifications: {
      "Display": '16.2" Liquid Retina XDR, 3456×2234, ProMotion 120Hz',
      "Processor": "Apple M3 Max — 16-core CPU, 40-core GPU",
      "Memory": "36GB / 48GB / 64GB / 128GB Unified Memory",
      "Storage": "1TB / 2TB / 4TB / 8TB SSD",
      "Battery": "Up to 22 hours, 140W USB-C fast charge",
      "Ports": "3× Thunderbolt 4, HDMI 2.1, SDXC, MagSafe 3",
      "Display Output": "Up to 3 external displays simultaneously",
      "Weight": "2.14 kg (4.7 lbs)"
    },
    highlights: [
      "M3 Max — the most powerful Apple silicon for pros",
      "Up to 128GB unified memory for massive creative projects",
      "Liquid Retina XDR with 1600 nits HDR peak brightness",
      "22-hour battery life — longest ever in a MacBook",
      "6-speaker sound system with Spatial Audio and Dolby Atmos"
    ],
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
    ],
    colorVariants: [
      { name: "Space Black", hex: "#1D1D1F", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" },
      { name: "Silver", hex: "#E3E4E5", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "Chris A.", avatar: "CA", rating: 5, date: "2024-01-15", title: "A creative powerhouse", comment: "I edit 8K video and this machine doesn't even break a sweat. The display is the best I've ever used on a laptop. Period." },
      { id: 2, user: "Rachel S.", avatar: "RS", rating: 5, date: "2024-02-08", title: "Best laptop ever made", comment: "Battery lasts all day at a coffee shop. Performance is desktop-class. The speakers are legitimately better than most Bluetooth speakers." },
      { id: 3, user: "Devon M.", avatar: "DM", rating: 5, date: "2024-03-20", title: "Worth the investment", comment: "As a software developer, compilation times are insanely fast. 36GB of unified memory handles everything I throw at it." },
      { id: 4, user: "Sophie T.", avatar: "ST", rating: 4, date: "2024-04-05", title: "Nearly perfect", comment: "Incredible performance and display. Only minor complaint is the weight — it's hefty for travel. But the power makes up for it." }
    ],
    offers: [
      { type: "discount", text: "Save $200 — Education Pricing Available" },
      { type: "applecare", text: "AppleCare+ for $299 — 3 years of coverage" },
      { type: "shipping", text: "Free Express Delivery" },
      { type: "exchange", text: "Up to $800 trade-in credit for old Mac" }
    ],
    relatedProducts: [7, 1, 8, 4],
    warranty: "1-Year Apple Limited Warranty"
  },
  {
    id: 7,
    name: 'iPad Pro 12.9"',
    slug: "ipad-pro-12-9",
    category: "Tablets",
    brand: "Apple",
    description: "The iPad Pro 12.9-inch with M2 chip is the ultimate iPad experience. Its massive 12.9-inch Liquid Retina XDR display with mini-LED backlighting delivers extraordinary brightness, contrast, and color accuracy. With the M2 chip, it outperforms most laptops and supports Apple Pencil hover for a new dimension of creative precision. ProRes video recording, Thunderbolt connectivity, and 5G capability make it a portable creative studio that goes wherever inspiration strikes.",
    shortDescription: "M2 chip. 12.9\" Liquid Retina XDR. Apple Pencil hover.",
    price: 1099.00,
    originalPrice: 1199.00,
    discount: 8,
    rating: 4.7,
    reviewCount: 1234,
    stock: 55,
    isFeatured: false,
    specifications: {
      "Display": '12.9" Liquid Retina XDR, 2732×2048, ProMotion 120Hz',
      "Processor": "Apple M2 chip, 8-core CPU, 10-core GPU",
      "Storage": "128GB / 256GB / 512GB / 1TB / 2TB",
      "Camera": "12MP Wide + 10MP Ultra Wide, LiDAR Scanner",
      "Battery": "Up to 10 hours Wi-Fi browsing",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, Thunderbolt, 5G (optional)",
      "Audio": "4 speaker system, 5 studio-quality microphones",
      "Weight": "682 g"
    },
    highlights: [
      "M2 chip delivers next-level performance for creative pros",
      "Liquid Retina XDR with 2596 mini-LEDs for stunning HDR",
      "Apple Pencil hover — detect pencil up to 12mm above display",
      "Thunderbolt/USB 4 for pro accessories and fast transfers",
      "Center Stage keeps you in frame during video calls"
    ],
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9aab32f4c?w=800&q=80"
    ],
    colorVariants: [
      { name: "Space Gray", hex: "#555555", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80" },
      { name: "Silver", hex: "#E3E4E5", image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "Laura B.", avatar: "LB", rating: 5, date: "2024-05-10", title: "Replaced my laptop", comment: "With the Magic Keyboard, this has completely replaced my laptop for work. The display is breathtaking for photo and video editing." },
      { id: 2, user: "Jason K.", avatar: "JK", rating: 5, date: "2024-06-22", title: "Artist's dream", comment: "Drawing on this with the Apple Pencil is incredible. The hover feature adds a new level of precision. Mini-LED display shows true colors." },
      { id: 3, user: "Maria G.", avatar: "MG", rating: 4, date: "2024-07-14", title: "Powerful but needs better software", comment: "The hardware is phenomenal but iPadOS still limits some pro workflows. Still, for drawing, note-taking, and media consumption — unbeatable." },
      { id: 4, user: "Tyler R.", avatar: "TR", rating: 5, date: "2024-08-01", title: "Best tablet money can buy", comment: "The screen quality rivals my $3000 monitor. LiDAR scanner is great for 3D scanning. Speakers are surprisingly powerful." }
    ],
    offers: [
      { type: "discount", text: "Save $100 — Back to School Special" },
      { type: "bundle", text: "Apple Pencil 2 for $99 with iPad Pro" },
      { type: "shipping", text: "Free Next-Day Delivery" },
      { type: "applecare", text: "AppleCare+ from $149 for 2 years" }
    ],
    relatedProducts: [6, 1, 3, 10],
    warranty: "1-Year Apple Limited Warranty"
  },
  {
    id: 8,
    name: 'Samsung 65" OLED 4K Smart TV',
    slug: "samsung-65-oled-tv",
    category: "TVs",
    brand: "Samsung",
    description: "Experience cinematic brilliance with the Samsung 65-inch S95D OLED 4K Smart TV. Featuring OLED HDR+ technology with Anti-Glare coating, it delivers the deepest blacks and most vibrant colors with a matte finish that eliminates distracting reflections — a world first. The Neural Quantum Processor 4K uses AI to upscale content to near 4K quality. Object Tracking Sound+ creates a 3D surround experience, and the Tizen OS platform gives instant access to all your streaming favorites.",
    shortDescription: "OLED HDR+ with Anti-Glare. Neural Quantum 4K. Object Tracking Sound+.",
    price: 1799.00,
    originalPrice: 2199.00,
    discount: 18,
    rating: 4.8,
    reviewCount: 945,
    stock: 20,
    isFeatured: false,
    specifications: {
      "Display": '65" OLED, 3840×2160, 144Hz, HDR10+',
      "Processor": "Neural Quantum Processor 4K",
      "HDR": "Quantum HDR OLED+, HDR10+, HLG",
      "Sound": "Object Tracking Sound+, Dolby Atmos, 60W 4.2.2ch",
      "Smart TV": "Tizen OS, Built-in Alexa & Bixby",
      "Gaming": "4K 144Hz, FreeSync Premium Pro, Game Bar 3.0",
      "Connectivity": "4× HDMI 2.1, 3× USB, Wi-Fi 6E, Bluetooth 5.2",
      "Design": "LaserSlim design, 11.9mm thin"
    },
    highlights: [
      "OLED HDR+ — world's first glare-free OLED technology",
      "AI-powered upscaling with Neural Quantum Processor 4K",
      "144Hz refresh rate with FreeSync for buttery smooth gaming",
      "Object Tracking Sound+ — audio follows on-screen action",
      "LaserSlim design at just 11.9mm thin — art on your wall"
    ],
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
      "https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=800&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80",
      "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&q=80"
    ],
    colorVariants: [
      { name: "Graphite Black", hex: "#2C2C2C", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80" },
      { name: "Titan Silver", hex: "#A8A9AD", image: "https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "Frank D.", avatar: "FD", rating: 5, date: "2024-04-10", title: "Mind-blowing picture quality", comment: "Coming from an LCD TV, this OLED is like seeing a new world. The anti-glare is a game changer — no more closing curtains to watch TV." },
      { id: 2, user: "Andrea M.", avatar: "AM", rating: 5, date: "2024-05-25", title: "Perfect for gaming", comment: "144Hz at 4K is buttery smooth. FreeSync Premium Pro eliminates screen tearing. Game Bar makes switching between modes instant." },
      { id: 3, user: "Paul N.", avatar: "PN", rating: 4, date: "2024-06-18", title: "Stunning but expensive", comment: "Picture quality is the best I've ever seen. The slim design is gorgeous. Price is steep but the quality justifies it." },
      { id: 4, user: "Wendy C.", avatar: "WC", rating: 5, date: "2024-07-30", title: "Best TV we've owned", comment: "The sound system is surprisingly good — we haven't needed a soundbar. Tizen OS is smooth and has every streaming app we use." }
    ],
    offers: [
      { type: "discount", text: "Save $400 — Summer TV Event" },
      { type: "install", text: "Free wall mounting service" },
      { type: "shipping", text: "Free White-Glove Delivery & Setup" },
      { type: "financing", text: "0% APR for 36 months" }
    ],
    relatedProducts: [2, 5, 6, 4],
    warranty: "2-Year Samsung TV Warranty"
  },
  {
    id: 9,
    name: "Dyson V15 Detect Vacuum",
    slug: "dyson-v15-detect",
    category: "Appliances",
    brand: "Dyson",
    description: "The Dyson V15 Detect is the most powerful and intelligent cordless vacuum. Its revolutionary laser technology reveals microscopic dust invisible to the naked eye on hard floors, while a piezo sensor measures and counts dust particles — displaying scientific proof of a deep clean on the LCD screen in real time. With 240 AW of suction power, a HEPA filtration system that captures 99.99% of particles, and up to 60 minutes of fade-free runtime, it's engineered for homes that demand the absolute best.",
    shortDescription: "Laser dust detection. 240 AW suction. HEPA filtration.",
    price: 749.99,
    originalPrice: 749.99,
    discount: 0,
    rating: 4.6,
    reviewCount: 2034,
    stock: 65,
    isFeatured: false,
    specifications: {
      "Suction Power": "240 AW (Boost mode)",
      "Run Time": "Up to 60 minutes (Eco mode)",
      "Filtration": "Whole-machine HEPA, 5-stage",
      "Bin Capacity": "0.76 liters",
      "Laser": "Green laser diode on Fluffy Optic cleaner head",
      "Display": "LCD screen with particle count and run time",
      "Battery": "Removable, click-in battery, 4.5 hour charge",
      "Weight": "3.1 kg (6.8 lbs)"
    },
    highlights: [
      "Laser reveals hidden dust on hard floors in green light",
      "Piezo sensor counts and categorizes dust particles in real-time",
      "240 AW suction — most powerful Dyson cordless ever",
      "HEPA filtration traps 99.99% of particles as small as 0.3 microns",
      "Up to 60 minutes fade-free runtime, auto-adjusting suction"
    ],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
      "https://images.unsplash.com/photo-1527515637462-cee1f0c421f7?w=800&q=80",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80"
    ],
    colorVariants: [
      { name: "Gold/Nickel", hex: "#C5A55A", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80" },
      { name: "Blue/Nickel", hex: "#3B5998", image: "https://images.unsplash.com/photo-1527515637462-cee1f0c421f7?w=800&q=80" },
      { name: "Purple/Nickel", hex: "#7B2D8E", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "Jennifer H.", avatar: "JH", rating: 5, date: "2024-03-10", title: "Game-changing technology", comment: "The laser showing dust you can't see with your eyes is both satisfying and slightly horrifying. My floors have never been cleaner." },
      { id: 2, user: "Steve R.", avatar: "SR", rating: 4, date: "2024-04-22", title: "Powerful but pricey", comment: "Suction is incredible, especially on carpets. The particle counter is addictive to watch. Wish the bin was a bit larger though." },
      { id: 3, user: "Monica T.", avatar: "MT", rating: 5, date: "2024-05-15", title: "Best vacuum investment", comment: "Worth every penny. The auto-adjusting suction on different surfaces is seamless. Battery easily lasts for our entire house." },
      { id: 4, user: "Gary P.", avatar: "GP", rating: 4, date: "2024-06-28", title: "Impressive engineering", comment: "Classic Dyson quality. The LCD display is great for knowing exactly what you're cleaning up. Heavier than I expected but manageable." }
    ],
    offers: [
      { type: "bundle", text: "Free extra battery and dock accessory" },
      { type: "shipping", text: "Free standard shipping" },
      { type: "warranty", text: "Free 2-year extended warranty registration" }
    ],
    relatedProducts: [5, 8, 6, 4],
    warranty: "2-Year Dyson Warranty"
  },
  {
    id: 10,
    name: "AirPods Pro 2",
    slug: "airpods-pro-2",
    category: "Audio",
    brand: "Apple",
    description: "AirPods Pro 2 deliver up to 2x more Active Noise Cancellation than the previous generation, powered by the Apple H2 chip. Adaptive Audio dynamically blends Transparency mode and ANC, adjusting to your environment in real time. A new low distortion audio driver and custom amplifier produce vivid, immersive sound with richer bass. With Personalized Spatial Audio using head tracking, Conversation Awareness, and a USB-C MagSafe charging case with a built-in speaker, every detail is designed to elevate your experience.",
    shortDescription: "H2 chip. 2× more ANC. Adaptive Audio. USB-C case.",
    price: 249.00,
    originalPrice: 249.00,
    discount: 0,
    rating: 4.8,
    reviewCount: 5674,
    stock: 200,
    isFeatured: true,
    specifications: {
      "Chip": "Apple H2",
      "Active Noise Cancellation": "2× more than previous gen",
      "Audio": "Custom high-excursion driver, Custom high dynamic range amplifier",
      "Spatial Audio": "Personalized with dynamic head tracking",
      "Battery": "6 hours listening (ANC on), 30 hours with case",
      "Charging": "USB-C, MagSafe, Apple Watch charger, Qi",
      "Water Resistance": "IPX4 (earbuds and case)",
      "Ear Tips": "XS, S, M, L silicone tips included"
    },
    highlights: [
      "2x more Active Noise Cancellation than AirPods Pro (1st gen)",
      "Adaptive Audio blends ANC and Transparency seamlessly",
      "Conversation Awareness lowers media when you start talking",
      "USB-C case with built-in speaker for Find My and Precision Finding",
      "Up to 30 hours total listening time with charging case"
    ],
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80",
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&q=80",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80"
    ],
    colorVariants: [
      { name: "White", hex: "#F5F5F7", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80" }
    ],
    reviews: [
      { id: 1, user: "Amy L.", avatar: "AL", rating: 5, date: "2024-10-05", title: "Best earbuds, period", comment: "The noise cancellation is phenomenal. I use these daily for commuting and at the gym. Adaptive Audio is like magic." },
      { id: 2, user: "Brian K.", avatar: "BK", rating: 5, date: "2024-11-12", title: "Worth the upgrade", comment: "Upgraded from the first gen AirPods Pro. The improvement in ANC and sound quality is immediately noticeable. USB-C is finally here!" },
      { id: 3, user: "Diana S.", avatar: "DS", rating: 4, date: "2024-10-28", title: "Great but not for small ears", comment: "Sound quality and ANC are top-tier. Even with the XS tips, they can feel a bit large for my ears after a few hours. Otherwise perfect." },
      { id: 4, user: "Ethan W.", avatar: "EW", rating: 5, date: "2024-12-05", title: "Apple ecosystem perfection", comment: "Seamless switching between iPhone, iPad, and Mac. The spatial audio with head tracking is incredible for movies. Battery life is great." },
      { id: 5, user: "Grace M.", avatar: "GM", rating: 5, date: "2024-11-30", title: "Daily essential", comment: "Conversation Awareness is brilliant — automatically lowers volume when I talk. Sound quality is rich and detailed. Best purchase this year." }
    ],
    offers: [
      { type: "bundle", text: "Free engraving on charging case" },
      { type: "applecare", text: "AppleCare+ for $29 — 2 years of coverage" },
      { type: "shipping", text: "Free Next-Day Delivery" }
    ],
    relatedProducts: [4, 3, 1, 6],
    warranty: "1-Year Apple Limited Warranty"
  }
];

// Helper functions for accessing product data
export const getAllProducts = () => products;

export const getProductById = (id) => products.find(p => p.id === parseInt(id));

export const getProductBySlug = (slug) => products.find(p => p.slug === slug);

export const getFeaturedProducts = () => products.filter(p => p.isFeatured);

export const getProductsByCategory = (category) => {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

export const getRelatedProducts = (productId) => {
  const product = getProductById(productId);
  if (!product) return [];
  return product.relatedProducts
    .map(id => getProductById(id))
    .filter(Boolean);
};

export const getCategories = () => {
  const categoryMap = {};
  products.forEach(p => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  return Object.entries(categoryMap).map(([category, count]) => ({ category, count }));
};

export const searchProducts = (query) => {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
};

export default products;
