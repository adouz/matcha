<template>
  <div class="columns">
    <div class="column is-one-fifth">
      <div class="box">
        <!-- Menu  -->
        <center>
          <h5>Settings</h5>
        </center>
        <el-menu default-active="0">
          <el-menu-item index="0">
            <b-icon icon="user-alt"></b-icon>Profil
          </el-menu-item>

          <router-link class="link" to="account">
            <el-menu-item index="1">
              <b-icon icon="user-shield"></b-icon>Account
            </el-menu-item>
          </router-link>
          <router-link class="link" to="blocked">
            <el-menu-item index="2">
              <b-icon icon="eye-slash"></b-icon>Blocked
            </el-menu-item>
          </router-link>
        </el-menu>
        <!-- end -->
      </div>
    </div>
    <div class="column">
      <div class="box">
        <!-- Main -->
        <form @submit.prevent="UpdateProfil">
          <b-field
            :label-position="labelPosition"
            :type="Errors.uploadProfilImage.err"
            :message="Errors.uploadProfilImage.msg"
            label="Profil Image"
          >
            <el-upload
              action="#"
              class="upload-demo"
              list-type="picture-card"
              :on-change="AddProfilImage"
              :file-list="imageProfil"
              accept="image/jpeg, image/jpg, image/png"
              data-type="image"
              :auto-upload="false"
              :limit="1"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt>
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </b-field>

          <b-field
            label="Full Name"
            expanded
            :label-position="labelPosition"
            :type="Errors.fullname.err"
            :message="Errors.fullname.msg"
          >
            <b-input v-model="user.user_fullname" expanded></b-input>
          </b-field>
          <br>
          <b-field
            label="Choose your gender"
            :label-position="labelPosition"
            :type="Errors.gender.err"
            :message="Errors.gender.msg"
          ></b-field>
          <b-field grouped>
            <b-button
              size="10"
              rounded
              v-model="user.user_gender"
              :type="man"
              native-value="M"
              @click="manclicked()"
              icon-left="mars"
            >Man</b-button>
            <b-button
              size="10"
              rounded
              v-model="user.user_gender"
              :type="woman"
              native-value="F"
              @click="womanclicked()"
              icon-left="venus"
            >Woman</b-button>
          </b-field>
          <br>
          <b-field
            label="Choose your Tags"
            :label-position="labelPosition"
            :type="Errors.tags.err"
            :message="Errors.tags.msg"
          ></b-field>
          <vue-tags-input
            v-model="tag"
            :tags="tags"
            :autocomplete-items="filteredItems"
            @tags-changed="newTags => tags = newTags"
          />
          <br>
          <b-field
            label="Choose your sexual preference"
            :label-position="labelPosition"
            :type="Errors.sexualpreference.err"
            :message="Errors.sexualpreference.msg"
          ></b-field>
          <b-field grouped>
            <b-button
              size="10"
              icon-left="male"
              v-model="user.user_prefer"
              :type="men"
              native-value="M"
              @click="menclicked()"
              rounded
            >Men</b-button>
            <b-button
              size="10"
              icon-left="female"
              v-model="user.user_prefer"
              :type="women"
              native-value="F"
              @click="womenclicked()"
              rounded
            >Women</b-button>
            <b-button
              size="10"
              icon-left="user-secret"
              v-model="user.user_prefer"
              :type="other"
              native-value="X"
              @click="otherclicked()"
              rounded
            >Other</b-button>
          </b-field>
          <br>
          <b-field
            :label-position="labelPosition"
            :type="Errors.bio.err"
            :message="Errors.bio.msg"
            label="Bio"
          >
            <b-input v-model="user.user_bio" maxlength="200" type="textarea"></b-input>
          </b-field>

          <section>
            <b-field
              :type="Errors.uploadImages.err"
              :message="Errors.uploadImages.msg"
              label="Upload pictures (4 MAX)"
            ></b-field>

            <el-upload
              action="#"
              class="upload-demo"
              list-type="picture-card"
              :on-change="AddImage"
              :file-list="dropFiles"
              accept="image/jpeg, image/jpg, image/png"
              data-type="image"
              :auto-upload="false"
              :multiple="true"
              :limit="4"
              v-loading="loadingIMG"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt>
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </section>
          <!-- MAP-->
          <b-field
            :label-position="labelPosition"
            label="choose your location"
          ></b-field>
          <!-- <map-location-selector :latitude="32.8811" :longitude="-6.9063"
  @locationUpdated="locationUpdated">
          </map-location-selector>-->
          <gmap-map
            ref="gmap"
            :center="center"
            :zoom="12"
            style="width:100%;  height: 30vh;"
            @click="LocationUpdated"
          >
            <GmapMarker v-if="start" :position="start"/>
            <!-- <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="toggleInfoWindow(m,index)">
            </gmap-marker>-->
          </gmap-map>Your current location is :
          <strong>{{user.user_addresse}}</strong>
          <b-message v-if="err" type="is-danger">
            YOU HAVE AN ERROR PLEASE TRY AGAIN!
            <br>OR RELOAD PAGE!
          </b-message>
          <div class="level-right">
            <button v-loading="loadingFORM" type="submit" class="button is-success">Submit</button>
          </div>
        </form>
        <!-- End Main -->
      </div>
    </div>
  </div>
