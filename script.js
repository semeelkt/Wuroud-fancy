// ======= Database using localStorage =======
let products = JSON.parse(localStorage.getItem('wuroudProducts')) || [];
let billItems = [];

// DOM elements
const productList = document.getElementById('productList');
const addProductBtn = document.getElementById('addProductBtn');
const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const productCategory = document.getElementById('productCategory');
const filterType = document.getElementById('filterType');
const billList = document.getElementById('billList');
const downloadBill = document.getElementById('downloadBill');
const shareBill = document.getElementById('shareBill');

// ======= Functions =======

// Render Products
function renderProducts() {
  const type = filterType.value;
  productList.innerHTML = '';
  const filtered = products.filter(p => type === 'all' || p.category === type);
  filtered.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span>${p.name} - ₹${p.price} (${p.category})</span>
      <button onclick="addToBill(${index})">Add to Bill</button>
    `;
    productList.appendChild(card);
  });
}

// Add product to database
addProductBtn.addEventListener('click', () => {
  const name = productName.value.trim();
  const price = parseFloat(productPrice.value);
  const category = productCategory.value;

  if (!name || !price) return alert('Enter valid product details');

  products.push({ name, price, category });
  localStorage.setItem('wuroudProducts', JSON.stringify(products));
  productName.value = '';
  productPrice.value = '';
  renderProducts();
});

// Filter products
filterType.addEventListener('change', renderProducts);

// Add product to bill
function addToBill(index) {
  billItems.push(products[index]);
  renderBill();
}

// Render bill
function renderBill() {
  billList.innerHTML = '';
  let total = 0;
  billItems.forEach((item, idx) => {
    total += item.price;
    const div = document.createElement('div');
    div.textContent = `${item.name} - ₹${item.price}`;
    billList.appendChild(div);
  });
  const totalDiv = document.createElement('div');
  totalDiv.innerHTML = `<strong>Total: ₹${total}</strong>`;
  billList.appendChild(totalDiv);
}

// Download bill
downloadBill.addEventListener('click', () => {
  let content = 'Wuroud Shop Bill\n\n';
  billItems.forEach(i => content += `${i.name} - ₹${i.price}\n`);
  content += `\nTotal: ₹${billItems.reduce((a,b) => a + b.price,0)}`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'bill.txt';
  link.click();
});

// Share bill via navigator.share if supported
shareBill.addEventListener('click', () => {
  if (navigator.share) {
    let text = 'Wuroud Shop Bill:\n';
    billItems.forEach(i => text += `${i.name} - ₹${i.price}\n`);
    text += `Total: ₹${billItems.reduce((a,b) => a + b.price,0)}`;
    navigator.share({ title: 'Wuroud Shop Bill', text });
  } else {
    alert('Sharing not supported on this browser');
  }
});

// Initial render
renderProducts();
