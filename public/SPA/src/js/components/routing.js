import home from "../views/home.js";
import category from "../controller/CategoryController.js";
import food from "../controller/FoodController.js";
import dinningtable from "../controller/DinningTableController.js";
import order from "../controller/OrderController.js";
import formatter from "./utility/formatter.js";
const app = document.querySelector("#app");
const routing = {
    pages: {
        "/admin": {
            title: "Aplikasi Kasir Kafe",
            render: home,
            controller: async () => {
                const loading = APP_LOADING.activate();
                const dayPendapatan = document.querySelector("#dayPendapatan");
                const dailyPayment = await fetch(
                    `${APP_STATE.baseUrl}/api/admin/order/paymentdaily`
                )
                    .then((response) => {
                        return response.json();
                    })
                    .then((res) => {
                        return res;
                    });
                if (dailyPayment.status && dailyPayment.data.dailypayment) {
                    dayPendapatan.textContent = formatter.formatRupiah(
                        dailyPayment.data.dailypayment
                    );
                } else {
                    dayPendapatan.textContent = "Data masih nol";
                }
                const monthPendapatan =
                    document.querySelector("#monthPendapatan");
                const total = await fetch(
                    `${APP_STATE.baseUrl}/api/admin/order/paymentmonthly`
                )
                    .then((response) => {
                        return response.json();
                    })
                    .then((res) => {
                        return res;
                    });
                if (total.data.monthlypayment) {
                    monthPendapatan.textContent = formatter.formatRupiah(
                        total.data.monthlypayment
                    );
                } else {
                    monthPendapatan.textContent = "Data masih nol";
                }
                APP_LOADING.cancel(loading);
            },
        },
        "/admin/category": {
            title: "Aplikasi Kasir Kafe - Category",
            render: category.view("index"),
            controller: () => {
                return category.init("index");
            },
        },
        "/admin/food": {
            title: "Aplikasi Kasir Kafe - Food",
            render: food.view("index"),
            controller: function () {
                return food.init("index");
            },
        },
        "/admin/food/add": {
            title: "Aplikasi Kasir Kafe - Add Food",
            render: food.view("create"),
            controller: function () {
                return food.init("create");
            },
        },
        "/admin/food/:id/edit": {
            title: "Aplikasi Kasir Kafe - Edit Food",
            render: food.view("edit"),
            controller: function (params) {
                return food.init("edit", params);
            },
        },
        "/admin/dinningtables": {
            title: "Aplikasi Kasir Kafe - Dinning Table",
            render: dinningtable.view("index"),
            controller: function () {
                return dinningtable.init("index");
            },
        },
        "/admin/order": {
            title: "Aplikasi Kasir Kafe - Order",
            render: order.view("index"),
            controller: function () {
                return order.init("index");
            },
        },
        "/admin/order/add": {
            title: "Aplikasi Kasir Kafe - Create New Order",
            render: order.view("create"),
            controller: function () {
                return order.init("create");
            },
        },
        "/admin/order/:id/edit": {
            title: "Aplikasi Kasir Kafe - Edit Order",
            render: order.view("edit"),
            controller: function (params) {
                return order.init("edit", params);
            },
        },
    },
    run: function (path) {
        const navLinks = document.querySelectorAll(".nav-link");
        const currUrl = window.location.pathname.split("/").pop();
        navLinks.forEach((e) => {
            e.classList.remove("active");
            if (e.classList.contains(currUrl)) {
                e.classList.add("active");
            }
        });
        const url = [];
        Object.keys(this.pages).forEach(function (key, index) {
            url.push(key);
        });
        let routeParams = null;
        const matchedRoute = url.find((route) => {
            const routeArr = route.split("/").slice(1);
            const routePathSegments = path.split("/").slice(1);
            if (routePathSegments.length !== routeArr.length) {
                return false;
            }
            const match = routeArr.every((routePathSegment, i) => {
                return (
                    routePathSegment === routePathSegments[i] ||
                    routePathSegment[0] === ":"
                );
            });
            if (match) {
                routeArr.forEach((segment, i) => {
                    if (segment[0] === ":") {
                        routeParams = decodeURIComponent(routePathSegments[i]);
                    }
                });
            }
            return match;
        });
        let route = this.pages[matchedRoute];

        if (route) {
            document.title = route.title;
            app.innerHTML = routeParams
                ? route.render(routeParams)
                : route.render();
            routeParams ? route.controller(routeParams) : route.controller();
        } else {
            history.replaceState("", "", "/admin");
            this.run("/admin");
        }
    },
};

export default routing;
