<template>
  <v-app id="inspire">
    <v-app-bar app color="green" dark>
      <v-app-bar-nav-icon @click.stop="mini = !mini" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Products</span>
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
                <v-btn icon>
                  <v-icon>local_offer</v-icon>
                </v-btn>
                <v-toolbar-title>Products</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-container style="width: 66%;text-align: center;height: 35px;padding: 0">
                  <input type="text" v-model="searchText" @keypress.enter="searchProducts" 
                  placeholder="Search product by name" 
                  style="width: 300px;background-color: white; text-align: center;height:100%"/>
                </v-container>
                <v-dialog v-model="dialog" persistent max-width="800px">
                  <template v-slot:activator="{ on }">
                      <v-btn color="red" v-on="on" outlined="">
                        <v-icon left>add</v-icon> Add Product
                      </v-btn>
                  </template>
                    <v-card>
                      <v-form @submit.prevent="createProduct" ref="postData" lazy-validation enctype="multipart/form-data" autocomplete="off">
                        <v-card-title>
                          <span class="headline">Add Product Information</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-layout wrap>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Name"  v-model="postData.name" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Category" v-model="postData.category" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-file-input accept="image/*" @change="selectImage" label="Upload Image"></v-file-input>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Price" v-model="postData.price" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Discount" v-model="postData.discount" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="Net Price" v-model="postData.netPrice" color="#2C3A47"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm12 md12>
                                <v-text-field label="description" v-model="postData.description" color="#2C3A47"></v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="#2C3A47" dark @click="close" outlined small>
                            <v-icon left>exit_to_app</v-icon> Close
                          </v-btn>
                          <v-btn color="light-green darken-4" dark type="submit" outlined small @clicl="createProduct">
                            <v-icon left>save</v-icon> Save
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card>
                </v-dialog>
              </v-app-bar>
              <Products :productData="productData.productData"/>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import axios from "axios";
import Products from '../components/Products'
export default {
  components: {
    Products
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
    errorText: null,
    searchText: '',
    isSearched: false
  }),
  mounted() {
    this.getProducts();
    this.$root.$on('deleteProduct', (id) =>{
      this.deleteProduct(id)
    })
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    searchProducts() {
        this.productData.productData.forEach(data => {
          data.isSearched = false;
        })
        if(this.searchText != ''){
          var input, filter, text, i, txtValue;
          input = this.searchText;
          filter = input.toUpperCase();
          for (i = 0; i < this.productData.productData.length; i++) {
            text = this.productData.productData[i].name.toUpperCase();
            txtValue = text || '';
            if(txtValue.includes(filter) == false){
              this.productData.productData[i].isSearched = true;
            }
          }
        } else {
            this.productData.productData.forEach(data => {
              data.isSearched = false;
            })
        }
    },
    selectImage(file) {
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
    getProducts(){
      let apiURL = 'http://localhost:4000/product';
      axios.get(apiURL).then(res => {
        res.data.productData.map(item => {
          item['isSearched'] = false;
        })
        this.productData = res.data;
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
    createProduct(){
      this.postData.image = this.files[0].url;
      this.createCategory();
      let apiURL = 'http://localhost:4000/product';
        axios.post(apiURL, this.postData).then(() => {
          this.postData = {
            name: '',
            category: '',
            image: '',
            price: '',
            discount: '',
            netPrice: '',
            description: '',
          }
          this.close();
          this.getProducts();
        }).catch(error => {
          console.log(error)
        });
    },
    createCategory() {
        let apiURL = 'http://localhost:4000/category';
        axios.post(apiURL, this.postData).then(() => {
        }).catch(error => {
          console.log(error)
        });
    },
    editPost(item) {
      this.editedIndex = this.posts.indexOf(item)
      this.postData = Object.assign({}, item)
      this.dialog = true
    },
    logout() {
      localStorage.removeItem("jwt");
      this.$router.push({name: 'LoginPage'})
    },
    deleteProduct(id) {
        let apiURL = `http://localhost:4000/product/${id}`;
        axios.delete(apiURL).then(() => {
        this.getProducts();
      }).catch(error => {
        console.log(error)
      });
    },
  }
}
</script>