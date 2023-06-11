import dinningtables from "../views/dinningtables.js";
import "../libs/simple-datatables/simple-datatables.js";
import routing from "../components/routing.js";

const dinningtable = {
    view: function (page) {
        switch (page) {
            case "index":
                return dinningtables;
            default:
                return dinningtables;
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
            dinningtableList: null,
            table: {
                headings: null,
                data: null,
            },
            loading: null,
        },
        index: async function () {
            this.data.loading = APP_LOADING.activate();
            this.data.dinningtableList = await this.getdinningtables();
            if (this.data.dinningtableList.status) {
                this.data.table.headings = [
                    "Id",
                    "Table Number",
                    "Status",
                    "Link QR Code",
                    "Action",
                ];
                this.data.table.data = [];
                for (
                    let i = 0;
                    i < this.data.dinningtableList.data.length;
                    i++
                ) {
                    this.data.table.data[i] = [];
                    this.data.table.data[i].push(
                        this.data.dinningtableList.data[i]["id"]
                    );
                    this.data.table.data[i].push(
                        this.data.dinningtableList.data[i]["number"]
                    );
                    this.data.table.data[i].push(
                        this.data.dinningtableList.data[i]["status"]
                    );
                    this.data.table.data[i].push(
                        this.data.dinningtableList.data[i]["id"]
                    );
                    this.data.table.data[i].push(
                        this.data.dinningtableList.data[i]["created_at"]
                    );
                }
                this.initFoodTable(this.data.table);
                APP_LOADING.cancel(this.data.loading);
                const inputs = document.querySelectorAll("input");
                inputs.forEach(function (input) {
                    input.addEventListener("input", function (e) {
                        e.target.classList.remove("is-invalid");
                    });
                });

                /*   ADD Dinning Table  */
                const addDinningTableModal = new bootstrap.Modal(
                    "#addDinningTableModal"
                );
                const addDinningTableModalDom = document.getElementById(
                    "addDinningTableModal"
                );
                addDinningTableModalDom.addEventListener(
                    "show.bs.modal",
                    (m) => {
                        inputs.forEach((i) => {
                            i.classList.remove("is-invalid");
                        });
                    }
                );
                const addDinningTableForm = document.querySelector(
                    "#addDinningTableForm"
                );

                addDinningTableForm.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const addFormData = new FormData(addDinningTableForm);
                    if (this.validate(addFormData)) {
                        TOAST.classList.remove("bg-primary");
                        TOAST.classList.remove("bg-danger");
                        this.data.loading = APP_LOADING.activate();
                        addDinningTableModal.hide();
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
                            routing.run("/admin/dinningtables");
                        }
                    }
                });
                /*   END ADD Dinning Table  */

                /*   DELETE DINNING TABLE  */
                const ConfirmDeleteModal = new bootstrap.Modal(
                    "#ConfirmDeleteModal"
                );
                const deleteConfirmForm =
                    document.querySelector("#deleteConfirmForm");
                deleteConfirmForm.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    TOAST.classList.remove("bg-primary");
                    TOAST.classList.remove("bg-danger");
                    ConfirmDeleteModal.hide();
                    this.data.loading = APP_LOADING.activate();
                    const deleteDinningTableForm = new FormData(e.target);
                    const deleted = await this.delete(deleteDinningTableForm);
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
                        routing.run("/admin/dinningtables");
                    }
                });
                /*   END DELETE DINNING TABLE  */

                /*   EDIT DINNING TABLE  */
                const editDinningTableModal = new bootstrap.Modal(
                    "#editDinningTableModal"
                );
                const editDinningTableForm = document.querySelector(
                    "#editDinningTableForm"
                );

                editDinningTableForm.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const editFormData = new FormData(editDinningTableForm);
                    const edit_food_status =
                        document.getElementsByName("edit_food_status");
                    const edit_food_status_feedback = document.querySelector(
                        "#edit_food_status_feedback"
                    );
                    let hasChecked = false;
                    edit_food_status.forEach((s) => {
                        s.addEventListener("change", () => {
                            edit_food_status_feedback.classList.add("d-none");
                        });
                        if (s.checked) {
                            hasChecked = true;
                        }
                    });
                    if (!hasChecked) {
                        edit_food_status_feedback.classList.remove("d-none");
                    }
                    if (this.validate(editFormData)) {
                        TOAST.classList.remove("bg-primary");
                        TOAST.classList.remove("bg-danger");
                        this.data.loading = APP_LOADING.activate();
                        editDinningTableModal.hide();

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
                            routing.run("/admin/dinningtables");
                        }
                    }
                });
                /*  END EDIT DINNING TABLE  */
            } else {
                APP_LOADING.cancel(this.data.loading);
                TOAST_BODY.textContent = this.dinningtableList.message;
                TOAST.classList.add("bg-danger");
                TOAST_APP.show();
            }
        },
        getdinningtables: function () {
            return fetch(`${APP_STATE.baseUrl}/api/admin/dinningtables/get`)
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    return res;
                });
        },
        initFoodTable: function (data) {
            const foodTables = document.querySelector("#foodTables");
            let firstInit = false;
            const FoodDataTables = new simpleDatatables.DataTable(foodTables, {
                data: data,
                columns: [
                    {
                        select: 0,
                        sortable: false,
                        hidden: true,
                    },
                    {
                        select: 1,
                        sortable: true,
                        hidden: false,
                    },
                    {
                        select: 2,
                        sortable: true,
                        render: function (data) {
                            return `<span class="badge rounded-pill ${
                                data == "UNAVALIABLE"
                                    ? "bg-danger"
                                    : "bg-primary"
                            }">${data}</span>`;
                        },
                    },
                    {
                        select: 3,
                        sortable: false,
                        render: function (data) {
                            return `<a href="${APP_STATE.baseUrl}/customer/order/${data}" class="btn btn-secondary btn-sm" target="_blank" >
                                    Open
                                    </a>
                                    <button type="button"  class="btn btn-success btn-sm printQrCode">Print</button>
                                    <div class="qrcodes mt-1" data-qr="${data}">
                                    </div>`;
                        },
                    },
                    {
                        select: 4,
                        sortable: false,
                        render: function () {
                            return `
                                <button type="button" class="btn btn-warning btn-sm editDinningTable" data-bs-toggle="modal" data-bs-target="#editDinningTableModal">Edit</button>
                                <button type="button"  class="btn btn-danger btn-sm deleteDinningTable" data-bs-toggle="modal" data-bs-target="#ConfirmDeleteModal"  >Delete</button>
                                `;
                        },
                    },
                ],
                perPage: 10,
                perPageSelect: [10, 20, 50],
            });
            FoodDataTables.on("datatable.init", () => {
                const thead = document.querySelector("#foodTables > thead");
                thead.classList.add("table-dark");
            });
            if (!firstInit) {
                const qrcodes = document.querySelectorAll(".qrcodes");
                qrcodes.forEach((q) => {
                    q.innerHTML = "";
                    new QRCode(q, {
                        text: `${
                            APP_STATE.baseUrl
                        }/customer/order/${q.getAttribute("data-qr")}`,
                        width: 100,
                        height: 100,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                    });
                });
                firstInit = true;
            }
            FoodDataTables.on("datatable.page", () => {
                const qrcodes = document.querySelectorAll(".qrcodes");
                qrcodes.forEach((q) => {
                    q.innerHTML = "";
                    new QRCode(q, {
                        text: `${
                            APP_STATE.baseUrl
                        }/customer/order/${q.getAttribute("data-qr")}`,
                        width: 100,
                        height: 100,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                    });
                });
            });
            foodTables.addEventListener("click", (e) => {
                if (e.target.classList.contains("editDinningTable")) {
                    const inputs = document.querySelectorAll("input");
                    inputs.forEach((i) => {
                        i.classList.remove("is-invalid");
                    });
                    const idx = e.target.parentNode.parentNode.dataIndex;
                    const data = this.data.table.data[idx];
                    const dinning_table_edit_id = document.querySelector(
                        "#dinning_table_edit_id"
                    );
                    const dinning_table_edit_number = document.querySelector(
                        "#dinning_table_edit_number"
                    );
                    const edit_food_status =
                        document.getElementsByName("edit_food_status");
                    dinning_table_edit_id.value = data[0];
                    dinning_table_edit_number.value = data[1];
                    edit_food_status.forEach((s) => {
                        if (s.value === data[2]) {
                            s.checked = true;
                            return;
                        }
                    });
                } else if (e.target.classList.contains("deleteDinningTable")) {
                    const idx = e.target.parentNode.parentNode.dataIndex;
                    const data = this.data.table.data[idx];
                    const delete_id = document.querySelector("#delete_id");
                    const modalBody = document.querySelector(
                        "#ConfirmDeleteModal .modal-body"
                    );
                    modalBody.innerHTML = `Do you want to remove Dinning Table <strong>#${data[1]}</strong> from Dinning Table List ?`;
                    delete_id.value = data[0];
                } else if (e.target.classList.contains("printQrCode")) {
                    const qrCode = e.target.nextElementSibling;
                    const img = qrCode.lastElementChild;
                    const src = img.getAttribute("src");
                    window.open(src);
                    const a = document.createElement("a");
                    a.href = src;
                    a.download = qrCode.getAttribute("data-qr");

                    a.click();
                    a.remove();
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
            return fetch(`${APP_STATE.baseUrl}/api/admin/dinningtables/save`, {
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
            return fetch(
                `${APP_STATE.baseUrl}/api/admin/dinningtables/delete`,
                {
                    method: "DELETE",
                    headers: {
                        accept: "application/json",
                        "Content-type": "application/json; charset=UTF-8",
                        "X-CSRF-TOKEN": APP_STATE.csrf,
                    },
                    credentials: "same-origin",
                    body: JSON.stringify(newPayload),
                }
            )
                .then((response) => response.json())
                .then((res) => {
                    return res;
                });
        },
        update: function (payload) {
            return fetch(
                `${APP_STATE.baseUrl}/api/admin/dinningtables/update`,
                {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                    },
                    credentials: "same-origin",
                    body: payload,
                }
            )
                .then((response) => response.json())
                .then((res) => {
                    return res;
                });
        },
    },
};

export default dinningtable;
