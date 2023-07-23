(function app() {
    const App = {
        init: async function () {
            const loading = APP_LOADING.activate();
            this.data.menus = await this.getMenu();
            if (this.data.menus.status) {
                APP_LOADING.cancel(loading);
                this.showMenu(this.data.menus.data);
                // Filter
                const dropdownItem =
                    document.querySelectorAll(".dropdown-item");
                const dropdownMenu = document.querySelector(".dropdown-menu");
                dropdownItem.forEach((d) => {
                    d.addEventListener("click", (e) => {
                        e.preventDefault();
                        for (
                            let i = 0;
                            i < dropdownMenu.childElementCount;
                            i++
                        ) {
                            if (
                                dropdownMenu.children[
                                    i
                                ].firstElementChild.classList.contains("active")
                            ) {
                                dropdownMenu.children[
                                    i
                                ].firstElementChild.classList.remove("active");
                                break;
                            }
                        }

                        d.classList.add("active");
                        const val = d.parentElement.getAttribute("list-value");
                        if (val) {
                            const resultFilter = [];
                            this.data.menus.data.forEach((m) => {
                                const matchedCategory = m.categories.findIndex(
                                    (c) => c.id === val
                                );
                                if (matchedCategory != -1) {
                                    resultFilter.push(m);
                                }
                            });
                            this.showMenu(resultFilter);
                            return;
                        }
                        this.showMenu(this.data.menus.data);
                    });
                });
                window.addEventListener("submit", async (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    if (e.target.id === "sendOrderForm") {
                        const formData = new FormData(e.target);
                        if (!formData.get("customerName")) {
                            TOAST.classList.remove("bg-success");
                            TOAST.classList.add("bg-danger");
                            TOAST_BODY.textContent =
                                "Wajib isi Nama Atas Pesanan ini";
                            TOAST_APP.show();
                            return;
                        }
                        if (!this.data.orders.length) {
                            TOAST.classList.remove("bg-success");
                            TOAST.classList.add("bg-danger");
                            TOAST_BODY.textContent =
                                "Could not send invalid request";
                            TOAST_APP.show();
                            return;
                        }
                        formData.append(
                            "_orders",
                            JSON.stringify(this.data.orders)
                        );
                        const loading = APP_LOADING.activate();
                        const saved = await this.sendOrder(formData);
                        if (!saved.status) {
                            TOAST.classList.remove("bg-success");
                            TOAST.classList.add("bg-danger");
                            TOAST_BODY.textContent = saved.message;
                            TOAST_APP.show();
                            APP_LOADING.cancel(loading);
                            return;
                        }
                        document.location.href = document.location;
                    }
                });
                return;
            }
        },
        data: {
            orders: [],
            menus: null,
        },
        getMenu: function () {
            return fetch(
                `${APP_STATE.baseUrl}/api/menus/get?${new URLSearchParams({
                    list: "food",
                    with: "categories",
                })}`
            )
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    TOAST.classList.remove("bg-success");
                    TOAST.classList.add("bg-danger");
                    TOAST_BODY.textContent = "Gagal memuat menu";
                    TOAST_APP.show();
                });
        },
        showMenu: function (menus) {
            const menuElem = document.querySelector("#menu");
            menuElem.firstElementChild.innerHTML = "";
            menus.forEach((m) => {
                const div = document.createElement("div");
                div.className = "col";
                const matchedOrder = this.data.orders.find(
                    (o) => o.food === m.id
                );
                div.innerHTML = `<div class="card  bg-dark shadow" style="border: 1px solid #6c6c6c !important; box-shadow: 0 0.1rem 0.1rem #666 !important;">
                                        <img
                                            src="${
                                                APP_STATE.assetUrl
                                            }images/foods/${m.image}"
                                            class="card-img-top"
                                            height="150px"
                                        />
                                        
                                        <div class="card-body">
                                            <h6 class="card-title text-light">
                                                ${m.name}
                                            </h6>
                                            <span
                                                class="badge text-bg-success card-subtitle"
                                                data-value="${m.id}"
                                                data-name="${m.name}"
                                                data-price="${m.price}"
                                                >Rp. ${m.price}</span
                                            >

                                            <div class="add-menu">
                                                <span
                                                    class="badge rounded-pill text-bg-warning addFood"
                                                    style="cursor: pointer"
                                                    >+</span
                                                >
                                                <span
                                                    class="badge rounded-pill text-bg-danger ${
                                                        matchedOrder
                                                            ? "removeFood"
                                                            : "d-none removeFood"
                                                    } "
                                                    style="cursor: pointer"
                                                    >-</span
                                                >
                                                <span
                                                    class="badge rounded-pill text-bg-info"
                                                >${
                                                    matchedOrder
                                                        ? matchedOrder.quantity
                                                        : ""
                                                }</span>
                                            </div>
                                        </div>
                                    </div>`;
                menuElem.firstElementChild.appendChild(div);
            });
            this.cartHandler();
        },
        cartHandler: function () {
            const notifCart = document.querySelector("#notifCart");
            // For add food
            let count = 0;
            const addFood = document.querySelectorAll(".addFood");
            addFood.forEach((a) => {
                a.addEventListener("click", () => {
                    a.nextElementSibling.classList.remove("d-none");
                    notifCart.classList.remove("d-none");
                    const food_value = a.parentElement.previousElementSibling;
                    count++;
                    // Cari data order yang sudah ada
                    const matched = this.data.orders.findIndex(
                        (v) => food_value.getAttribute("data-value") === v.food
                    );
                    const countFoodElem =
                        a.nextElementSibling.nextElementSibling;
                    if (matched != -1) {
                        this.data.orders[matched].quantity += 1;
                        countFoodElem.textContent =
                            this.data.orders[matched].quantity;
                    } else {
                        this.data.orders.push({
                            food: food_value.getAttribute("data-value"),
                            name: food_value.getAttribute("data-name"),
                            quantity: count,
                            price: food_value.getAttribute("data-price"),
                        });
                        countFoodElem.textContent = count;
                    }
                    count = 0;
                });
            });

            // Remove Food
            const removeFood = document.querySelectorAll(".removeFood");
            removeFood.forEach((r) => {
                r.addEventListener("click", () => {
                    const food_value =
                        r.parentElement.previousElementSibling.getAttribute(
                            "data-value"
                        );
                    // Cari data order yang berdasarkan index yang di-click
                    const matched = this.data.orders.findIndex(
                        (v) => food_value === v.food
                    );
                    const countFoodElem = r.nextElementSibling;
                    if (matched != -1) {
                        if (this.data.orders[matched].quantity == 1) {
                            this.data.orders.splice(matched, 1);
                            r.classList.add("d-none");
                            countFoodElem.textContent = "";
                        } else {
                            this.data.orders[matched].quantity -= 1;
                            countFoodElem.textContent =
                                this.data.orders[matched].quantity;
                        }

                        if (this.data.orders.length === 0) {
                            notifCart.classList.add("d-none");
                        }
                    }
                });
            });
            // Show Cart
            const cart = document.querySelector("#cart");
            const cartComponent = document.querySelector("#cartComponent");
            const ul = document.createElement("ul");
            ul.className = "list-group";
            cartComponent.addEventListener("click", () => {
                if (this.data.orders.length === 0) {
                    cart.innerHTML = `<div class="alert alert-dismissible alert-danger text-center">Anda belum memilih menu</div>`;
                } else {
                    ul.innerHTML = "";
                    cart.innerHTML = "";
                    let totalOrder = 0;
                    this.data.orders.forEach((o) => {
                        const li = document.createElement("li");
                        li.className =
                            "list-group-item d-flex justify-content-between align-items-center";
                        li.innerHTML = `${o.name} (Rp. ${o.price}) <span class="badge bg-warning rounded-pill">${o.quantity}</span>`;
                        totalOrder += o.price * o.quantity;
                        ul.appendChild(li);
                    });
                    if (totalOrder > 0) {
                        const li = document.createElement("li");
                        li.className =
                            "list-group-item d-flex justify-content-between align-items-center";
                        li.innerHTML = `Total <span class="badge bg-warning rounded-pill">Rp. ${totalOrder}</span>`;
                        ul.appendChild(li);
                    }
                    const li = document.createElement("li");
                    li.innerHTML = `<li class="list-group-item d-flex align-items-center">
                            <form class="row col"  id="sendOrderForm" action="" method="post">
                                <div class="row">
                                    <input type="text" class="form-control" name="customerName" id="customerName" placeholder="Pesanan atas nama..." />
                                </div>
                                <div class="row mt-3">
                                    <input type="text" class="form-control" name="customerNotes" id="customerNotes" placeholder="Catatan..." />
                                </div>
                                <div class="row mt-3">
                                    <input type="text" class="form-control-plaintext" readonly value="Nomor Meja : ${tableNumber}" />
                                </div>
                                <div class="row mt-3">
                                    <button type="submit" class="btn btn-sm btn-success form-control">Buat Pesanan</button>
                                </div>
                                
                            </form>
            
                            </li>`;
                    li.style = "border-radius: 2px !important;";
                    ul.appendChild(li);
                    cart.appendChild(ul);
                }
            });
        },
        sendOrder: function (formData) {
            return fetch(`${APP_STATE.baseUrl}/api/order/${code}`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                },
                credentials: "same-origin",
                body: formData,
            })
                .then((response) => response.json())
                .then((result) => result);
        },
    };
    textYear.innerHTML = `&copy;${new Date().getFullYear()} MTQ CAFE`;
    App.init();
})();
