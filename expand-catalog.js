const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'frontend', 'src', 'data', 'expanded_catalog.json');
const rootCatalogPath = path.join(__dirname, 'data', 'expanded_catalog.json');

let catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Common extra variants to pick from
const extraColors = ["Midnight Blue", "Crimson Red", "Forest Green", "Space Gray", "Rose Gold"];
const extraSizes = ["Small", "Medium", "Large", "XL"];

// Sample reviews to add content
const sampleReviews = [
  { user: "Alice M.", rating: 5, comment: "Absolutely love this product! Exceeded my expectations.", date: "2024-05-12" },
  { user: "David K.", rating: 4, comment: "Great build quality, very solid. Setup was easy.", date: "2024-04-28" },
  { user: "Sarah J.", rating: 5, comment: "Looks amazing in person. Premium feel throughout.", date: "2024-06-01" },
  { user: "Mike T.", rating: 4, comment: "Good value for the price. Would recommend to friends.", date: "2024-03-15" },
  { user: "Elena R.", rating: 5, comment: "A game changer! Can't imagine going back to my old setup.", date: "2024-06-10" }
];

// Sample 'in the box' items
const inTheBox = [
  "Main Product Unit",
  "Power Adapter & Cable",
  "Quick Start Guide",
  "Warranty Card",
  "Premium Carrying Pouch"
];

catalog = catalog.map(product => {
  // 1. Add extra variants if they have less than 4
  const existingAttr = product.variants.length > 0 ? Object.keys(product.variants[0].attributes)[0] : 'color';
  const basePrice = product.variants.length > 0 ? product.variants[0].price : 99.99;
  
  let newVariants = [...product.variants];
  
  while (newVariants.length < 4) {
    let newAttrValue = '';
    if (existingAttr === 'color' || existingAttr === 'finish') {
      newAttrValue = extraColors[newVariants.length % extraColors.length];
    } else {
      newAttrValue = extraSizes[newVariants.length % extraSizes.length];
    }
    
    // Check if it already exists
    if (!newVariants.some(v => v.attributes[existingAttr] === newAttrValue)) {
      newVariants.push({
        variant_sku: `${product.sku}-V${newVariants.length + 1}`,
        attributes: {
          [existingAttr]: newAttrValue
        },
        price: basePrice,
        stock_quantity: Math.floor(Math.random() * 200) + 10
      });
    } else {
      // If clash, just break to avoid infinite loop
      break; 
    }
  }
  
  product.variants = newVariants;

  // 2. Add more content fields
  product.in_the_box = inTheBox.slice(0, Math.floor(Math.random() * 3) + 2); // Random 2-4 items
  product.reviews = sampleReviews.sort(() => 0.5 - Math.random()).slice(0, 3); // Random 3 reviews
  product.frequently_bought_together = [
    `SKU-ACC-${Math.floor(Math.random() * 1000)}`,
    `SKU-ACC-${Math.floor(Math.random() * 1000)}`
  ];

  // Add Amazon-style "About this item" bullets
  product.about_this_item = [
    product.key_benefits ? product.key_benefits[0] : "Premium build quality and exceptional design.",
    `Dimensions: ${product.specifications?.dimensions || 'Standard'}. Weight: ${product.specifications?.weight || 'Lightweight'}.`,
    product.key_benefits && product.key_benefits.length > 1 ? product.key_benefits[1] : "Easy to use and maintain.",
    "Backed by our comprehensive warranty and dedicated customer support team.",
    "Includes: " + product.in_the_box.join(", ")
  ];
  
  return product;
});

// Save it back to both locations
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
fs.writeFileSync(rootCatalogPath, JSON.stringify(catalog, null, 2));

console.log('Successfully expanded catalog with more variants and rich content!');
