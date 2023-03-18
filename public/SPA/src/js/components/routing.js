import home from "../views/home.js";
import category from "../controller/CategoryController.js";
// import food from "../controller/FoodController.js";

const app = document.querySelector("#app");
const routing = {
    pages: {
        "/admin": {
            title: "Aplikasi Kasir Kafe",
            render: home,
            controller: () => {
                return null;
            },
        },
        "/admin/category": {
            title: "Aplikasi Kasir Kafe - Category",
            render: category.view("index"),
            controller: () => {
                return category.init("index");
            },
        },
        // "/admin/foods": {
        //     title: "Aplikasi Kasir Kafe - Foods",
        //     render: food.view("index"),
        //     controller: function () {
        //         return food.init("index");
        //     },
        // },
        // "/admin/food/add": {
        //     title: "Aplikasi Kasir Kafe - Add Food",
        //     render: food.view("create"),
        //     controller: function () {
        //         return food.init("create");
        //     },
        // },
        // "/admin/food/:id/edit": {
        //     title: "Aplikasi Kasir Kafe - Food",
        //     render: food.view("edit"),
        //     controller: function (params = null) {
        //         return food.init("edit", params);
        //     },
        // },
    },
    run: function (path) {
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