</template>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAlhMoDvlSEwV0Q87e2hNvmezSHxAksdu0&callback=initMap"
    async defer></script>

<script>
import axios from "axios";
import VueTagsInput from "@johmun/vue-tags-input";
axios.defaults.baseURL = "http://10.11.2.12:3000/";

export default {
  name: "UpdateProfil",
  components: {
    VueTagsInput
  },
  data() {
    return {
      start: null,
      center: { lat: 132.004, lng: -6.0011 },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      tag: "",
      tags: [],
      images: [],
      token: localStorage.getItem("token"),
      imageUrl: "",
      imageProfil: [],
      autocompleteItems: [],
      dropFiles: [],
      labelPosition: "on-border",
      err: false,
      confirm: false,
      men: "",
      women: "",
      other: "",
      man: "",
      woman: "",
      loadingIMG: true,
      loadingFORM: false,
      user_location: {
        user_addresse: "",
        longitude: "",
        latitude: ""
      },
      Errors: {
        fullname: {
          err: null,
          msg: null
        },
        tags: {
          err: null,
          msg: null
        },
        date: {
          err: null,
          msg: null
        },
        bio: {
          err: null,
          msg: null
        },
        sexualpreference: {
          err: null,
          msg: null
        },
        gender: {
          err: null,
          msg: null
        },
        dropFiles: {
          err: null,
          msg: null
        },
        uploadImages: {
          err: null,
          msg: null
        },
        uploadProfilImage: {
          err: null,
          msg: null
        }
      }
    };
  },
  beforeRouteLeave(to, from, next) {
    this.$store
      .dispatch("login", { user: this.user.user_name })
      .then(res => {
        var images = res.data.images;
        var profil;
        images.forEach(element => {
          if (element.image_type === "PROFIL") {
            profil = element;
          }
        });
        if (
          (!this.user.user_gender ||
          !this.user.user_bio ||
          !this.user.user_prefer ||
          !profil) && to.path !== "/logout"
        ) {
          this.$message({
            message: "Warning, you have to fill your profile first",
            type: "warning"
          });
        } else next();
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    console.log(this.user_images);
    this.$store
      .dispatch("login", { user: this.user.user_name })
      .then(res => {
        this.updateProfile();
      })
      .catch(err => {
        console.log(err);
      });
    this.loadingIMG = false;
  },
  mounted() {
    // console.log(this.user);
    // console.log(this.user_images);
    // console.log(this.user_tags);
    if (!localStorage.token) this.$router.push({ path: "/login" });
    else
      this.$http.defaults.headers.common["x-access-token"] = localStorage.token;
  },
  computed: {
    user: function() {
      return this.$store.getters.getUser;
    },
    user_images: function() {
      return this.$store.getters.getImages;
    },
    user_tags: function() {
      return this.$store.getters.getTags;
    },
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    },
    newTags() {
      return this.tags
        .map(cur => ({
          id: cur.tags_id,
          text: cur.text.toLowerCase()
        }))
        .filter(cur => !cur.id);
    },
    selectedTags() {
      return this.tags.map(cur => ({
        id: cur.tags_id,
        text: cur.text.toLowerCase()
      }));
    }
  },
  methods: {
    updateProfile() {
      if (this.user.user_gender == "M") this.man = "is-info";
      else if (this.user.user_gender == "F") this.woman = "is-danger";
      if (this.user.user_prefer == "M") this.men = "is-info";
      else if (this.user.user_prefer == "F") this.women = "is-danger";
      else if (this.user.user_prefer == "X") this.other = "is-warning";
      this.$http
        .get("/tags")
        .then(res => (this.autocompleteItems = res.data))
        .catch(err => console.log(err));
      this.tags = this.user_tags;
      console.log("before filling::: ", this.user_images);
      this.user_images.forEach((element, index) => {
        if (this.user_images[index].image_type != "PROFIL")
          this.dropFiles.push(this.user_images[index]);
        else this.imageProfil.push(this.user_images[index]);
      });
      this.center = { lat: this.user.latitude, lng: this.user.longitude };
      this.start = { lat: this.user.latitude, lng: this.user.longitude };
      this.user_location.user_addresse = this.user.user_addresse;
      this.user_location.latitude = this.user.latitude;
      this.user_location.longitude = this.user.longitude;
    },
    LocationUpdated(m) {
      this.start = m.latLng;
      this.geoCoder(m.latLng, res => {
        let addresse = "";
        if(res.address_components[res.address_components.length-4])
          addresse+= res.address_components[res.address_components.length-4].long_name+", ";
        if(res.address_components[res.address_components.length-1])
          addresse+= res.address_components[res.address_components.length-1].long_name;
        console.log("ADRESSE->", addresse,res);
        //this.user.user_addresse = addresse;
        this.user.user_addresse = res.formatted_address;
        this.user.longitude = res.geometry.location.lng();
        this.user.latitude = res.geometry.location.lat();
      });
    },
    geoCoder(latLng, callback) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, function(results, status) {
        if (status === "OK") {
          if (results[0]) callback(results[0]);
        }
      });
    },
    /*locationUpdated(latlng) {
      this.latitude = latlng.lat;
      this.longitude = latlng.lng;
      this.axios
      .get("https://api.opencagedata.com/geocode/v1/json?q="+this.latitude+this.longitude+"&key="+this.keygeorev)
      .then(res => (this.location = res.data))
      .catch(err => console.log(err));
  },*/
    getDataUrl(img) {
      // console.log(img);
      img.crossOrigin = "Anonymous";
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isIMG = file.type === "image/jpeg" || "image/jpg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isIMG) {
        this.$message.error("Avatar picture must be IMG format!");
      }
      if (!isLt2M) {
        this.$message.error("Avatar picture size can not exceed 2MB!");
      }
      return isIMG && isLt2M;
    },
    loadImage(url) {
      let image = new Image();
      return new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(image);
        };
        image.onerror = () => {
          reject(new Error("Invalid image"));
        };
        image.src = url;
      });
    },
    AddImage(file, dropFiles) {
      this.loadImage(dropFiles[dropFiles.length - 1].url)
        .then(() => {
          if (dropFiles[dropFiles.length - 1].size < 1000000) {
            this.dropFiles = dropFiles.slice(-4);
          } else {
            this.$message.error("Invalid image or size exceed 2MB!");
            this.dropFiles.splice(dropFiles.length - 1, 1);
          }
        })
        .catch(() => this.dropFiles.splice(dropFiles.length - 1, 1));
    },
    AddProfilImage(file, imageProfil) {
      this.loadImage(imageProfil[imageProfil.length - 1].url)
        .then(() => {
          // console.log(imageProfil[imageProfil.length - 1].size);
          if (imageProfil[imageProfil.length - 1].size < 1000000) {
            this.imageProfil = imageProfil.slice(-1);
          } else {
            this.$message.error("Invalid image or size exceed 2MB!");
            this.imageProfil.splice(imageProfil.length - 1, 1);
          }
        })
        .catch(() => this.imageProfil.splice(imageProfil.length - 1, 1));
    },
    handleRemove(file) {
      // console.log(file.uid);
      this.dropFiles.forEach((element, index) => {
        if (element.uid === file.uid) {
          // console.log(element.image_id);
          this.dropFiles.splice(index, 1);
          this.user_images.splice(index, 1);
          this.$http
            .post("/imagesdel/" , {
              image_id: element.image_id
            })
            .then(res => {
              res.data;
            })
            .catch(err => console.error(err));
        }
      });
      this.imageProfil.forEach((element, index) => {
        if (element.uid === file.uid) {
          // console.log(this.imageProfil[index]);
          this.imageProfil.splice(index, 1);
          this.user_images.splice(index, 1);
          this.$http
            .post("/imagesdel/" , {
              image_id: element.image_id
            })
            .then(res => {
              res.data;
              console.log("call REFRESH");
              this.$root.$emit("refreshAvatar");
              //window.location.reload()
            })
            .catch(err => console.error(err));
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      var fileURL = file.url;
      var fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", "Picture.png");
      document.body.appendChild(fileLink);
      fileLink.click();
      // console.log(file);
    },
    UpdateProfil() {
      if (this.validate()) {
        /* Add new tags to tags Table */
        if (this.newTags) {
          this.$http
            .post("tags/", {
              newtags: this.newTags,
              selectedtags: this.selectedTags,
              user_id: this.user.user_id
            })
            .then(res => res.data)
            .catch(err => console.log(err));
            console.log("newtags", this.newTags,
              "selectedtags :", this.selectedTags,
              "user_id :", this.user.user_id)
        }
        // console.log(this.user);
        var user_data = this.user;
        /* Update user */
        // console.log(this.user_location.latitude);
        this.$http
          .put("users/", {
            user_fullname: user_data.user_fullname,
            user_gender: user_data.user_gender,
            user_bio: user_data.user_bio,
            user_prefer: user_data.user_prefer,
            user_addresse: user_data.user_addresse,
            longitude: user_data.longitude,
            latitude: user_data.latitude
          })
          .then(res => {
            if (!res.data.success) {
              this.err = true;
            } else {
              this.confirm = true;
            }
            //this.$store.dispatch("update", user_data);
          })
          .catch(err => console.error(err));
        console.log(this.dropFiles.length, "+++ ", this.imageProfil);
        /* Upload images */
        if (this.dropFiles.length > 0 || this.imageProfil.length > 0) {
          const images = [];
          this.dropFiles.forEach(element => {
            let image = new Image();
            image.src = element.url;
            if (!element.image_type)
              images.push({ image: this.getDataUrl(image), type: "other" });
          });
          this.imageProfil.forEach(element => {
            let image = new Image();
            image.src = element.url;
            if (!element.image_type)
              images.push({ image: this.getDataUrl(image), type: "profil" });
          });
          console.log(images);
          console.log(this.user_images);
          if (images.length > 0) {
            this.loadingFORM = true;
            this.$http
              .post("/images", images)
              .then(res => {
                console.log(res.data.data);
                console.log("BEFORE", this.user_images);
                var data = res.data.data;
                // for (item in res.data)
                // {
                //     console.log(item);
                // }
                data.forEach(element => {
                  this.user_images.push(element);
                  console.log("element", element);
                  if (element.image_type === "profil") {
                    console.log("call REFRESH");
                    this.$root.$emit("refreshAvatar");
                    //window.location.reload()
                  }
                });
                // this.user_images.push(res.data);
                console.log("AFTER", this.user_images);
                this.loadingFORM = false;
              })
              .catch(err => console.error(err));
          }
        }
      }
    },
    menclicked() {
      this.men = "is-info";
      this.women = "";
      this.other = "";
      this.user.user_prefer = "M";
    },
    womenclicked() {
      this.women = "is-danger";
      this.men = "";
      this.other = "";
      this.user.user_prefer = "F";
    },
    otherclicked() {
      this.other = "is-warning";
      this.women = "";
      this.men = "";
      this.user.user_prefer = "X";
    },
    manclicked() {
      this.man = "is-info";
      this.woman = "";
      this.user.user_gender = "M";
    },
    womanclicked() {
      this.woman = "is-danger";
      this.man = "";
      this.user.user_gender = "F";
    },
    validate() {
      // console.log(this.user);
      if (
        !this.user.user_fullname.match(
          /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g
        ) ||
        this.user.user_fullname.length > 30 ||
        this.user.user_fullname.length < 5
      ) {
        // a-z A-Z  ' , . space -
        this.Errors.fullname.err = "is-danger";
        this.Errors.fullname.msg = "Please entre your real name";
        return false;
      } else {
        this.Errors.fullname.err = "is-success";
        this.Errors.fullname.msg = "";
      }

      if (
        !this.user.user_gender ||
        !this.user.user_gender.match(/^\b[FM]{1}\b/g)
      ) {
        this.Errors.gender.err = "is-danger";
        this.Errors.gender.msg = "Please choose a gender";
        return false;
      } else {
        this.Errors.gender.err = "is-success";
        this.Errors.gender.msg = "";
      }

      if (!this.user.user_prefer || !this.user.user_prefer.match(/^\b[MFX]{1}\b/g)) {
        this.Errors.sexualpreference.err = "is-danger";
        this.Errors.sexualpreference.msg = "Please choose a sexual preference";
        return false;
      } else {
        this.Errors.sexualpreference.err = "is-success";
        this.Errors.sexualpreference.msg = "";
      }
      if (this.imageProfil.length < 0) {
        this.Errors.uploadProfilImage.err = "is-danger";
        this.Errors.uploadProfilImage.msg = "Please upload a profil picture";
        return false;
      } else {
        this.Errors.uploadProfilImage.err = "is-success";
        this.Errors.uploadProfilImage.msg = "";
      }
      if (!this.user.user_bio ||!this.user.user_bio.match(/.*\S.*/)) {
        this.Errors.bio.err = "is-danger";
        this.Errors.bio.msg = "Please write something about you";
        return false;
      } else {
        this.Errors.bio.err = "is-success";
        this.Errors.bio.msg = "";
      }
      return true;
    }
  }
};
</script>
<style>
.link {
  color: rgb(0, 0, 0);
}
.link:hover {
  color: #00f;
}
.el-menu {
  border-right: none;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: red;
  background-color: rgb(243, 232, 232);
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>