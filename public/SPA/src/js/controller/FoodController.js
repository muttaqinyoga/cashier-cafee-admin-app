import foods from "../views/foods.js";
import addFood from "../views/add-food.js";
import editFood from "../views/edit-food.js";
import formatter from "../components/utility/formatter.js";
import validation from "../components/utility/validation.js";
import routing from "../components/routing.js";

const food = {
    view: function (page, params = null) {
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
        getFoodById: function (id) {
            return fetch(`${baseUrl}/api/admin/foods/${id}/get`)
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    if (res.status === "success") {
                        const data = res.data;
                        return data;
                    }
                    return null;
                });
        },
        create: async function () {
            const loading = APP_LOADING.activate();
            const categories = await this.getCategories();
            const validCategories = [];
            const food_categories = document.querySelector("#food_categories");
            if (categories) {
                APP_LOADING.cancel(loading);
                categories.forEach((c) => {
                    validCategories.push(c.id);
                    const option = document.createElement("option");
                    option.value = c.id;
                    option.textContent = c.name;
                    food_categories.appendChild(option);
                });
            } else {
                const toastAlert = document.querySelector("#toastAlert");
                const toastBody = document.querySelector(
                    "#toastAlert .toast-body"
                );
                toastAlert.classList.add("bg-danger");
                toastBody.textContent = "Failed to load categories from Server";
                const toast = new bootstrap.Toast(toastAlert);
                toast.show();
            }
            // Category Field Handler
            const selectedCategories = [];
            const selected_categories = document.querySelector(
                "#selected_categories"
            );
            if (selectedCategories.length < 1) {
                selected_categories.innerHTML = `<small>No Category Selected</small>`;
            }
            food_categories.addEventListener("change", function () {
                if (validCategories.includes(this.value)) {
                    selectedCategories.push(this.value);
                    const optSelected = this.options[this.selectedIndex];
                    if (selectedCategories.length <= 1) {
                        selected_categories.firstChild.remove();
                    }
                    this.classList.remove("is-invalid");
                    const small = document.createElement("small");
                    small.innerHTML = ` ${optSelected.textContent} <span class="badge rounded-pill bg-danger category-selected ${optSelected.value}" value="${optSelected.textContent}" style="cursor: pointer;" > x </span>`;
                    selected_categories.appendChild(small);
                    this.remove(this.selectedIndex);
                } else {
                    window.location.href = window.location.href;
                }
            });
            selected_categories.addEventListener("click", function (e) {
                if (e.target.classList.contains("category-selected")) {
                    const data = {
                        id: e.target.classList[4],
                        name: e.target.getAttribute("value"),
                    };
                    if (data.id && data.name) {
                        const idx = selectedCategories.findIndex(
                            (i) => i == data.id
                        );
                        if (idx === -1) {
                            window.location.href = window.location.href;
                            return;
                        }
                        selectedCategories.splice(idx, 1);
                        selected_categories.removeChild(e.target.parentNode);
                        const option = document.createElement("option");
                        option.value = data.id;
                        option.textContent = data.name;
                        food_categories.appendChild(option);
                        if (selectedCategories.length < 1) {
                            selected_categories.innerHTML = `<small>No Category Selected</small>`;
                        }
                    }
                }
            });
            // Description field handler
            const food_description =
                document.querySelector("#food_description");
            const food_description_feedback = document.querySelector(
                "#food_description_feedback"
            );
            food_description.value = "";
            food_description.addEventListener("input", function () {
                const val = this.value.trim();
                if (!val) {
                    this.value = "";
                    return;
                }
                if (val.length > 30) {
                    food_description_feedback.textContent =
                        "Characters must be lower than 50";
                    this.classList.add("is-invalid");
                } else {
                    this.classList.remove("is-invalid");
                }
            });
            // Validation All Required Input and Validate Image
            const inputs = document.querySelectorAll("input");
            inputs.forEach(function (input) {
                input.addEventListener("input", function (e) {
                    if (e.target.type === "file") {
                        validation.checkFile(e.target.name);
                        return;
                    }
                    if (input.id === "food_price") {
                        const val = formatter.formatRupiah(this.value);
                        input.value = val;
                        validation.run(input.id);
                        return;
                    }
                    validation.run(input.id);
                });
            });
            // Form Submit
            const addFoodForm = document.querySelector("#addFoodForm");
            addFoodForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const checkValid = {
                    categories: false,
                    name: false,
                    price: false,
                };
                if (selectedCategories.length < 1) {
                    food_categories.classList.add("is-invalid");
                    food_categories_feedback.textContent =
                        "Please choose one category";
                } else {
                    checkValid.categories = true;
                }
                checkValid.name = validation.run("food_name");
                checkValid.price = validation.run("food_price");
                if (
                    checkValid.categories &&
                    checkValid.name &&
                    checkValid.price
                ) {
                    const payloadFood = new FormData(addFoodForm);
                    payloadFood.append(
                        "food_price",
                        formatter.reverseRupiah(food_price.value)
                    );
                    payloadFood.append("food_categories", selectedCategories);
                    food.method.store(payloadFood);
                }
            });
        },
        update: function (data) {
            let loading = APP_LOADING.activate();
            fetch(`${baseUrl}/api/admin/foods/update`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                },
                credentials: "same-origin",
                body: data,
            })
                .then((response) => response.json())
                .then((res) => {
                    const toastAlert = document.querySelector("#toastAlert");
                    const toastBody = document.querySelector(
                        "#toastAlert .toast-body"
                    );
                    const toast = new bootstrap.Toast(toastAlert);
                    if (res.status === "failed") {
                        if (res.errors) {
                            Object.keys(res.errors).forEach((key, index) => {
                                const elemInput = document.getElementById(key);
                                const elemFeedBack = document.getElementById(
                                    key + "_feedback"
                                );
                                if (elemInput && elemFeedBack) {
                                    elemInput.classList.add("is-invalid");
                                    elemFeedBack.textContent =
                                        res.errors[key][0];
                                }
                            });
                            return;
                        }

                        toastAlert.classList.add("bg-danger");
                        toastBody.textContent = "Failed to create new food";
                        toast.show();
                    } else if (res.status === "success") {
                        toastAlert.classList.add("bg-success");
                        toastBody.textContent = "Food successfuly updated";
                        toast.show();
                        APP_LOADING.cancel(loading);
                        setTimeout(() => {
                            history.pushState("", "", "/admin/foods");
                            routing.run("/admin/foods");
                        }, 500);
                    }
                });
        },
        store: function (data) {
            let loading = APP_LOADING.activate();
            fetch(`${baseUrl}/api/admin/foods/save`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                },
                credentials: "same-origin",
                body: data,
            })
                .then((response) => response.json())
                .then((res) => {
                    const toastAlert = document.querySelector("#toastAlert");
                    const toastBody = document.querySelector(
                        "#toastAlert .toast-body"
                    );
                    const toast = new bootstrap.Toast(toastAlert);

                    if (res.status === "failed") {
                        APP_LOADING.cancel(loading);
                        if (res.errors) {
                            Object.keys(res.errors).forEach((key, index) => {
                                const elemInput = document.getElementById(key);
                                const elemFeedBack = document.getElementById(
                                    key + "_feedback"
                                );
                                if (elemInput && elemFeedBack) {
                                    elemInput.classList.add("is-invalid");
                                    elemFeedBack.textContent =
                                        res.errors[key][0];
                                }
                            });
                            return;
                        }

                        toastAlert.classList.add("bg-danger");
                        toastBody.textContent = "Failed to create new food";
                        toast.show();
                    } else if (res.status === "created") {
                        toastAlert.classList.add("bg-success");
                        toastBody.textContent = "New food has been created";
                        toast.show();
                        APP_LOADING.cancel(loading);
                        setTimeout(() => {
                            history.pushState("", "", "/admin/foods");
                            routing.run("/admin/foods");
                        }, 500);
                    }
                })
                .catch((err) => console.error);
        },
        getCategories: function () {
            return fetch(`${baseUrl}/api/admin/categories/get`)
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    if (res.status === "success") {
                        const categories = res.data;
                        const data = [];
                        categories.forEach((e) => {
                            data.push({
                                id: e.id,
                                name: e.name,
                            });
                        });
                        return data;
                    }
                    return null;
                });
        },
        index: function () {
            let loading = APP_LOADING.activate();
            const foodTables = document.querySelector("#foodTables");
            let Foods = {
                headings: [
                    "Id",
                    "Name",
                    "Categories",
                    "Price",
                    "Status",
                    "Action",
                    "image",
                    "desc",
                ],
                data: [],
            };
            let FoodDataTables = null;
            loadFoods();
            function loadFoods() {
                fetch(`${baseUrl}/api/admin/foods/get`)
                    .then((response) => {
                        return response.json();
                    })
                    .then((res) => {
                        if (res.status === "success") {
                            APP_LOADING.cancel(loading);
                            for (let i = 0; i < res.data.length; i++) {
                                const categories = [];

                                for (
                                    let j = 0;
                                    j < res.data[i]["categories"].length;
                                    j++
                                ) {
                                    categories.push(
                                        res.data[i]["categories"][j]["name"]
                                    );
                                }
                                Foods.data[i] = [];
                                Foods.data[i].push(res.data[i]["id"]);
                                Foods.data[i].push(res.data[i]["name"]);
                                Foods.data[i].push(categories.join(", "));
                                Foods.data[i].push(res.data[i]["price"]);
                                Foods.data[i].push(res.data[i]["status_stock"]);
                                Foods.data[i].push(res.data[i]["created_at"]);
                                Foods.data[i].push(res.data[i]["image"]);
                                Foods.data[i].push(res.data[i]["description"]);
                            }
                            initFoodTable();
                            return;
                        }
                        initFoodTable();
                        toastAlert.classList.add = "bg-danger";
                        toastBody.textContent =
                            "Failed to load data from Server";
                        toast.show();
                        throw new Error(res.message);
                    })
                    .catch(console.error);
            }
            function initFoodTable() {
                FoodDataTables = new simpleDatatables.DataTable(foodTables, {
                    data: Foods,
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
                            <button type="button" class="btn btn-info btn-sm detail" data-bs-toggle="modal" data-bs-target="#detailFoodModal">Detail</button>
                            <a href="/admin/food/${row.childNodes[0].textContent}/edit" class="btn btn-warning btn-sm edit" data-link data-path="${row.childNodes[0].textContent}">Edit</a>
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
            }
            const deleteConfirmModal = new bootstrap.Modal(
                "#deleteConfirmModal"
            );
            const food_delete_id = document.querySelector("#food_delete_id");
            const deleteConfirmModalBody = document.querySelector(
                "#deleteConfirmModal .modal-body"
            );
            foodTables.addEventListener("click", function (e) {
                if (e.target.classList.contains("deleteFood")) {
                    const data =
                        FoodDataTables.data[
                            e.target.parentNode.parentNode.dataIndex
                        ];
                    const deleteFood = {
                        id: data.childNodes[0].data,
                        name: data.childNodes[1].data,
                    };
                    food_delete_id.value = deleteFood.id;
                    deleteConfirmModalBody.innerHTML = `Do you want to Delete <strong>${deleteFood.name}</strong> from Food List ?`;
                    deleteConfirmModal.show();
                }
            });
            const deleteConfirmFood =
                document.querySelector("#deleteConfirmFood");
            deleteConfirmFood.addEventListener("submit", function (e) {
                e.preventDefault();
                loading = APP_LOADING.activate();
                const payloadDeleteCategory = {
                    _token: csrf,
                    _method: "DELETE",
                    food_delete_id: document
                        .getElementsByName("food_delete_id")[0]
                        .getAttribute("value"),
                };
                const toastAlert = document.querySelector("#toastAlert");
                const toastBody = document.querySelector(
                    "#toastAlert .toast-body"
                );
                const toast = new bootstrap.Toast(toastAlert);
                fetch(`${baseUrl}/api/admin/foods/delete`, {
                    method: "DELETE",
                    headers: {
                        accept: "application/json",
                        "Content-type": "application/json; charset=UTF-8",
                        "X-CSRF-TOKEN": csrf,
                    },
                    credentials: "same-origin",
                    body: JSON.stringify(payloadDeleteCategory),
                })
                    .then((response) => response.json())
                    .then((res) => {
                        if (res.status === "failed") {
                            deleteConfirmModal.hide();
                            deleteConfirmFood.reset();
                            APP_LOADING.cancel(loading);
                            toastAlert.classList.add("bg-danger");
                            toastBody.textContent = res.message;
                            toast.show();
                            return;
                        } else if (res.status === "success") {
                            FoodDataTables.destroy();
                            FoodDataTables = null;
                            Foods.data = [];
                            deleteConfirmModal.hide();
                            loadFoods();
                            toastAlert.classList.add("bg-success");
                            toastBody.textContent = res.message;
                            toast.show();
                            return;
                        }
                    })
                    .catch((err) => {
                        console.error;
                    });
            });
        },
        edit: async function (params) {
            const loading = APP_LOADING.activate();
            const nav = document.querySelector(".foods");
            nav.classList.add("active");
            const categories = await this.getCategories();
            const food = await this.getFoodById(params);
            if (categories && food) {
                APP_LOADING.cancel(loading);
                const validCategories = [];
                const editSelectedCategories = [];
                const edit_food_name =
                    document.querySelector("#edit_food_name");
                const edit_food_price =
                    document.querySelector("#edit_food_price");
                const edit_food_description = document.querySelector(
                    "#edit_food_description"
                );
                const edit_food_categories = document.querySelector(
                    "#edit_food_categories"
                );
                const edit_selected_categories = document.querySelector(
                    "#edit_selected_categories"
                );
                edit_food_name.value = food.name;
                edit_food_price.value = formatter.formatRupiah(food.price);
                edit_food_description.value = food.description;
                edit_food_description.textContent = food.description;

                categories.forEach((c) => {
                    let hasSelected = false;
                    food.categories.forEach((fc) => {
                        validCategories.push(c.id);
                        if (fc.id === c.id) {
                            editSelectedCategories.push(c.id);
                            const small = document.createElement("small");
                            small.innerHTML = ` ${fc.name} <span class="badge rounded-pill bg-danger category-selected ${fc.id}" value="${fc.name}" style="cursor: pointer;" > x </span>`;
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
                edit_food_categories.addEventListener("change", function () {
                    if (validCategories.includes(this.value)) {
                        editSelectedCategories.push(this.value);
                        const optSelected = this.options[this.selectedIndex];
                        if (editSelectedCategories.length <= 1) {
                            edit_selected_categories.firstChild.remove();
                        }
                        this.classList.remove("is-invalid");
                        const small = document.createElement("small");
                        small.innerHTML = ` ${optSelected.textContent} <span class="badge rounded-pill bg-danger category-selected ${optSelected.value}" value="${optSelected.textContent}" style="cursor: pointer;" > x </span>`;
                        edit_selected_categories.appendChild(small);
                        this.remove(this.selectedIndex);
                    } else {
                        window.location.href = window.location.href;
                    }
                });
                edit_selected_categories.addEventListener(
                    "click",
                    function (e) {
                        if (e.target.classList.contains("category-selected")) {
                            const data = {
                                id: e.target.classList[4],
                                name: e.target.getAttribute("value"),
                            };
                            if (data.id && data.name) {
                                const idx = editSelectedCategories.findIndex(
                                    (i) => i == data.id
                                );
                                if (idx === -1) {
                                    window.location.href = window.location.href;
                                    return;
                                }
                                editSelectedCategories.splice(idx, 1);
                                edit_selected_categories.removeChild(
                                    e.target.parentNode
                                );
                                const option = document.createElement("option");
                                option.value = data.id;
                                option.textContent = data.name;
                                edit_food_categories.appendChild(option);
                                if (editSelectedCategories.length < 1) {
                                    edit_selected_categories.innerHTML = `<small>No Category Selected</small>`;
                                }
                            }
                        }
                    }
                );
                // Description field handler
                const edit_food_description_feedback = document.querySelector(
                    "#edit_food_description_feedback"
                );
                edit_food_description.value = "";
                edit_food_description.addEventListener("input", function () {
                    const val = this.value.trim();
                    if (!val) {
                        this.value = "";
                        return;
                    }
                    if (val.length > 30) {
                        edit_food_description_feedback.textContent =
                            "Characters must be lower than 50";
                        this.classList.add("is-invalid");
                    } else {
                        this.classList.remove("is-invalid");
                    }
                });
                // Validation All Required Input and Validate Image
                const inputs = document.querySelectorAll("input");
                inputs.forEach(function (input) {
                    input.addEventListener("input", function (e) {
                        if (e.target.type === "file") {
                            validation.checkFile(e.target.name);
                            return;
                        }
                        if (input.id === "edit_food_price") {
                            const val = formatter.formatRupiah(this.value);
                            input.value = val;
                            validation.run(input.id);
                            return;
                        }
                        validation.run(input.id);
                    });
                });
                // Form Submit
                const editFoodForm = document.querySelector("#editFoodForm");
                editFoodForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const checkValid = {
                        categories: false,
                        name: false,
                        price: false,
                    };
                    if (editSelectedCategories.length < 1) {
                        edit_food_categories.classList.add("is-invalid");
                        edit_food_categories_feedback.textContent =
                            "Please choose one category";
                    } else {
                        checkValid.categories = true;
                    }
                    checkValid.name = validation.run("edit_food_name");
                    checkValid.price = validation.run("edit_food_price");
                    if (
                        checkValid.categories &&
                        checkValid.name &&
                        checkValid.price
                    ) {
                        const payloadFood = new FormData(editFoodForm);
                        payloadFood.append("edit_food_id", params);
                        payloadFood.append(
                            "edit_food_price",
                            formatter.reverseRupiah(edit_food_price.value)
                        );
                        payloadFood.append(
                            "edit_food_categories",
                            editSelectedCategories
                        );
                        this.update(payloadFood);
                    }
                });
            }
        },
    },
};

export default food;
