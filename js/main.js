let pizzasContainer = document.getElementById("pizzas"); // contenedor de las pizzas
let empanadasContainer = document.getElementById("empanadas"); //contenedor empanadas
let complementosContainer = document.getElementById("complementos"); //contenedor complementos
let combosContainer = document.getElementById("combosContainer"); // contenedor combos
let cartButton = document.getElementById("cartButton"); // boton carrito
let carritoCount = document.getElementById("carritoCount"); //span para ver el contador de productos en el carrito
let modalBody = document.getElementById("modalBody"); //cuerpo del modal para el carrito
let modalFooter = document.getElementById("modalFooter"); // contenedor precio total
let cartContainer = JSON.parse(localStorage.getItem("cartContainer")) || []; //contenedor de agregar al carrito
////////////////////////////////////////////////////////////////////////////////
//contador en icono del carrito
const counter = () =>{
    if(cartContainer.length === 0){
        carritoCount.style.opacity = "0";
    }else{
        carritoCount.style.opacity = "1";
        const carritoCounter = cartContainer.length;
        localStorage.setItem("carritoCounter", JSON.stringify(carritoCounter));
        carritoCount.innerText = JSON.parse(localStorage.getItem("carritoCounter"));
    };
};
counter();

// funcion para setear carrito en el localstorage
const saveLocal = () =>{
    localStorage.setItem("cartContainer", JSON.stringify(cartContainer));
};
////////////////////////////////////////////////////////////////////////////////
// funcion con libreria toastify
const toasty = (texto) =>{
    Toastify({
        text: texto,
        duration: 1300,
        newWindow: true,
        close: false,
        gravity: "top",
        position: "center",
        stopOnFocus: false,
        style: {
            backgroundColor: "linear-gradient(to right, #00b09b, #000000)",
            background: "rgba(40, 40, 40)",
            borderRadius: "10px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(6.6px)",
            webkitBackdropFilter: "blur(6.6px)",
            border: "1px solid rgba(0, 121, 91, 0.08)",
            color: "#fff",
            fontWeight: "bold"
        },
        onClick: function(){}
    }).showToast();
};
// ////////////////////////////////////////////////////////////////////////////////

// renderizado de mis productos
const createProducts = (container, file, className) =>{
    fetch(file)
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            let div = document.createElement("div");
            div.classList.add(className);
            div.innerHTML = `
            <img src="${product.img}" alt="imagen de ${product.name}">
            <div class="product-desc">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <span class="star-btn"><i class="fas fa-star"></i></span>
                    <span class="star-btn"><i class="fas fa-star"></i></span>
                    <span class="star-btn"><i class="fas fa-star"></i></span>
                    <span class="star-btn"><i class="fas fa-star"></i></span>
                    <span class="star-btn"><i class="far fa-star"></i></span>
                </div>
                <p>${product.desc}</p>
            </div>
            <b>$${product.price}</b>
            <button id="boton${product.id}">Agregar</button>
            `;
            container.appendChild(div);
            // estrellitas para productos
            let starBtns = div.querySelectorAll('.star-btn'); // Selecciono los botones de estrella dentro del contenedor de los producto
            starBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    starBtns.forEach((btn, i) => {
                        if (i <= index) {
                            btn.querySelector('.fa-star').classList.add('fas');
                            btn.querySelector('.fa-star').classList.remove('far');
                        } else {
                            btn.querySelector('.fa-star').classList.add('far');
                            btn.querySelector('.fa-star').classList.remove('fas');
                        }
                    });
                });
            });
            // boton para agregar al carrito por id
            let boton = document.getElementById(`boton${product.id}`);
            boton.addEventListener("click", () => {
                // toastyPlus();
                toasty("Se agrego al carrito");
                // agregar al carrito
                const repeat = cartContainer.some((repeatProd) => repeatProd.id === product.id);
                if(repeat){
                    cartContainer.map((prod) =>{
                    if(prod.id === product.id){
                        prod.cantidad ++;
                    }
                    });
                }else{
                    cartContainer.push({
                    img: product.img,
                    desc: product.desc,
                    id: product.id,
                    price: product.price,
                    name: product.name,
                    cantidad: product.cantidad
                    });
                };
                counter();
                saveLocal(); //para actualizar el carrito del local
            });
        });
    });
};
if(pizzasContainer){
    createProducts(pizzasContainer, "../localApi/pizzas.json", "aproduct")
};
if(empanadasContainer){
    createProducts(empanadasContainer, "../localApi/empanadas.json", "bproduct")
};
if (complementosContainer) {
createProducts(complementosContainer, "../localApi/complementos.json", "cproduct");
};
if (combosContainer) {
createProducts(combosContainer, "../localApi/combos.json", "comb-product");
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//funcion agregar carrito y mostrar total
const viewCart = () => {
    cartContainer.forEach((product) =>{
        let div = document.createElement("div");
        div.className = "modalProd"
        div.innerHTML = `
        <img src="${product.img}" alt="imagen del producto">
        <div>
            <h3>${product.name}</h3>
            <span id="minus" class="minus"><i class="fa-solid fa-minus"></i></span>
            <p class="amount">${product.cantidad}</p>
            <span id="plus" class="plus"><i class="fa-solid fa-plus"></i></span>
        </div>
        <b>$${product.price * product.cantidad}</b>
        <button id="boton${product.id}">
            <i class="fa-solid fa-trash trash"></i>
            <div class="modalTooltip">Eliminar</div>
        </button>
        `
        modalBody.appendChild(div)
        let minusButton = div.querySelector("#minus");
        minusButton.addEventListener("click", () =>{
            modalBody.innerHTML = "";
            if(product.cantidad !== 1){
                product.cantidad --;
            };
            viewCart();
            saveLocal();
        });
        let plusButton = div.querySelector("#plus");
        plusButton.addEventListener("click", () =>{
            modalBody.innerHTML = "";
            product.cantidad ++;
            viewCart();
            saveLocal();
        })
        // boton eliminar
        let boton = document.getElementById(`boton${product.id}`);
        boton.addEventListener('click', () => {
            // toastyMinus();
            toasty("Se elimino al carrito");
            // Remover el producto del carrito
            const index = cartContainer.findIndex(item => item.id === product.id);
            cartContainer.splice(index, 1);
            // Actualizar la vista del carrito
            modalBody.innerHTML = '';
            counter();
            viewCart();
            saveLocal(); //para actualizar el carrito en el  local
        });
    });
    if(modalBody.innerHTML === ""){
        modalBody.innerHTML ="El carrito esta vacio"
    }
    // contador del precio total
    const total = cartContainer.reduce((acum, item) => acum + item.price * item.cantidad, 0);
    let totalContainer = document.getElementById("totalContainer");
    totalContainer.innerText = `Total a pagar: $${total}`;
    if(`${total}`== 0){
        modalFooter.style.display="none"
    }else{
        modalFooter.style.display="flex"
    }
};

cartButton.addEventListener("click", ()=>{
    modalBody.innerHTML = "";
    viewCart();
});


let payButton = document.getElementById("payButton");
payButton.addEventListener("click", () =>{
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Pedido realizado correctamente',
        showConfirmButton: false,
        timer: 2500
    })
})