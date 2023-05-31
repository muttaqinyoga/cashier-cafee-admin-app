(function app() {
    const App = {
        init: async function () {
            this.data.menus = await this.getMenu();
            if (this.data.menus.status) {
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
                return;
            }
        },
        data: {
            orders: [],
            menus: null,
        },
        getMenu: function () {
            return fetch("food_example.json")
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    alert("Gagal memuat menu");
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
                div.innerHTML = `<div class="card shadow-sm">
                                        <img
                                            src="${m.img}"
                                            class="card-img-top"
                                            height="150px"
                                        />
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                ${m.name}
                                            </h5>
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
                                                    class="badge rounded-pill text-bg-dark"
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
                    cart.innerHTML = `<div class="alert alert-dismissible alert-danger">Anda belum memilih menu</div>`;
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
                        li.innerHTML = `Total <span class="badge bg-success rounded-pill">Rp. ${totalOrder}</span>`;
                        ul.appendChild(li);
                    }
                    cart.appendChild(ul);
                }
            });
        },
    };
    textYear.innerHTML = `&copy;${new Date().getFullYear()} MTQ CAFE`;
    App.init();
})();
