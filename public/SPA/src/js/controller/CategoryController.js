import categories from "../views/categories.js";
import "../libs/simple-datatables/simple-datatables.js";
import routing from "../components/routing.js";

const category = {
    view: function (page) {
        switch (page) {
            case "index":
                return categories;
            default:
                return categories;
        }
    },
    init: function (method, params = null) {
        TOAST.classList.remove("bg-success");
        switch (method) {
            case "index":
                this.method.index();
                break;
            default:
                this.method.index();
        }
    },
    method: {
        data: {
            categoryList: null,
            table: {
                headings: null,
                data: null,
            },
            loading: null,
            dom: {
                addCategoryModal: null,
                addCategoryForm: null,
                editCategoryModal: null,
                editCategoryForm: null,
                ConfirmDeleteModal: null,
                deleteConfirmForm: null,
                inputs: null,
            },
        },
        index: async function () {
            this.data.loading = APP_LOADING.activate();
            this.data.categoryList = await this.getCategories();
            if (this.data.categoryList.status) {
                this.data.table.headings = [
                    "Id",
                    "Slug",
                    "Name",
                    "Image",
                    "Action",
                ];
                this.data.table.data = [];
                for (let i = 0; i < this.data.categoryList.data.length; i++) {
                    this.data.table.data[i] = [];
                    this.data.table.data[i].push(
                        this.data.categoryList.data[i]["id"]
                    );
                    this.data.table.data[i].push(
                        this.data.categoryList.data[i]["slug"]
                    );
                    this.data.table.data[i].push(
                        this.data.categoryList.data[i]["name"]
                    );
                    this.data.table.data[i].push(
                        this.data.categoryList.data[i]["image"]
                    );
                    this.data.table.data[i].push(
                        this.data.categoryList.data[i]["created_at"]
                    );
                }
                this.initFoodTable(this.data.table);
                APP_LOADING.cancel(this.data.loading);
                this.data.dom.inputs = document.querySelectorAll("input");
                this.data.dom.inputs.forEach(function (input) {
                    input.addEventListener("input", function (e) {
                        e.target.classList.remove("is-invalid");
                    });
                });

                /*   ADD CATEGORY  */
                this.data.dom.addCategoryModal = new bootstrap.Modal(
                    "#addCategoryModal"
                );
                const addCategoryModal =
                    document.getElementById("addCategoryModal");
                addCategoryModal.addEventListener("show.bs.modal", (m) => {
                    this.data.dom.inputs.forEach((i) => {
                        i.classList.remove("is-invalid");
                    });
                });
                this.data.dom.addCategoryForm =
                    document.querySelector("#addCategoryForm");

                this.data.dom.addCategoryForm.addEventListener(
                    "submit",
                    async (e) => {
                        e.preventDefault();
                        const addFormData = new FormData(
                            this.data.dom.addCategoryForm
                        );
                        if (this.validate(addFormData)) {
                            TOAST.classList.remove("bg-primary");
                            TOAST.classList.remove("bg-danger");
                            this.data.loading = APP_LOADING.activate();
                            this.data.dom.addCategoryModal.hide();
                            const saved = await this.store(addFormData);
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
                                TOAST.classList.add("bg-primary");
                                TOAST_APP.show();
                                routing.run("/admin/category");
                            }
                        }
                    }
                );
                /*   END ADD CATEGORY  */

                /*   DELETE CATEGORY  */
                this.data.dom.ConfirmDeleteModal = new bootstrap.Modal(
                    "#ConfirmDeleteModal"
                );
                this.data.dom.deleteConfirmForm =
                    document.querySelector("#deleteConfirmForm");
                this.data.dom.deleteConfirmForm.addEventListener(
                    "submit",
                    async (e) => {
                        e.preventDefault();
                        TOAST.classList.remove("bg-primary");
                        TOAST.classList.remove("bg-danger");
                        this.data.dom.ConfirmDeleteModal.hide();
                        this.data.loading = APP_LOADING.activate();
                        const deleteCategoryForm = new FormData(e.target);
                        const deleted = await this.delete(deleteCategoryForm);
                        if (!deleted.status) {
                            APP_LOADING.cancel(this.data.loading);
                            TOAST.classList.add("bg-danger");
                            TOAST_BODY.textContent = deleted.message;
                            TOAST_APP.show();
                        } else {
                            APP_LOADING.cancel(this.data.loading);
                            TOAST_BODY.textContent = deleted.message;
                            TOAST.classList.add("bg-primary");
                            TOAST_APP.show();
                            routing.run("/admin/category");
                        }
                    }
                );
                /*   END DELETE CATEGORY  */

                /*   EDIT CATEGORY  */
                this.data.dom.editCategoryModal = new bootstrap.Modal(
                    "#editCategoryModal"
                );
                this.data.dom.editCategoryForm =
                    document.querySelector("#editCategoryForm");

                this.data.dom.editCategoryForm.addEventListener(
                    "submit",
                    async (e) => {
                        e.preventDefault();
                        const editFormData = new FormData(
                            this.data.dom.editCategoryForm
                        );
                        if (this.validate(editFormData)) {
                            TOAST.classList.remove("bg-primary");
                            TOAST.classList.remove("bg-danger");
                            this.data.loading = APP_LOADING.activate();
                            this.data.dom.editCategoryModal.hide();

                            const updated = await this.update(editFormData);
                            if (!updated.status) {
                                APP_LOADING.cancel(this.data.loading);
                                TOAST.classList.add("bg-danger");
                                const res = updated.data;
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
                                TOAST.classList.add("bg-primary");
                                TOAST_APP.show();
                                routing.run("/admin/category");
                            }
                        }
                    }
                );
                /*  END EDIT CATEGORY  */
            } else {
                APP_LOADING.cancel(this.data.loading);
                TOAST_BODY.textContent = this.categoryList.message;
                TOAST.classList.add("bg-danger");
                TOAST_APP.show();
            }
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
        initFoodTable: function (data) {
            const foodTables = document.querySelector("#foodTables");
            const FoodDataTables = new simpleDatatables.DataTable(foodTables, {
                data: data,
                columns: [
                    {
                        select: 3,
                        sortable: false,
                        render: function (data) {
                            return `<img src="${APP_STATE.assetUrl}images/categories/${data}" class="img-fluid mx-auto d-block" alt="food-categories" width="100">`;
                        },
                    },
                    {
                        select: 4,
                        sortable: false,
                        render: function () {
                            return `
                                <button type="button" class="btn btn-warning btn-sm editCategory" >Edit</button>
                                <button type="button"  class="btn btn-danger btn-sm deleteCategory" >Delete</button>
                                `;
                        },
                    },
                    {
                        select: 0,
                        sortable: false,
                        hidden: true,
                    },
                    {
                        select: 1,
                        sortable: false,
                        hidden: true,
                    },
                ],
                perPage: 4,
                perPageSelect: [4, 10, 20, 50],
            });
            FoodDataTables.on("datatable.init", () => {
                const thead = document.querySelector("#foodTables > thead");
                thead.classList.add("table-dark");
            });
            foodTables.addEventListener("click", (e) => {
                if (e.target.classList.contains("editCategory")) {
                    this.data.dom.inputs.forEach((i) => {
                        i.classList.remove("is-invalid");
                    });
                    const idx = e.target.parentNode.parentNode.dataIndex;
                    const data = this.data.table.data[idx];
                    const category_edit_id =
                        document.querySelector("#category_edit_id");
                    const category_edit_name = document.querySelector(
                        "#category_edit_name"
                    );
                    const current_category_edit_image = document.querySelector(
                        "#current_category_edit_image"
                    );
                    category_edit_id.value = data[0];
                    category_edit_name.value = data[2];
                    current_category_edit_image.setAttribute(
                        "src",
                        APP_STATE.assetUrl + "images/categories/" + data[3]
                    );
                    this.data.dom.editCategoryModal.show();
                } else if (e.target.classList.contains("deleteCategory")) {
                    const idx = e.target.parentNode.parentNode.dataIndex;
                    const data = this.data.table.data[idx];
                    const delete_id = document.querySelector("#delete_id");
                    const modalBody = document.querySelector(
                        "#ConfirmDeleteModal .modal-body"
                    );
                    modalBody.innerHTML = `Do you want to remove <strong>${data[2]}</strong> from Category List ?`;
                    delete_id.value = data[0];
                    this.data.dom.ConfirmDeleteModal.show();
                }
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
                if (!pair[1] && pair[1].name != "") {
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
            return fetch(`${APP_STATE.baseUrl}/api/admin/categories/save`, {
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
            return fetch(`${APP_STATE.baseUrl}/api/admin/categories/delete`, {
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
        update: function (payload) {
            return fetch(`${APP_STATE.baseUrl}/api/admin/categories/update`, {
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

export default category;
