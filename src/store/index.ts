import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    authenticated: false
  },
  mutations: {
    setAuthenticatedTrue: (state) => {
      state.authenticated = true;
    },
    setAuthenticatedFalse: (state) => {
      console.log('set uathenticated false');
      state.authenticated = false;
    }
  },
  actions: {
  },
  modules: {
  }
})
