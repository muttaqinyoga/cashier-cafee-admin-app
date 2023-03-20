import foods from "../views/foods.js";
import addFood from "../views/add-food.js";
import editFood from "../views/edit-food.js";
import formatter from "../components/utility/formatter.js";
import routing from "../components/routing.js";

const food = {
    view: function (page) {
        switch (page) {
            case "index":
                return foods;
            case "create":
                return addFood;
            case "edit":
                return editFood;
            default:
                return foods;
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
            payload: null,
            foodList: null,
            categories: null,
            table: {
                headings: null,
                data: null,
            },
            loading: null,
            dom: {
                ConfirmDeleteModal: null,
                deleteConfirmForm: null,
                detailFoodModal: null,
                inputs: null,
                detail_food_name: null,
                detail_food_categories: null,
                detail_food_price: null,
                detail_food_status: null,
                detail_food_image: null,
                detail_food_description: null,
            },
        },
        index: async function () {
            this.data.loading = APP_LOADING.activate();
            this.data.foodList = await this.getFoods();
            if (this.data.foodList.status) {
                this.data.table.headings = [
                    "Id",
                    "Name",
                    "Categories",
                    "Price",
                    "Status",
                    "Action",
                    "image",
                    "desc",
                ];
                this.data.table.data = [];
                for (let i = 0; i < this.data.foodList.data.length; i++) {
                    const categories = [];
                    for (
                        let j = 0;
                        j < this.data.foodList.data[i]["categories"].length;
                        j++
                    ) {
                        categories.push(
                            this.data.foodList.data[i]["categories"][j]["name"]
                        );
                    }
                    this.data.table.data[i] = [];
                    this.data.table.data[i].push(
                        this.data.foodList.data[i]["id"]
                    );
                    this.data.table.data[i].push(
                        this.data.foodList.data[i]["name"]
                    );
                    this.data.table.data[i].push(categories.join(", "));
                    this.data.table.data[i].push(
                        this.data.foodList.data[i]["price"]
                    );
                    this.data.table.data[i].push(
                        this.data.foodList.data[i]["status_stock"]
                    );
                    this.data.table.data[i].push(
                        this.data.foodList.data[i]["created_at"]
                    );
                    this.data.table.data[i].push(
                        this.data.foodList.data[i]["image"]
                    );
                    this.data.table.data[i].push(
                        this.data.foodList.data[i]["description"]
                    );
                }
                this.initFoodTable(this.data.table);
                APP_LOADING.cancel(this.data.loading);
                /*   DELETE FOOD  */
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
                        const deleteFoodForm = new FormData(e.target);
                        const deleted = await this.delete(deleteFoodForm);
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
                            routing.run("/admin/food");
                        }
                    }
                );
                /*   END DELETE FOOD  */
                /*   DETAIL FOOD  */
                this.data.dom.detailFoodModal = new bootstrap.Modal(
                    "#detailFoodModal"
                );
                this.data.dom.detail_food_name =
                    document.querySelector("#detail_food_name");
                this.data.dom.detail_food_categories = document.querySelector(
                    "#detail_food_categories"
                );
                this.data.dom.detail_food_price =
                    document.querySelector("#detail_food_price");
                this.data.dom.detail_food_status = document.querySelector(
                    "#detail_food_status"
                );
                this.data.dom.detail_food_image =
                    document.querySelector("#detail_food_image");
                this.data.dom.detail_food_description = document.querySelector(
                    "#detail_food_description"
                );
                /*   END DETAIL FOOD  */
            } else {
                APP_LOADING.cancel(this.data.loading);
                TOAST_BODY.textContent = this.data.foodList.message;
                TOAST.classList.add("bg-danger");
                TOAST_APP.show();
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
                        select: 4,
                        render: function (data) {
                            return data == "Tersedia"
                                ? `<span class="badge rounded-pill bg-primary">${data}</span>`
                                : `<span class="badge rounded-pill bg-danger">${data}</span>`;
                        },
                    },
                    {
                        select: 7,
                        sortable: false,
                        hidden: true,
                    },
                    {
                        select: 6,
                        sortable: false,
                        hidden: true,
                    },
                    {
                        select: 2,
                        sortable: false,
                    },
                    {
                        select: 5,
                        sortable: false,
                        render: function (data, cell, row) {
                            return `
                            <button type="button" class="btn btn-info btn-sm detailFood">Detail</button>
                            <a href="/admin/food/${row.childNodes[0].textContent}/edit" class="btn btn-warning btn-sm" data-link>Edit</a>
                            <button type="button" class="btn btn-danger btn-sm deleteFood">Delete</button>
                            `;
                        },
                    },
                    {
                        select: 3,
                        render: function (data) {
                            return formatter.formatRupiah(data);
                        },
                    },
                    {
                        select: 0,
                        sortable: false,
                        hidden: true,
                    },
                ],
                perPage: 4,
                perPageSelect: [4, 10, 20, 50],
            });
            FoodDataTables.on("datatable.init", function () {
                const thead = document.querySelector("#foodTables > thead");
                thead.classList.add("table-dark");
            });
            foodTables.addEventListener("click", (e) => {
                if (e.target.classList.contains("deleteFood")) {
                    const idx = e.target.parentNode.parentNode.dataIndex;
                    const data = this.data.table.data[idx];
                    const delete_id = document.querySelector("#delete_id");
                    const modalBody = document.querySelector(
                        "#ConfirmDeleteModal .modal-body"
                    );
                    modalBody.innerHTML = `Do you want to remove <strong>${data[1]}</strong> from Food List ?`;
                    delete_id.value = data[0];
                    this.data.dom.ConfirmDeleteModal.show();
                } else if (e.target.classList.contains("detailFood")) {
                    const idx = e.target.parentNode.parentNode.dataIndex;
                    const data = this.data.table.data[idx];
                    this.data.dom.detail_food_name.value = data[1];
                    this.data.dom.detail_food_categories.value = data[2];
                    this.data.dom.detail_food_price.value =
                        formatter.formatRupiah(data[3]);
                    this.data.dom.detail_food_status.textContent = data[4];
                    if (data[4] == "Tersedia") {
                        this.data.dom.detail_food_status.classList.remove(
                            "bg-danger"
                        );
                        this.data.dom.detail_food_status.classList.add(
                            "bg-primary"
                        );
                    } else {
                        this.data.dom.detail_food_status.classList.remove(
                            "bg-primary"
                        );
                        this.data.dom.detail_food_status.classList.add(
                            "bg-danger"
                        );
                    }
                    this.data.dom.detail_food_image.setAttribute(
                        "src",
                        `${APP_STATE.assetUrl}images/foods/${data[6]}`
                    );
                    this.data.dom.detail_food_description.textContent = data[7];
                    this.data.dom.detailFoodModal.show();
                }
            });
        },
        create: async function () {
            this.data.loading = APP_LOADING.activate();
            this.data.categories = await this.getCategories();
            if (this.data.categories.status) {
                const food_categories =
                    document.querySelector("#food_categories");
                this.data.categories.data.forEach((c) => {
                    const option = document.createElement("option");
                    option.value = c.id;
                    option.textContent = c.name;
                    food_categories.appendChild(option);
                });
                APP_LOADING.cancel(this.data.loading);
                this.data.payload = {
                    food_categories: [],
                };
                this.data.dom.inputs = document.querySelectorAll("input");
                this.data.dom.inputs.forEach(function (input) {
                    input.addEventListener("input", function (e) {
                        e.target.classList.remove("is-invalid");
                    });
                });
                const food_description =
                    document.querySelector("#food_description");
                food_description.value = null;

                const selected_categories = document.querySelector(
                    "#selected_categories"
                );
                if (this.data.payload.food_categories.length < 1) {
                    selected_categories.innerHTML = `<small>No Category Selected</small>`;
                }
                food_categories.addEventListener("change", (e) => {
                    const optSelected =
                        e.target.options[e.target.selectedIndex];
                    this.data.categories.data.forEach((c) => {
                        if (c.id === optSelected.value) {
                            this.data.payload.food_categories.push(
                                optSelected.value
                            );
                            if (this.data.payload.food_categories.length <= 1) {
                                selected_categories.firstChild.remove();
                            }
                            e.target.classList.remove("is-invalid");
                            const small = document.createElement("small");
                            small.innerHTML = `${optSelected.textContent} <span class="badge rounded-pill bg-danger category-choosed" value="${optSelected.value}" name="${optSelected.textContent}" style="cursor: pointer;" > x </span>`;
                            selected_categories.appendChild(small);
                            e.target.remove(e.target.selectedIndex);
                        }
                    });
                });
                selected_categories.addEventListener("click", (e) => {
                    if (e.target.classList.contains("category-choosed")) {
                        const idx = this.data.payload.food_categories.findIndex(
                            (c) => c === e.target.getAttribute("value")
                        );
                        this.data.payload.food_categories.splice(idx, 1);
                        selected_categories.removeChild(e.target.parentNode);
                        if (this.data.payload.food_categories.length < 1) {
                            selected_categories.innerHTML = `<small>No Category Selected</small>`;
                        }
                        const option = document.createElement("option");
                        option.value = e.target.getAttribute("value");
                        option.textContent = e.target.getAttribute("name");
                        food_categories.appendChild(option);
                    }
                });
                const addFoodForm = document.querySelector("#addFoodForm");
                addFoodForm.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const foodFormData = new FormData(e.target);
                    foodFormData.append(
                        "food_categories",
                        this.data.payload.food_categories
                    );

                    if (this.validate(foodFormData)) {
                        this.data.loading = APP_LOADING.activate();
                        TOAST.classList.remove("bg-success");
                        TOAST.classList.remove("bg-danger");

                        const saved = await this.store(foodFormData);
                        if (!saved.status) {
                            APP_LOADING.cancel(this.data.loading);
                            const res = saved.data;
                            TOAST.classList.add("bg-danger");
                            if (res) {
                                TOAST_BODY.innerHTML = "";
                                const ul = document.createElement("ul");
                                Object.keys(res.errors).forEach((key) => {
                                    const li = document.createElement("li");
                                    li.textContent = res.errors[key][0];
                                    ul.appendChild(li);
                                });
                                TOAST_BODY.appendChild(ul);
                            } else {
                                TOAST_BODY.textContent = saved.message;
                            }
                            TOAST_APP.show();
                        } else {
                            APP_LOADING.cancel(this.data.loading);
                            TOAST_BODY.textContent = saved.message;
                            TOAST.classList.add("bg-success");
                            TOAST_APP.show();
                            history.pushState("", "", "/admin/food");
                            routing.run("/admin/food");
                        }
                    }
                });
            } else {
                APP_LOADING.cancel(this.data.loading);
                TOAST_BODY.textContent = this.data.foodList.message;
                TOAST.classList.add("bg-danger");
                TOAST_APP.show();
            }
            return;
        },
        edit: async function (params) {
            this.data.loading = APP_LOADING.activate();
            this.data.categories = await this.getCategories();
            const food = await this.getFoodById(params);
            if (this.data.categories.status && food.status) {
                this.data.payload = {
                    edit_food_categories: [],
                    edit_food_status: null,
                };
                const edit_food_name =
                    document.querySelector("#edit_food_name");
                const edit_food_price =
                    document.querySelector("#edit_food_price");
                const edit_food_description = document.querySelector(
                    "#edit_food_description"
                );
                const edit_food_status =
                    document.getElementsByName("edit_food_status");
                const edit_food_categories = document.querySelector(
                    "#edit_food_categories"
                );
                const edit_selected_categories = document.querySelector(
                    "#edit_selected_categories"
                );
                edit_food_status.forEach((s) => {
                    if (s.value === food.data.status_stock) {
                        this.data.payload.edit_food_status =
                            food.data.status_stock;
                        s.checked = true;
                    }
                });
                edit_food_name.value = food.data.name;
                edit_food_price.value = food.data.price;
                edit_food_description.value = food.data.description;
                edit_food_description.textContent = food.data.description;
                this.data.categories.data.forEach((c) => {
                    let hasSelected = false;
                    food.data.categories.forEach((fc) => {
                        if (fc.id === c.id) {
                            this.data.payload.edit_food_categories.push(c.id);
                            const small = document.createElement("small");
                            small.innerHTML = ` ${fc.name} <span class="badge rounded-pill bg-danger category-choosed" name="${fc.name}" value="${fc.id}" style="cursor: pointer;" > x </span>`;
                            edit_selected_categories.appendChild(small);
                            hasSelected = true;
                        }
                    });
                    if (!hasSelected) {
                        const option = document.createElement("option");
                        option.value = c.id;
                        option.textContent = c.name;
                        edit_food_categories.appendChild(option);
                    }
                });
                APP_LOADING.cancel(this.data.loading);
                this.data.dom.inputs = document.querySelectorAll("input");
                this.data.dom.inputs.forEach((input) => {
                    input.addEventListener("input", function (e) {
                        e.target.classList.remove("is-invalid");
                    });
                    if (input.type === "radio") {
                        input.addEventListener("change", (r) => {
                            this.data.payload.edit_food_status = r.target.value;
                        });
                    }
                });
                edit_food_categories.addEventListener("change", (e) => {
                    const optSelected =
                        e.target.options[e.target.selectedIndex];
                    this.data.categories.data.forEach((c) => {
                        if (c.id === optSelected.value) {
                            this.data.payload.edit_food_categories.push(
                                optSelected.value
                            );
                            if (
                                this.data.payload.edit_food_categories.length <=
                                1
                            ) {
                                edit_selected_categories.firstChild.remove();
                            }
                            e.target.classList.remove("is-invalid");
                            const small = document.createElement("small");
                            small.innerHTML = `${optSelected.textContent} <span class="badge rounded-pill bg-danger category-choosed" name="${optSelected.textContent}" value="${optSelected.value}" style="cursor: pointer;" > x </span>`;
                            edit_selected_categories.appendChild(small);
                            e.target.remove(e.target.selectedIndex);
                        }
                    });
                });
                edit_selected_categories.addEventListener("click", (e) => {
                    if (e.target.classList.contains("category-choosed")) {
                        const idx =
                            this.data.payload.edit_food_categories.findIndex(
                                (c) => c === e.target.getAttribute("value")
                            );
                        this.data.payload.edit_food_categories.splice(idx, 1);
                        edit_selected_categories.removeChild(
                            e.target.parentNode
                        );
                        if (this.data.payload.edit_food_categories.length < 1) {
                            edit_selected_categories.innerHTML = `<small>No Category Selected</small>`;
                        }
                        const option = document.createElement("option");
                        option.value = e.target.getAttribute("value");
                        option.textContent = e.target.getAttribute("name");
                        edit_food_categories.appendChild(option);
                    }
                });
                const editFoodForm = document.querySelector("#editFoodForm");
                editFoodForm.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const foodFormData = new FormData(e.target);
                    foodFormData.append(
                        "edit_food_categories",
                        this.data.payload.edit_food_categories
                    );
                    foodFormData.append("edit_food_id", params);
                    foodFormData.append(
                        "edit_food_status",
                        this.data.payload.edit_food_status
                    );
                    if (this.validate(foodFormData)) {
                        this.data.loading = APP_LOADING.activate();
                        TOAST.classList.remove("bg-success");
                        TOAST.classList.remove("bg-danger");

                        const updated = await this.update(foodFormData);
                        if (!updated.status) {
                            APP_LOADING.cancel(this.data.loading);
                            const res = updated.data;
                            TOAST.classList.add("bg-danger");
                            if (res) {
                                TOAST_BODY.innerHTML = "";
                                const ul = document.createElement("ul");
                                Object.keys(res.errors).forEach((key) => {
                                    const li = document.createElement("li");
                                    li.textContent = res.errors[key][0];
                                    ul.appendChild(li);
                                });
                                TOAST_BODY.appendChild(ul);
                            } else {
                                TOAST_BODY.textContent = updated.message;
                            }
                            TOAST_APP.show();
                        } else {
                            APP_LOADING.cancel(this.data.loading);
                            TOAST_BODY.textContent = updated.message;
                            TOAST.classList.add("bg-success");
                            TOAST_APP.show();
                            history.pushState("", "", "/admin/food");
                            routing.run("/admin/food");
                        }
                    }
                });
            } else {
                APP_LOADING.cancel(this.data.loading);
                TOAST_BODY.textContent = "Failed to reach edit food page";
                TOAST.classList.add("bg-danger");
                history.pushState("", "", "/admin/food");
                routing.run("/admin/food");
                TOAST_APP.show();
            }
        },
        getFoodById: function (id) {
            return fetch(`${APP_STATE.baseUrl}/api/admin/foods/${id}/get`)
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    return res;
                });
        },
        delete: function (payload) {
            const newPayload = {
                delete_id: payload.get("delete_id"),
            };
            return fetch(`${APP_STATE.baseUrl}/api/admin/foods/delete`, {
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
        update: function (data) {
            return fetch(`${APP_STATE.baseUrl}/api/admin/foods/update`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                },
                credentials: "same-origin",
                body: data,
            })
                .then((response) => response.json())
                .then((res) => {
                    return res;
                });
        },
        getCategories: function () {
            return fetch(`${APP_STATE.baseUrl}/api/admin/categories/get`)
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
                    !pair[1] &&
                    pair[1].name != "" &&
                    pair[0] != "food_description" &&
                    pair[0] != "edit_food_description"
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
            return fetch(`${APP_STATE.baseUrl}/api/admin/foods/save`, {
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
