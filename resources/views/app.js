const App = {
  init: function () {
    this.cartHandler();
  },
  data: {
    orders: [],
  },
  cartHandler: function () {
    const cart = document.querySelector("#cart");
    const notifCart = document.querySelector("#notifCart");
    const addFood = document.querySelectorAll(".addFood");
    addFood.forEach((a) => {
      a.addEventListener("click", (e) => {
        e.target.nextElementSibling.classList.remove("d-none");
        notifCart.classList.remove("d-none");
      });
    });
  },
};
App.init();
