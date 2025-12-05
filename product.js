const url = new URLSearchParams(location.search);
const id = Number(url.get('id'));

const product = JSON.parse(localStorage.getItem("products"))?.find(p => p.id === id);

if (!product) location.href = "index.html";

document.getElementById("prodImg").src = product.img;
document.getElementById("prodTitle").textContent = product.title;
document.getElementById("prodPrice").textContent = "Rp" + product.price.toLocaleString('id-ID');
document.getElementById("prodDesc").textContent = product.desc || "Tidak ada deskripsi.";

document.getElementById("addToCart").onclick = () => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ id: product.id, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Ditambahkan ke keranjang!");
};

