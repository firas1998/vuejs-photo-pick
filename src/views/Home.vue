<template>
  <div class="home">
    <Header />
  </div>
</template>

<script lang="ts">
import Header from '@/components/Header.vue';
import { Component, Vue } from 'vue-property-decorator';
//import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    Header,
  },
})
export default class Home extends Vue {}
</script>
