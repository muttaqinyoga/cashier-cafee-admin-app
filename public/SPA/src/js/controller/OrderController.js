import orders from "../views/orders.js";
import addOrder from "../views/add-order.js";
import editOrder from "../views/edit-order.js";
("../views/add-order.js");
import formatter from "../components/utility/formatter.js";
import routing from "../components/routing.js";
const food = {
    view: function (page) {
        switch (page) {
            case "index":
                return orders;
            case "create":
                return addOrder;
            case "edit":
                return editOrder;
            default:
                return orders;
        }
    },
    init: function (method, params = null) {
        TOAST.classList.remove("bg-primary");
        switch (method) {
            case "index":
                this.method.index();
                break;
            case "create":
                this.method.create();
                break;
            case "edit":
                this.method.edit(params);
                break;
            default:
                this.method.index();
        }
    },
    method: {
        data: {
            orderList: null,
            foodList: null,
            diningTableList: null,
            table: {
                headings: null,
                data: null,
            },
            payload: {
                order_food: [],
                table_number: null,
            },
            loading: null,
            dom: {
                ConfirmDeleteModal: null,
                deleteConfirmForm: null,
                detailOrderModal: null,
                inputs: null,
                detail_order_number: null,
                detail_table_number: null,
                detail_foods: null,
                detail_total_price: null,
                detail_created_at: null,
                detail_status: null,
                order_food: null,
                food_ordered: null,
                order_table_number: null,
                addFoodOrderedForm: null,
                addFoodOrderModal: null,
                addOrderForm: null,
                errorMessage: null,
            },
        },
        index: async function () {
            this.data.loading = APP_LOADING.activate();
            this.data.orderList = await this.getOrders();
            if (this.data.orderList.status) {
                this.data.table.headings = [
                    "Order Number",
                    "Customer",
                    "Table Number",
                    "Total Bills",
                    "Creation Date",
                    "Status",
                    "Action",
                    "foods",
                    "payment",
                    "finished_at",
                    "notes",
                ];
                this.data.table.data = [];
                for (let i = 0; i < this.data.orderList.data.length; i++) {
                    this.data.table.data[i] = [];
                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["order_number"]
                    );
                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["customer_name"]
                    );
                    if (this.data.orderList.data[i]["table_id"]) {
                        this.data.table.data[i].push(
                            this.data.orderList.data[i]["table"]["number"]
                        );
                    } else {
                        this.data.table.data[i].push(
                            this.data.orderList.data[i]["table_id"]
                        );
                    }

                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["total_price"]
                    );
                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["created_at"]
                    );
                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["status"]
                    );
                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["id"]
                    );
                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["foods"]
                    );
                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["payment_code"]
                    );
                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["updated_at"]
                    );
                    this.data.table.data[i].push(
                        this.data.orderList.data[i]["notes"]
                    );
                }
                this.initFoodTable(this.data.table);
                APP_LOADING.cancel(this.data.loading);
                this.data.dom.detailOrderModal = new bootstrap.Modal(
                    "#detailOrderModal"
                );
                this.data.dom.detail_order_number = document.querySelector(
                    "#detail_order_number"
                );
                this.data.dom.detail_table_number = document.querySelector(
                    "#detail_table_number"
                );
                this.data.dom.detail_foods =
                    document.querySelector("#detail_foods");
                this.data.dom.detail_total_price = document.querySelector(
                    "#detail_total_price"
                );
                this.data.dom.detail_created_at =
                    document.querySelector("#detail_created_at");
                this.data.dom.detail_status =
                    document.querySelector("#detail_status");

                /*   DELETE ORDER  */
                this.data.dom.ConfirmDeleteModal = new bootstrap.Modal(
                    "#ConfirmDeleteModal"
                );
                this.data.dom.deleteConfirmForm =
                    document.querySelector("#deleteConfirmForm");
                this.data.dom.deleteConfirmForm.addEventListener(
                    "submit",
                    async (e) => {
                        e.preventDefault();
                        TOAST.classList.remove("bg-success");
                        TOAST.classList.remove("bg-danger");
                        this.data.dom.ConfirmDeleteModal.hide();
                        this.data.loading = APP_LOADING.activate();
                        const deleteOrderForm = new FormData(e.target);
                        const deleted = await this.delete(deleteOrderForm);
                        if (!deleted.status) {
                            APP_LOADING.cancel(this.data.loading);
                            TOAST.classList.add("bg-danger");
                            TOAST_BODY.textContent = deleted.message;
                            TOAST_APP.show();
                        } else {
                            APP_LOADING.cancel(this.data.loading);
                            TOAST_BODY.textContent = deleted.message;
                            TOAST.classList.add("bg-success");
                            TOAST_APP.show();
                            routing.run("/admin/order");
                        }
                    }
                );
                /*   END DELETE ORDER  */

                // REFRESH ORDER
                const refreshOrder = document.querySelector("#refreshOrder");
                refreshOrder.addEventListener("click", () => {
                    routing.run("/admin/order");
                });
            }
        },
        getFoods: function () {
            return fetch(`${APP_STATE.baseUrl}/api/admin/foods/get`)
                .then((response) => response.json())
                .then((res) => {
                    return res;
                });
        },
        initFoodTable: function (data) {
            const foodTables = document.querySelector("#foodTables");
            const FoodDataTables = new simpleDatatables.DataTable(foodTables, {
                data: data,
                columns: [
                    {
                        select: 0,
                        sortable: false,
                    },
                    {
                        select: 1,
                        sortable: true,
                    },
                    {
                        select: 2,
                        sortable: true,
                        render: function (data) {
                            if (data) {
                                return data;
                            }
                            return "Direct Order";
                        },
                    },
                    {
                        select: 3,
                        render: function (data) {
                            return formatter.formatRupiah(data);
                        },
                        sortable: true,
                    },
                    {
                        select: 4,
                        sortable: true,
                        render: function (data) {
                            const date = new Date(data);
                            return `${date.getDate()}/${
                                date.getMonth() + 1
                            }/${date.getFullYear()} ${date.toLocaleTimeString()}`;
                        },
                    },
                    {
                        select: 5,
                        render: function (data) {
                            return data == "Proses"
                                ? `<span class="badge rounded-pill bg-primary">${data}</span>`
                                : data == "Batal"
                                ? `<span class="badge rounded-pill bg-danger">${data}</span>`
                                : `<span class="badge rounded-pill bg-success">${data}</span>`;
                        },
                        sortable: true,
                    },
                    {
                        select: 6,
                        sortable: false,
                        render: (data, cell, row) => {
                            const status = row.childNodes[5].textContent;
                            if (status === "Selesai") {
                                return `<button type="button" class="btn btn-info btn-sm detailOrder">Detail</button>
                                <button type="button" class="btn btn-outline-secondary btn-sm printOrder">Print Invoice</button>`;
                            }
                            if (status === "Batal") {
                                return `<button type="button" class="btn btn-info btn-sm detailOrder">Detail</button>`;
                            }
                            return `
                            <button type="button" class="btn btn-info btn-sm detailOrder">Detail</button>
                            <a href="/admin/order/${data}/edit" class="btn btn-warning btn-sm" data-link>Edit</a>
                            <button type="button" class="btn btn-success btn-sm finishOrder">Finish</button>
                            <button type="button" class="btn btn-danger btn-sm deleteOrder">Cancel</button>
                            `;
                        },
                    },
                    {
                        select: 7,
                        sortable: false,
                        hidden: true,
                    },
                    {
                        select: 8,
                        sortable: false,
                        hidden: true,
                    },
                    {
                        select: 9,
                        sortable: false,
                        hidden: true,
                    },
                    {
                        select: 10,
                        sortable: false,
                        hidden: true,
                    },
                ],
                perPage: 10,
                perPageSelect: [10, 20, 50],
            });
            FoodDataTables.on("datatable.init", function () {
                const thead = document.querySelector("#foodTables > thead");
                thead.classList.add("table-dark");
            });
            foodTables.addEventListener("click", (e) => {
                if (e.target.classList.contains("deleteOrder")) {
                    const idx = e.target.parentNode.parentNode.dataIndex;
                    const data = this.data.table.data[idx];
                    const delete_id = document.querySelector("#delete_id");
                    const modalBody = document.querySelector(
                        "#ConfirmDeleteModal .modal-body"
                    );
                    modalBody.innerHTML = `Do you want to cancel <strong>${data[0]}</strong> Order ? This will delete it from Order List`;
                    delete_id.value = data[6];
                    this.data.dom.ConfirmDeleteModal.show();
                } else if (e.target.classList.contains("detailOrder")) {
                    const idx = e.target.parentNode.parentNode.dataIndex;
                    const data = this.data.table.data[idx];

                    this.data.dom.detail_foods.innerHTML = "";

                    this.data.dom.detail_order_number.value = data[0];
                    const detail_order_customer = document.querySelector(
                        "#detail_order_customer"
                    );
                    detail_order_customer.value = data[1];
                    this.data.dom.detail_table_number.value = data[2]
                        ? data[2]
                        : "Direct Order";
                    this.data.dom.detail_total_price.value =
                        formatter.formatRupiah(data[3]);
                    const date = new Date(data[4]);
                    const created_at = `${date.getDate()}/${
                        date.getMonth() + 1
                    }/${date.getFullYear()} ${date.toLocaleTimeString()}`;
                    this.data.dom.detail_created_at.value = created_at;
                    const finished_at = document.querySelector("#finished_at");
                    const dateFinishedAt = new Date(data[9]);
                    if (
                        date.toLocaleTimeString() ==
                            dateFinishedAt.toLocaleTimeString() ||
                        data[5] != "Selesai"
                    ) {
                        finished_at.value = "-";
                    } else {
                        finished_at.value = `${dateFinishedAt.getDate()}/${
                            dateFinishedAt.getMonth() + 1
                        }/${dateFinishedAt.getFullYear()} ${dateFinishedAt.toLocaleTimeString()}`;
                    }

                    this.data.dom.detail_status.textContent = data[5];
                    if (data[5] == "Selesai") {
                        this.data.dom.detail_status.classList.remove(
                            "bg-danger"
                        );
                        this.data.dom.detail_status.classList.add("bg-success");
                    } else {
                        this.data.dom.detail_status.classList.remove(
                            "bg-success"
                        );
                        this.data.dom.detail_status.classList.add("bg-primary");
                    }
                    data[7].forEach((f) => {
                        const li = document.createElement("li");
                        li.textContent = `${f.name} (${formatter.formatRupiah(
                            f.price
                        )}) x ${f.pivot.quantity_ordered}pcs`;
                        this.data.dom.detail_foods.appendChild(li);
                    });
                    const order_notes = document.querySelector("#order_notes");
                    order_notes.value = data[10];
                    this.data.dom.detailOrderModal.show();
                } else if (e.target.classList.contains("finishOrder")) {
                    const finishOrderModal = new bootstrap.Modal(
                        "#finishOrderModal"
                    );
                    const finishOrderModalBody = document.querySelector(
                        "#finishOrderModal .modal-body"
                    );
                    const payment_order_id =
                        document.querySelector("#payment_order_id");
                    const idx = e.target.parentNode.parentNode.dataIndex;

                    const data = this.data.table.data[idx];
                    payment_order_id.value = data[8];
                    finishOrderModalBody.innerHTML = `Do you want to finish <strong>${data[0]}</strong> Order's ? This will create a payment for this order`;
                    initPaid(data[3]);
                    finishOrderModal.show();
                    this.initSubmitPayment(
                        payment_order_id.value,
                        finishOrderModal
                    );
                } else if (e.target.classList.contains("printOrder")) {
                    const idx = e.target.parentNode.parentNode.dataIndex;
                    const data = this.data.table.data[idx];
                    const div = `<table width="100%" border="1" cellpadding="5" cellspacing="0" align="center">
                        <tr>
                            <td colspan="2" align="center" style="font-size:18px"><b>Invoice</b></td>
                        </tr>
                        <tr>
                            <td colspan="2">
                            <table width="100%" cellpadding="5">
                            <tr>
                                <td width="15%">No. Pesanan</td>
                                <td width="1%">:</td>
                                <td>${data[0]}</td>
                            </tr>
                            <tr>
                                <td>Waktu Pemesanan</td>
                                <td>:</td>
                                <td>${new Date(data[4]).toLocaleString()}</td>
                            </tr>
                            ${
                                data[2]
                                    ? `<tr>
                                <td>No. Meja</td>
                                <td>:</td>
                                <td>${data[2]}</td>
                            </tr>`
                                    : ""
                            }
                            </table>
                            <br />
                            <table width="100%" border="1" cellpadding="5" cellspacing="0">
                            <tr>
                            <th>No.</th>
                            <th>Menu</th>
                            <th>Porsi</th>
                            <th>Total Harga</th>
                            </tr>
                            ${formatPrintMenu(data[7])}
                            <tr>
                                <th colspan="2">Total Pembayaran</th>
                                <td colspan="2">${formatter.formatRupiah(
                                    data[3]
                                )}</td>
                            </tr>
                            <tr>
                                <th colspan="2">Waktu Pembayaran</th>
                                <td colspan="2">${new Date(
                                    data[9]
                                ).toLocaleString()}</td>
                            </tr>
                            </table>
                            <br />
                            <p>Terima kasih</p>
                            </td>
                            </tr>
                        </table>`;
                    const print = window.open("", "", "height=500, width=500");
                    print.document.write("<html>");
                    print.document.write(`<head>
                        <title>${data[0]}</title>
                    </head>`);
                    print.document.write("<body>");
                    print.document.write(div);
                    print.document.write("</body></html>");
                    print.document.close();
                    print.print();
                }

                function formatPrintMenu(menu) {
                    let tr = "";

                    menu.forEach((m, i) => {
                        const total =
                            parseInt(m.price) *
                            parseInt(m.pivot.quantity_ordered);
                        tr += `<tr>
                                <td>${++i}</td>
                                <td>${m.name} (${formatter.formatRupiah(
                            m.price
                        )})</td>
                                <td>${m.pivot.quantity_ordered}</td>
                                <td>${formatter.formatRupiah(
                                    total.toString()
                                )}</td>
                        </tr>`;
                    });
                    return tr;
                }
            });

            function initPaid(mustPaid) {
                const paidMoney = document.querySelector("#paidMoney");
                const returnMoney = document.querySelector("#returnMoney");
                paidMoney.addEventListener("input", () => {
                    const returnPaid =
                        parseInt(paidMoney.value) - parseInt(mustPaid);
                    if (returnPaid < 0) {
                        returnMoney.value = "Not enough paid";
                    } else {
                        returnMoney.value = formatter.formatRupiah(
                            returnPaid.toString()
                        );
                    }
                });
            }
        },
        create: async function () {
            this.data.payload.order_food = [];
            this.data.payload.table_number = null;
            this.data.loading = APP_LOADING.activate();
            if (this.data.payload.order_food.length < 1) {
                this.data.dom.order_food =
                    document.querySelector("#order_food");
                this.data.dom.order_food.innerHTML = `<p class="form-control-plaintext">No Foods selected</p>`;
            }

            this.data.foodList = await this.getFoodList();
            this.data.diningTableList = await this.getDiningTableList();
            if (this.data.foodList.status && this.data.diningTableList.status) {
                this.data.dom.food_ordered =
                    document.querySelector("#food_ordered");

                this.data.foodList.data.forEach((f) => {
                    const option = document.createElement("option");
                    option.value = f.id;
                    option.textContent =
                        f.name + " (" + formatter.formatRupiah(f.price) + ")";
                    this.data.dom.food_ordered.appendChild(option);
                });

                APP_LOADING.cancel(this.data.loading);
                this.data.dom.inputs = document.querySelectorAll("input");
                this.data.dom.inputs.forEach((input) => {
                    input.addEventListener("input", (e) => {
                        e.target.classList.remove("is-invalid");
                    });
                });
                this.data.dom.food_ordered.addEventListener("change", (e) => {
                    e.target.classList.remove("is-invalid");
                });
                this.data.dom.addFoodOrderedForm = document.querySelector(
                    "#addFoodOrderedForm"
                );
                this.data.dom.addFoodOrderModal = new bootstrap.Modal(
                    "#addFoodOrderModal"
                );
                this.data.dom.addFoodOrderedForm.addEventListener(
                    "submit",
                    (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        if (this.validate(formData)) {
                            const opt = this.data.dom.food_ordered.options;
                            const optSelected = opt[opt.selectedIndex];
                            const li = document.createElement("li");
                            li.className =
                                "list-group-item d-flex justify-content-between align-items-start";
                            const div = document.createElement("div");
                            div.className = "ms-2 me-auto";
                            div.innerHTML = `<div class="fw-bold">${
                                optSelected.textContent
                            }</div>
                                                Quantity : ${formData.get(
                                                    "food_ordered_quantity"
                                                )}`;
                            li.appendChild(div);
                            const span = document.createElement("span");
                            span.className =
                                "badge bg-danger rounded-pill removeMenu";
                            span.style.cursor = "pointer";
                            span.textContent = "-";
                            span.setAttribute("data-value", optSelected.value);
                            span.setAttribute(
                                "data-name",
                                optSelected.textContent
                            );
                            li.appendChild(span);
                            if (this.data.payload.order_food < 1) {
                                this.data.dom.order_food.firstChild.remove();
                                const ul = document.createElement("ol");
                                ul.className = "list-group list-group-numbered";
                                ul.id = "listFoodOrder";
                                ul.appendChild(li);
                                this.data.dom.order_food.appendChild(ul);
                            } else {
                                const listFoodOrder =
                                    document.querySelector("#listFoodOrder");
                                listFoodOrder.appendChild(li);
                            }
                            this.data.payload.order_food.push({
                                food: optSelected.value,
                                quantity_ordered: formData.get(
                                    "food_ordered_quantity"
                                ),
                            });
                            this.data.dom.addFoodOrderModal.hide();
                            this.data.dom.food_ordered.remove(
                                opt.selectedIndex
                            );
                        }
                    }
                );

                this.data.dom.order_food.addEventListener("click", (e) => {
                    if (e.target.classList.contains("removeMenu")) {
                        const idx = this.data.payload.order_food.findIndex(
                            (i) =>
                                i.food === e.target.getAttribute("data-value")
                        );
                        this.data.payload.order_food.splice(idx, 1);
                        const option = document.createElement("option");
                        option.value = e.target.getAttribute("data-value");
                        option.textContent = e.target.getAttribute("data-name");
                        this.data.dom.food_ordered.append(option);
                        if (this.data.payload.order_food.length < 1) {
                            this.data.dom.order_food.innerHTML = `<p class="form-control-plaintext">No Foods selected</p>`;
                        } else {
                            const listFoodOrder =
                                document.querySelector("#listFoodOrder");
                            const li = e.target.parentNode;
                            listFoodOrder.removeChild(li);
                        }
                    }
                });
                this.data.dom.addOrderForm =
                    document.querySelector("#addOrderForm");
                this.data.dom.errorMessage =
                    document.querySelector("#errorMessage");

                const type_order = document.getElementsByName("type_order");
                const type_order_feedback = document.querySelector(
                    "#type_order_feedback"
                );
                const fieldTable = document.querySelector("#fieldTable");
                type_order.forEach((t) => {
                    t.addEventListener("change", () => {
                        type_order_feedback.classList.add("d-none");
                        if (t.value === "dine_in") {
                            fieldTable.innerHTML = `<label for="order_table_number" class="col-sm-3 col-form-label">Dining Table Number</label>
                            <div class="col-sm-9">
                               <select class="form-control" id="order_table_number" name="order_table_number">
                                    <option value="" selected>-- Choose Table Number --</option>
                                </select>
                                <div class="invalid-feedback" id="order_table_number_feedback"></div>
                            </div>`;
                            this.data.dom.order_table_number =
                                document.querySelector("#order_table_number");
                            this.data.diningTableList.data.forEach((t) => {
                                const option = document.createElement("option");
                                option.value = t.id;
                                option.textContent = t.number;
                                this.data.dom.order_table_number.appendChild(
                                    option
                                );
                            });
                            this.data.dom.order_table_number.addEventListener(
                                "change",
                                (e) => {
                                    e.target.classList.remove("is-invalid");
                                }
                            );
                        } else if (t.value === "direct") {
                            fieldTable.innerHTML = "";
                        } else {
                            document.location.href = location.href;
                        }
                    });
                });

                const order_notes = document.querySelector("#order_notes");
                order_notes.value = "";
                order_notes.addEventListener("input", () => {
                    if (order_notes.value.length > 100) {
                        order_notes.classList.add("is-invalid");
                        return;
                    }
                    order_notes.classList.remove("is-invalid");
                });
                this.data.dom.addOrderForm.addEventListener(
                    "submit",
                    async (e) => {
                        e.preventDefault();
                        const orderFormData = new FormData(e.target);
                        orderFormData.append(
                            "order_food",
                            JSON.stringify(this.data.payload.order_food)
                        );

                        let checked = false;
                        type_order.forEach((t) => {
                            if (t.checked) {
                                checked = true;
                            }
                        });
                        if (!checked) {
                            type_order_feedback.classList.remove("d-none");
                            return;
                        }
                        if (order_notes.value.length > 100) {
                            order_notes.classList.add("is-invalid");
                            return;
                        }

                        if (this.validate(orderFormData)) {
                            this.data.loading = APP_LOADING.activate();
                            const ordered = await this.store(orderFormData);

                            if (!ordered.status) {
                                TOAST.classList.remove("bg-success");
                                TOAST.classList.add("bg-danger");
                                const res = ordered.data;
                                if (res.errors) {
                                    TOAST_BODY.innerHTML = "";
                                    const ul = document.createElement("ul");
                                    Object.keys(res.errors).forEach((key) => {
                                        const li = document.createElement("li");
                                        li.textContent = res.errors[key][0];
                                        ul.appendChild(li);
                                    });
                                    TOAST_BODY.appendChild(ul);
                                } else {
                                    TOAST_BODY.textContent = ordered.message;
                                }
                                TOAST_APP.show();
                                APP_LOADING.cancel(this.data.loading);
                            } else {
                                APP_LOADING.cancel(this.data.loading);
                                TOAST_BODY.textContent = ordered.message;
                                TOAST.classList.remove("bg-danger");
                                TOAST.classList.add("bg-success");
                                TOAST_APP.show();
                                history.pushState("", "", "/admin/order");
                                routing.run("/admin/order");
                            }
                        }
                    }
                );
            } else {
                APP_LOADING.cancel(this.data.loading);
                TOAST_BODY.textContent = "Could not load data";
                TOAST.classList.add("bg-danger");
                TOAST_APP.show();
            }
            return;
        },
        edit: async function (params) {
            this.data.payload.order_food = [];
            this.data.payload.table_number = null;
            this.data.loading = APP_LOADING.activate();
            this.data.diningTableList = await this.getDiningTableList();
            this.data.foodList = await this.getFoodList();
            const order = await this.getOrderById(params);

            if (this.data.foodList.status && order.status) {
                this.data.payload.id = order.data.id;
                this.data.payload.table_number = order.data.table_number;
                this.data.dom.food_ordered =
                    document.querySelector("#food_ordered");
                this.data.dom.order_food =
                    document.querySelector("#order_food");
                const ul = document.createElement("ol");
                ul.className = "list-group list-group-numbered";
                ul.id = "listFoodOrder";
                this.data.foodList.data.forEach((f) => {
                    let hasSelect = false;
                    order.data.foods.forEach((of) => {
                        if (of.id == f.id) {
                            hasSelect = true;
                            const li = document.createElement("li");
                            li.className =
                                "list-group-item d-flex justify-content-between align-items-start";
                            const div = document.createElement("div");
                            div.className = "ms-2 me-auto";
                            div.innerHTML = `<div class="fw-bold">${
                                of.name
                            } (${formatter.formatRupiah(
                                of.price
                            )})</div> Quantity : ${of.pivot.quantity_ordered}`;
                            li.appendChild(div);
                            const span = document.createElement("span");
                            span.className =
                                "badge bg-danger rounded-pill removeMenu";
                            span.style.cursor = "pointer";
                            span.textContent = "-";
                            span.setAttribute("data-value", of.id);
                            span.setAttribute(
                                "data-name",
                                `${of.name} (${formatter.formatRupiah(
                                    of.price
                                )})`
                            );
                            li.appendChild(span);
                            ul.appendChild(li);
                            this.data.dom.order_food.appendChild(ul);
                            this.data.payload.order_food.push({
                                food: of.id,
                                quantity_ordered: of.pivot.quantity_ordered,
                            });
                        }
                    });
                    if (!hasSelect) {
                        const option = document.createElement("option");
                        option.value = f.id;
                        option.textContent =
                            f.name +
                            " (" +
                            formatter.formatRupiah(f.price) +
                            ")";
                        this.data.dom.food_ordered.appendChild(option);
                    }
                });
                const fieldTable = document.querySelector("#fieldTable");
                if (order.data.table_id != null) {
                    fieldTable.innerHTML = `<label for="order_table_number" class="col-sm-3 col-form-label">Dining Table Number</label>
                            <div class="col-sm-9">
                               <select class="form-control" id="order_table_number" name="order_table_number">
                                </select>
                                <div class="invalid-feedback" id="order_table_number_feedback"></div>
                            </div>`;
                    const order_table_number = document.querySelector(
                        "#order_table_number"
                    );
                    const option = document.createElement("option");
                    option.value = order.data.table_id;
                    option.textContent = order.data.table.number;
                    option.selected = true;
                    order_table_number.appendChild(option);
                    this.data.diningTableList.data.forEach((t) => {
                        const option = document.createElement("option");
                        option.value = t.id;
                        option.textContent = t.number;
                        order_table_number.appendChild(option);
                    });
                    order_table_number.addEventListener("change", (e) => {
                        e.target.classList.remove("is-invalid");
                    });
                    const dineIn = document.querySelector("#dineIn");
                    dineIn.checked = true;
                } else {
                    const direct = document.querySelector("#direct");
                    direct.checked = true;
                }
                const order_customer_name = document.querySelector(
                    "#order_customer_name"
                );
                order_customer_name.value = order.data.customer_name;
                const order_notes = document.querySelector("#order_notes");
                order_notes.value = order.data.notes;
                APP_LOADING.cancel(this.data.loading);
                this.data.dom.inputs = document.querySelectorAll("input");
                this.data.dom.inputs.forEach((input) => {
                    input.addEventListener("input", (e) => {
                        e.target.classList.remove("is-invalid");
                    });
                });
                this.data.dom.food_ordered.addEventListener("change", (e) => {
                    e.target.classList.remove("is-invalid");
                });
                this.data.dom.addFoodOrderedForm = document.querySelector(
                    "#addFoodOrderedForm"
                );
                this.data.dom.addFoodOrderModal = new bootstrap.Modal(
                    "#addFoodOrderModal"
                );
                this.data.dom.addFoodOrderedForm.addEventListener(
                    "submit",
                    (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        if (this.validate(formData)) {
                            const opt = this.data.dom.food_ordered.options;
                            const optSelected = opt[opt.selectedIndex];
                            const li = document.createElement("li");
                            li.className =
                                "list-group-item d-flex justify-content-between align-items-start";
                            const div = document.createElement("div");
                            div.className = "ms-2 me-auto";
                            div.innerHTML = `<div class="fw-bold">${
                                optSelected.textContent
                            }</div>
                                                Quantity : ${formData.get(
                                                    "food_ordered_quantity"
                                                )}`;
                            li.appendChild(div);
                            const span = document.createElement("span");
                            span.className =
                                "badge bg-danger rounded-pill removeMenu";
                            span.style.cursor = "pointer";
                            span.textContent = "-";
                            span.setAttribute("data-value", optSelected.value);
                            span.setAttribute(
                                "data-name",
                                optSelected.textContent
                            );
                            li.appendChild(span);
                            if (this.data.payload.order_food < 1) {
                                this.data.dom.order_food.firstChild.remove();
                                const ul = document.createElement("ol");
                                ul.className = "list-group list-group-numbered";
                                ul.id = "listFoodOrder";
                                ul.appendChild(li);
                                this.data.dom.order_food.appendChild(ul);
                            } else {
                                const listFoodOrder =
                                    document.querySelector("#listFoodOrder");
                                listFoodOrder.appendChild(li);
                            }
                            this.data.payload.order_food.push({
                                food: optSelected.value,
                                quantity_ordered: formData.get(
                                    "food_ordered_quantity"
                                ),
                            });
                            this.data.dom.addFoodOrderModal.hide();
                            this.data.dom.food_ordered.remove(
                                opt.selectedIndex
                            );
                        }
                    }
                );
                this.data.dom.order_food.addEventListener("click", (e) => {
                    if (e.target.classList.contains("removeMenu")) {
                        const idx = this.data.payload.order_food.findIndex(
                            (i) =>
                                i.food === e.target.getAttribute("data-value")
                        );

                        this.data.payload.order_food.splice(idx, 1);
                        const option = document.createElement("option");
                        option.value = e.target.getAttribute("data-value");
                        option.textContent = e.target.getAttribute("data-name");
                        this.data.dom.food_ordered.append(option);
                        if (this.data.payload.order_food.length < 1) {
                            this.data.dom.order_food.innerHTML = `<p class="form-control-plaintext">No Foods selected</p>`;
                        } else {
                            const listFoodOrder =
                                document.querySelector("#listFoodOrder");
                            const li = e.target.parentNode;
                            listFoodOrder.removeChild(li);
                        }
                    }
                });

                const type_order = document.getElementsByName("type_order");
                const type_order_feedback = document.querySelector(
                    "#type_order_feedback"
                );
                type_order.forEach((t) => {
                    t.addEventListener("change", () => {
                        type_order_feedback.classList.add("d-none");
                        if (t.value === "dine_in") {
                            fieldTable.innerHTML = `<label for="order_table_number" class="col-sm-3 col-form-label">Dining Table Number</label>
                            <div class="col-sm-9">
                               <select class="form-control" id="order_table_number" name="order_table_number">
                                </select>
                                <div class="invalid-feedback" id="order_table_number_feedback"></div>
                            </div>`;
                            const order_table_number = document.querySelector(
                                "#order_table_number"
                            );
                            const option = document.createElement("option");
                            option.value = order.data.table_id;
                            option.textContent = order.data.table.number;
                            option.selected = true;
                            order_table_number.appendChild(option);
                            this.data.diningTableList.data.forEach((t) => {
                                const option = document.createElement("option");
                                option.value = t.id;
                                option.textContent = t.number;
                                order_table_number.appendChild(option);
                            });
                            order_table_number.addEventListener(
                                "change",
                                (e) => {
                                    e.target.classList.remove("is-invalid");
                                }
                            );
                        } else if (t.value === "direct") {
                            fieldTable.innerHTML = "";
                        } else {
                            document.location.href = location.href;
                        }
                    });
                });
                order_notes.addEventListener("input", () => {
                    if (order_notes.value.length > 100) {
                        order_notes.classList.add("is-invalid");
                        return;
                    }
                    order_notes.classList.remove("is-invalid");
                });
                this.data.dom.addOrderForm =
                    document.querySelector("#addOrderForm");
                this.data.dom.errorMessage =
                    document.querySelector("#errorMessage");
                this.data.dom.addOrderForm.addEventListener(
                    "submit",
                    async (e) => {
                        e.preventDefault();
                        let checked = false;
                        type_order.forEach((t) => {
                            if (t.checked) {
                                checked = true;
                            }
                        });
                        if (!checked) {
                            type_order_feedback.classList.remove("d-none");
                            return;
                        }
                        if (order_notes.value.length > 100) {
                            order_notes.classList.add("is-invalid");
                            return;
                        }
                        const orderFormData = new FormData(e.target);
                        orderFormData.append("order_id", this.data.payload.id);
                        orderFormData.append(
                            "order_food",
                            JSON.stringify(this.data.payload.order_food)
                        );
                        if (this.validate(orderFormData)) {
                            this.data.loading = APP_LOADING.activate();
                            const ordered = await this.update(orderFormData);

                            if (!ordered.status) {
                                TOAST.classList.remove("bg-success");
                                TOAST.classList.add("bg-danger");
                                const res = ordered.data;
                                if (res.errors) {
                                    TOAST_BODY.innerHTML = "";
                                    const ul = document.createElement("ul");
                                    Object.keys(res.errors).forEach((key) => {
                                        const li = document.createElement("li");
                                        li.textContent = res.errors[key][0];
                                        ul.appendChild(li);
                                    });
                                    TOAST_BODY.appendChild(ul);
                                } else {
                                    TOAST_BODY.textContent = ordered.message;
                                }
                                TOAST_APP.show();
                                APP_LOADING.cancel(this.data.loading);
                            } else {
                                APP_LOADING.cancel(this.data.loading);
                                TOAST_BODY.textContent = ordered.message;
                                TOAST.classList.add("bg-success");
                                TOAST_APP.show();
                                history.pushState("", "", "/admin/order");
                                routing.run("/admin/order");
                            }
                        }
                    }
                );
            } else {
                APP_LOADING.cancel(this.data.loading);
                TOAST_BODY.textContent = "Failed to reach edit order page";
                TOAST.classList.add("bg-danger");
                history.pushState("", "", "/admin/order");
                routing.run("/admin/order");
                TOAST_APP.show();
            }
        },
        initSubmitPayment: async function (payment_order_id, modal) {
            const finishOrderForm = document.querySelector("#finishOrderForm");
            finishOrderForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                if (payment_order_id) {
                    this.data.loading = APP_LOADING.activate();
                    modal.hide();
                    TOAST.classList.remove("bg-success");
                    TOAST.classList.remove("bg-danger");
                    const paymentFormData = new FormData();
                    paymentFormData.append("_token", APP_STATE.csrf);
                    paymentFormData.append("payment_code", payment_order_id);
                    const finished = await this.finishOrder(paymentFormData);
                    if (!finished.status) {
                        APP_LOADING.cancel(this.data.loading);
                        TOAST.classList.add("bg-danger");
                        TOAST_BODY.textContent = finished.message;
                        TOAST_APP.show();
                        routing.run("/admin/order");
                    } else {
                        APP_LOADING.cancel(this.data.loading);
                        TOAST_BODY.textContent = finished.message;
                        TOAST.classList.add("bg-success");
                        TOAST_APP.show();
                        routing.run("/admin/order");
                    }
                } else {
                    document.location.href = location.href;
                }
            });
        },
        getOrders: function () {
            return fetch(`${APP_STATE.baseUrl}/api/admin/orders/get`)
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    return res;
                });
        },
        getOrderById: function (param) {
            return fetch(`${APP_STATE.baseUrl}/api/admin/orders/${param}/get`)
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    return res;
                });
        },
        finishOrder: function (payload) {
            return fetch(`${APP_STATE.baseUrl}/api/admin/orders/finish`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                },
                credentials: "same-origin",
                body: payload,
            })
                .then((response) => response.json())
                .then((res) => {
                    return res;
                });
        },
        delete: function (payload) {
            const newPayload = {
                delete_id: payload.get("delete_id"),
            };
            return fetch(`${APP_STATE.baseUrl}/api/admin/orders/delete`, {
                method: "DELETE",
                headers: {
                    accept: "application/json",
                    "Content-type": "application/json; charset=UTF-8",
                    "X-CSRF-TOKEN": APP_STATE.csrf,
                },
                credentials: "same-origin",
                body: JSON.stringify(newPayload),
            })
                .then((response) => response.json())
                .then((res) => {
                    return res;
                });
        },
        getFoodList: function () {
            return fetch(
                `${APP_STATE.baseUrl}/api/admin/orders?${new URLSearchParams({
                    list: "food",
                })}`
            )
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    return res;
                });
        },
        getDiningTableList: function () {
            return fetch(`${APP_STATE.baseUrl}/api/admin/tables/get`)
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    return res;
                });
        },
        validate: function (formData) {
            for (let pair of formData.entries()) {
                if (pair[1].type && pair[1].size > 0) {
                    const elem = document.querySelector("#" + pair[0]);
                    const elemFeedBack = document.querySelector(
                        "#" + pair[0] + "_feedback"
                    );
                    const arrFileType = pair[1].type.split("/");
                    if (arrFileType[0] != "image") {
                        elem.classList.add("is-invalid");
                        elemFeedBack.textContent =
                            "This field must be an image";
                        return false;
                    }
                    if (pair[1].size > 100000) {
                        elem.classList.add("is-invalid");
                        elemFeedBack.textContent =
                            "Image must be lower than 100KB";
                        return false;
                    }
                }
                if (
                    pair[0] === "order_food" &&
                    JSON.parse(pair[1]).length < 1
                ) {
                    this.data.dom.errorMessage.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show " role="alert" >
                        <strong>Choose at least 1 menu</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;

                    this.data.dom.errorMessage.classList.remove("d-none");
                    return false;
                }
                if (
                    !pair[1] &&
                    pair[1].name != "" &&
                    pair[0] != "order_notes"
                ) {
                    const elem = document.querySelector("#" + pair[0]);
                    const elemFeedBack = document.querySelector(
                        "#" + pair[0] + "_feedback"
                    );
                    elem.classList.add("is-invalid");
                    elemFeedBack.textContent = "This field is required";
                    return false;
                }
            }
            return true;
        },
        store: function (payload) {
            return fetch(`${APP_STATE.baseUrl}/api/admin/orders/save`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                },
                credentials: "same-origin",
                body: payload,
            })
                .then((response) => response.json())
                .then((res) => {
                    return res;
                });
        },
        update: function (payload) {
            return fetch(`${APP_STATE.baseUrl}/api/admin/orders/update`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                },
                credentials: "same-origin",
                body: payload,
            })
                .then((response) => response.json())
                .then((res) => {
                    return res;
                });
        },
    },
};

export default food;
