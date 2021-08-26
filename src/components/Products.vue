<template>
  <v-container>
    <v-row no-gutters>
        <v-col v-for="(product, index) in pageOfItems" :key="index" cols="12" sm="4" style="padding:10px" v-show="product.isSearched == false">
          <v-card class="pa-2" tile style="cursor:pointer">
            <div style="margin-bottom:5px; padding: 5px">
              <span style="font-size:20px;font-weight:500"  @click="navigateToProduct(product)">{{product.name}}</span>
              <v-icon style="float: right" @click="deleteProduct(product._id)">mdi-delete </v-icon>
            </div>
            <v-img  @click="navigateToProduct(product)"
            :src="product.image"
            width="300" height="300" style="border-radius:10px"
            ></v-img>
          </v-card>
        </v-col>
      </v-row>
      <div style="text-align: center;margin-top: 10px;">
        <jw-pagination :pageSize=3 :items="productData" @changePage="onChangePage"></jw-pagination>
      </div>
  </v-container>
</template>

<script>
  export default {
    name: 'Products',
    data: () => ({
      pageOfItems: []
    }),
    props: {
      productData: {
        type: Array
      }
    },
    methods: {
      navigateToProduct(data){
        let id= data._id;
          this.$router.push({
            name: 'ProductDetail',
            params: {id: id}
          })
      },
      deleteProduct(id) {
        this.$root.$emit('deleteProduct', id);
      },
      onChangePage(pageOfItems) {
          this.pageOfItems = pageOfItems;
      }
    }
  }
</script>
