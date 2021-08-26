<template>
  <v-app id="inspire">
    <v-app-bar app color="green" dark>
      <v-app-bar-nav-icon />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Products Page</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="scroll-y" fluid>
        <v-row align="center" justify="center">
          <v-col cols="8" md="8">
            <v-card class="ml-5 mr-5">
              <v-app-bar dark color="#2C3A47">
                <v-btn icon @click="goBack">
                  <v-icon>mdi-arrow-left-bold</v-icon>
                </v-btn>
                <v-toolbar-title>{{productData.name}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="800px">
                  <template v-slot:activator="{ on }">
                      <v-btn color="red" v-on="on" outlined="">
                        Edit
                      </v-btn>
                  </template>
                    <v-card>
                      <v-form @submit.prevent="updateProduct(productData)" ref="postData" lazy-validation enctype="multipart/form-data" autocomplete="off">
                        <v-card-title>
                          <span class="headline">Add Product Information</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-layout wrap>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Name"  v-model="productData.name" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Category" v-model="productData.category" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <img :src="productData.image" v-if="productData.image" width="100px"/>
                                <v-file-input accept="image/*" :src="productData.image" @change="selectImage" label="Upload Image"></v-file-input>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Price" v-model="productData.price" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Discount" v-model="productData.discount" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Net Price" v-model="productData.netPrice" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="description" v-model="productData.description" color="#2C3A47"></v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="#2C3A47" dark @click="close" outlined small>
                            <v-icon left>exit_to_app</v-icon> Close
                          </v-btn>
                          <v-btn color="light-green darken-4" dark type="submit" outlined small @click="updateProduct">
                            <v-icon left>save</v-icon> Save
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card>
                </v-dialog>
              </v-app-bar>

              <ProductDetailSection :productData="productData"/>

            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import axios from "axios";
import ProductDetailSection from '../components/ProductDetailSection'
export default {
  name: 'ProductDetail',
  components: {
    ProductDetailSection
  },
  data: () => ({
    mini: false,
    dialog:false,
    fab: false,
    search:'',
    snackbar: false,
    text:'',
    color:'',
    posts:[],
    postData: {
      name: '',
      category: '',
      image: '',
      price: '',
      discount: '',
      netPrice: '',
      description:''
    },
    editedIndex: -1,
    productData: [],
    files: [],
    isError: false,
    errorText: null
  }),
  mounted() {
    this.getProductById();
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    goBack() {
        this.$router.push({name:'Home'})
    },
    selectImage(file) {
        window.console.log(file);
        this.files = [];
        this.uploadFileToCloudinary(file).then((fileResponse) => {
          this.files.push(fileResponse);
        });
    },
    uploadFileToCloudinary(file) {
      return new Promise(function (resolve, reject) {
        const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dybgqeo3n/upload';
        const CLOUDINARY_UPLOAD_PRESET = 'e8ufw3dc';
        let formData = new FormData();
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'cloudinary-demo');
        formData.append('file', file);
        let request = new XMLHttpRequest();
        request.open('POST', CLOUDINARY_URL, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.onreadystatechange = () => {
          // File uploaded successfully
          if (request.readyState === 4 && request.status === 200) {
            let response = JSON.parse(request.responseText);
            resolve(response);
          }
          // Not successfull
          if (request.status !== 200) {
            let response = JSON.parse(request.responseText);
            let error = response.error.message;
            this.errorText = 'error uploading files ' + error;
            this.isError = true;
            reject(error);
          }
        };
        request.onerror = (err) => {
          alert('error: ' + err);
          reject(err);
        };
        request.send(formData);
      });
    },
    getProductById(){
      let apiURL = `http://localhost:4000/product/${this.$route.params.id}`;
      axios.get(apiURL).then(res => {
        this.productData = res.data.productData;
      }).catch(error => {
        console.log(error)
      });
    },
    close(){
      this.dialog = false
      setTimeout(()=>{
        this.postData = Object.assign({}, this.default)
        this.editedIndex = -1
      }, 300)
    },
    editPost(item) {
      this.editedIndex = this.posts.indexOf(item)
      this.postData = Object.assign({}, item)
      this.dialog = true
    },
    updateProduct(){
      let id = this.productData._id;
      if(this.files && this.files[0] && this.files[0].url){
        this.productData.image = this.files[0].url
      }
      let apiURL = `http://localhost:4000/product/${id}`;
      axios.post(apiURL, this.productData).then(() => {
        this.close();
        this.getProductById();
      }).catch(error => {
        console.log(error)
        console.log(this.$route.params.id)
      })
    },
    logout() {
      localStorage.removeItem("jwt");
      this.$router.push({name: 'LoginPage'})
    }
  }
}
</script>