import categories from "../views/categories.js";
import "../libs/simple-datatables/simple-datatables.js";
import validation from "../components/utility/validation.js";
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
        switch (method) {
            case "index":
                this.method.index();
                break;
            default:
                this.method.index();
        }
        // loadCategories();
        // let loading = APP_LOADING.activate();
        // let FoodDataTables = null;
        // let Foods = {
        //     headings: ["Id", "Slug", "Name", "Image", "Action"],
        //     data: [],
        // };
        // const toastAlert = document.querySelector("#toastAlert");
        // const toastBody = document.querySelector("#toastAlert .toast-body");
        // const toast = new bootstrap.Toast(toastAlert);
        // const delete_id = document.querySelector(
        //     "#deleteConfirmModal #delete_id"
        // );
        // const deleteConfirmModal = new bootstrap.Modal("#deleteConfirmModal");
        // const deleteCategoryForm = document.querySelector(
        //     "#deleteConfirmModal #deleteCategoryForm"
        // );
        // const deleteConfirmModalBody = document.querySelector(
        //     "#deleteConfirmModal .modal-body"
        // );
        // const editCategoryModal = new bootstrap.Modal("#editCategoryModal");
        // const editCategoryForm = document.querySelector(
        //     "#editCategoryModal #editCategoryForm"
        // );
        // const edit_id = document.querySelector(
        //     "#editCategoryModal #editCategoryForm #edit_id"
        // );
        // // Get Categories
        // function loadCategories() {
        //     fetch(`${baseUrl}/api/admin/categories/get`)
        //         .then((response) => {
        //             return response.json();
        //         })
        //         .then((res) => {
        //             if (res.status === "success") {
        //                 for (let i = 0; i < res.data.length; i++) {
        //                     Foods.data[i] = [];
        //                     Foods.data[i].push(res.data[i]["id"]);
        //                     Foods.data[i].push(res.data[i]["slug"]);
        //                     Foods.data[i].push(res.data[i]["name"]);
        //                     Foods.data[i].push(res.data[i]["image"]);
        //                     Foods.data[i].push(res.data[i]["created_at"]);
        //                 }
        //                 initFoodTable();
        //                 APP_LOADING.cancel(loading);
        //                 return;
        //             }
        //             initFoodTable();
        //             throw new Error(res.message);
        //         })
        //         .catch(console.error);
        // }
        // function initFoodTable() {
        //     const foodTables = document.querySelector("#foodTables");
        //     FoodDataTables = new simpleDatatables.DataTable(foodTables, {
        //         data: Foods,
        //         columns: [
        //             {
        //                 select: 3,
        //                 sortable: false,
        //                 render: function (data) {
        //                     return `<img src="${assetUrl}images/categories/${data}" class="img-fluid mx-auto d-block" alt="food-categories" width="100">`;
        //                 },
        //             },
        //             {
        //                 select: 4,
        //                 sortable: false,
        //                 render: function (data, cell, row) {
        //                     return `
        //                         <button type="button" class="btn btn-warning btn-sm editCategory" >Edit</button>
        //                         <button type="button"  class="btn btn-danger btn-sm deleteCategory" >Delete</button>
        //                         `;
        //                 },
        //             },
        //             {
        //                 select: 0,
        //                 sortable: false,
        //                 hidden: true,
        //             },
        //             {
        //                 select: 1,
        //                 sortable: false,
        //                 hidden: true,
        //             },
        //         ],
        //         perPage: 4,
        //         perPageSelect: [4, 10, 20, 50],
        //     });
        //     FoodDataTables.on("datatable.init", function () {
        //         const thead = document.querySelector("#foodTables > thead");
        //         thead.classList.add("table-dark");
        //     });
        // }
        // foodTables.addEventListener("click", function (e) {
        //     if (e.target.classList.contains("deleteCategory")) {
        //         const data =
        //             FoodDataTables.data[
        //                 e.target.parentNode.parentNode.dataIndex
        //             ];
        //         const deleteCategory = {
        //             id: data.childNodes[0].data,
        //             name: data.childNodes[2].data,
        //         };
        //         delete_id.value = deleteCategory.id;
        //         deleteConfirmModalBody.innerHTML = `Do you want to Delete <strong>${deleteCategory.name}</strong> from Category List ?`;
        //         deleteConfirmModal.show();
        //     } else if (e.target.classList.contains("editCategory")) {
        //         const data =
        //             FoodDataTables.data[
        //                 e.target.parentNode.parentNode.dataIndex
        //             ];
        //         const editCategory = {
        //             id: data.childNodes[0].data,
        //             name: data.childNodes[2].data,
        //             imgSrc: data.childNodes[3].childNodes[0].currentSrc,
        //         };
        //         editCategoryForm.reset();
        //         edit_id.value = editCategory.id;
        //         document.querySelector("#category_edit_name").value =
        //             editCategory.name;
        //         document
        //             .querySelector("#current_category_edit_image")
        //             .setAttribute("src", editCategory.imgSrc);
        //         validation.run("category_edit_name");
        //         editCategoryModal.show();
        //     }
        // });
        // deleteCategoryForm.addEventListener("submit", function (e) {
        //     e.preventDefault();
        //     loading = APP_LOADING.activate();
        //     const payloadDeleteCategory = {
        //         _token: csrf,
        //         _method: "DELETE",
        //         delete_id: document
        //             .getElementsByName("delete_id")[0]
        //             .getAttribute("value"),
        //     };
        //     fetch(`${baseUrl}/api/admin/categories/delete`, {
        //         method: "DELETE",
        //         headers: {
        //             accept: "application/json",
        //             "Content-type": "application/json; charset=UTF-8",
        //             "X-CSRF-TOKEN": csrf,
        //         },
        //         credentials: "same-origin",
        //         body: JSON.stringify(payloadDeleteCategory),
        //     })
        //         .then((response) => response.json())
        //         .then((res) => {
        //             if (res.status === "failed") {
        //                 deleteConfirmModal.hide();
        //                 deleteCategoryForm.reset();
        //                 APP_LOADING.cancel(loading);
        //                 toastAlert.classList.add("bg-danger");
        //                 toastBody.textContent = res.message;
        //                 toast.show();
        //                 return;
        //             } else if (res.status === "success") {
        //                 FoodDataTables.destroy();
        //                 FoodDataTables = null;
        //                 Foods.data = [];
        //                 deleteConfirmModal.hide();
        //                 loadCategories();
        //                 toastAlert.classList.add("bg-success");
        //                 toastBody.textContent = res.message;
        //                 toast.show();
        //                 return;
        //             }
        //         })
        //         .catch((err) => {
        //             console.error;
        //         });
        // });
        // // Update Category
        // editCategoryForm.addEventListener("submit", (e) => {
        //     e.preventDefault();
        //     if (validation.run("category_edit_name")) {
        //         const payloadEditCategory = new FormData(editCategoryForm);
        //         loading = APP_LOADING.activate();
        //         fetch(`${baseUrl}/api/admin/categories/update`, {
        //             method: "POST",
        //             headers: {
        //                 accept: "application/json",
        //             },
        //             credentials: "same-origin",
        //             body: payloadEditCategory,
        //         })
        //             .then((response) => response.json())
        //             .then((res) => {
        //                 if (res.status === "failed") {
        //                     APP_LOADING.cancel(loading);
        //                     if (res.errors) {
        //                         Object.keys(res.errors).forEach(
        //                             (key, index) => {
        //                                 const elemInput =
        //                                     document.getElementById(key);
        //                                 const elemFeedBack =
        //                                     document.getElementById(
        //                                         key + "_feedback"
        //                                     );
        //                                 if (elemInput && elemFeedBack) {
        //                                     elemInput.classList.add(
        //                                         "is-invalid"
        //                                     );
        //                                     elemFeedBack.textContent =
        //                                         res.errors[key][0];
        //                                 }
        //                             }
        //                         );
        //                         return;
        //                     }
        //                     editCategoryModal.hide();
        //                     editCategoryForm.reset();
        //                     toastAlert.classList.add("bg-danger");
        //                     toastBody.textContent = res.message;
        //                     toast.show();
        //                     return;
        //                 } else if (res.status === "success") {
        //                     editCategoryModal.hide();
        //                     editCategoryForm.reset();
        //                     APP_LOADING.cancel(loading);
        //                     FoodDataTables.destroy();
        //                     FoodDataTables = null;
        //                     Foods.data = [];
        //                     loadCategories();
        //                     toastAlert.classList.add("bg-warning");
        //                     toastBody.textContent = res.message;
        //                     toast.show();
        //                 }
        //             })
        //             .catch((err) => console.error);
        //     }
        // });
        // // Save Category
        // const addCategoryModal = new bootstrap.Modal("#addCategoryModal");
        // const addCategoryForm = document.querySelector(
        //     "#addCategoryModal #addCategoryForm"
        // );
        // const inputs = document.querySelectorAll("input");
        // inputs.forEach(function (input) {
        //     input.addEventListener("input", function (e) {
        //         if (e.target.type === "file") {
        //             validation.checkFile(e.target.name);
        //             return;
        //         }
        //         validation.run(input.id);
        //         return;
        //     });
        // });
        // addCategoryForm.addEventListener("submit", (e) => {
        //     e.preventDefault();
        //     if (validation.run("category_name")) {
        //         const payloadCategory = new FormData(addCategoryForm);
        //         loading = APP_LOADING.activate();
        //         fetch(`${baseUrl}/api/admin/categories/save`, {
        //             method: "POST",
        //             headers: {
        //                 accept: "application/json",
        //             },
        //             credentials: "same-origin",
        //             body: payloadCategory,
        //         })
        //             .then((response) => response.json())
        //             .then((res) => {
        //                 if (res.status === "failed") {
        //                     APP_LOADING.cancel(loading);
        //                     if (res.errors) {
        //                         Object.keys(res.errors).forEach(
        //                             (key, index) => {
        //                                 const elemInput =
        //                                     document.getElementById(key);
        //                                 const elemFeedBack =
        //                                     document.getElementById(
        //                                         key + "_feedback"
        //                                     );
        //                                 if (elemInput && elemFeedBack) {
        //                                     elemInput.classList.add(
        //                                         "is-invalid"
        //                                     );
        //                                     elemFeedBack.textContent =
        //                                         res.errors[key][0];
        //                                 }
        //                             }
        //                         );
        //                         return;
        //                     }
        //                     addCategoryModal.hide();
        //                     addCategoryForm.reset();
        //                     toastAlert.classList.add("bg-danger");
        //                     toastBody.textContent = res.message;
        //                     toast.show();
        //                 } else if (res.status === "created") {
        //                     addCategoryModal.hide();
        //                     addCategoryForm.reset();
        //                     APP_LOADING.cancel(loading);
        //                     FoodDataTables.destroy();
        //                     FoodDataTables = null;
        //                     Foods.data = [];
        //                     loadCategories();
        //                     toastAlert.classList.add("bg-primary");
        //                     toastBody.textContent = res.message;
        //                     toast.show();
        //                 }
        //             })
        //             .catch((err) => console.error);
        //     }
        // });
    },
    method: {
        data: {
            categoryList: null,
            table: {
                headings: null,
                data: null,
            },
            loading: null,
        },
        index: async function () {
            this.data.loading = APP_LOADING.activate();
            this.data.categoryList = await this.getCategories();
            APP_LOADING.cancel(this.data.loading);
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
            } else {
                TOAST_BODY.textContent = this.data.categoryList.message;
                TOAST.classList.add("bg-danger");
                TOAST_APP.show();
            }
            // window.addEventListener("click", (e) => {
            //     if (e.target.classList.contains("editCategory")) {
            //         this.showEditDialog(e.target);
            //         return;
            //     }
            // });
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
                const editCategory = document.querySelectorAll(".editCategory");
                editCategory.forEach((e) => {
                    e.addEventListener("click", () => {
                        category.method.showEditDialog(e);
                    });
                });
            });
        },
        validate: function (formData) {
            // for (let f of formData.values()) {
            //     if (f.type &&  && f.size > 100000) {
            //         if(f.type != "image/jpg"){
            //             return false
            //         }
            //     } else {

            //     }
            // }
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
        showEditDialog: function (elem) {
            const idx = elem.parentNode.parentNode.dataIndex;
            const data = this.data.table.data[idx];
            const editCategoryModal = new bootstrap.Modal("#editCategoryModal");

            const editCategoryForm =
                document.querySelector("#editCategoryForm");
            const category_edit_id =
                document.querySelector("#category_edit_id");
            const category_edit_name = document.querySelector(
                "#category_edit_name"
            );
            const category_edit_image = document.querySelector(
                "#category_edit_image"
            );
            const current_category_edit_image = document.querySelector(
                "#current_category_edit_image"
            );

            const inputs = document.querySelectorAll("input");
            inputs.forEach(function (input) {
                input.addEventListener("input", function (e) {
                    e.target.classList.remove("is-invalid");
                });
            });
            category_edit_id.value = data[0];
            category_edit_name.value = data[2];
            current_category_edit_image.setAttribute(
                "src",
                APP_STATE.assetUrl + "images/categories/" + data[3]
            );
            editCategoryModal.show();
            editCategoryForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const editFormData = new FormData(editCategoryForm);
                // if (this.validate(editFormData)) {
                this.data.loading = APP_LOADING.activate();
                editCategoryModal.hide();

                const updated = await this.update(editFormData);
                if (updated.status === false) {
                    APP_LOADING.cancel(this.data.loading);
                    const res = updated.data;
                    if (res.errors) {
                        TOAST_BODY.innerHTML = "";
                        TOAST.classList.remove("bg-danger");
                        const ul = document.createElement("ul");
                        Object.keys(res.errors).forEach((key) => {
                            const li = document.createElement("li");
                            li.textContent = res.errors[key][0];
                            ul.appendChild(li);
                        });
                        TOAST_BODY.appendChild(ul);
                        TOAST.classList.add("bg-danger");
                        TOAST_APP.show();
                    }
                }

                // }
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
            //             .then((res) => {
            //                 if (res.status === "failed") {
            //                     APP_LOADING.cancel(loading);
            //                     if (res.errors) {
            //                         Object.keys(res.errors).forEach(
            //                             (key, index) => {
            //                                 const elemInput =
            //                                     document.getElementById(key);
            //                                 const elemFeedBack =
            //                                     document.getElementById(
            //                                         key + "_feedback"
            //                                     );
            //                                 if (elemInput && elemFeedBack) {
            //                                     elemInput.classList.add(
            //                                         "is-invalid"
            //                                     );
            //                                     elemFeedBack.textContent =
            //                                         res.errors[key][0];
            //                                 }
            //                             }
            //                         );
            //                         return;
            //                     }
        },
    },
};

export default category;
