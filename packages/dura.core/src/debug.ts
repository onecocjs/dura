import { createStore } from "redux";
import { configure } from "./configure";

const _ = configure({});

const reduxStore = createStore(() => ({}), _);

const store = reduxStore.createAk({
  namespace: "xx",
  initialState: {
    user: {
      address: {
        city: {
          name: "",
        },
      },
    },
  },
});

store.getState().user.address.city.name;
