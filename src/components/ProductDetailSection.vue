<template>
  <v-container>
    <v-row no-gutters>
        <v-col>
          <v-card
            class=""
            tile
            style="cursor:pointer"
          >
            <div style="margin-bottom:5px; padding: 5px;font-size:20px;font-weight:500">
              <span>{{productData.description}}</span>
              <span style="float:right">Category: {{productData.category}}</span>
            </div>
            <v-img
            :src="productData.image"
            width="50%" style="border-radius:10px;margin: auto;"
            ></v-img>
            <v-col style="font-size: 20px; font-weight: bold">&#x20B9;{{productData.netPrice  }} <strike>{{  productData.price  }}</strike> <span style="color: green">({{ productData.discount}}% off)</span></v-col>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Products',
    data: () => ({
    }),
    props: {
      productData: []
    },
    methods: {
      
    }
  }
</script>
