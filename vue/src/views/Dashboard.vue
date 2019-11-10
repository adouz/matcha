<template>
  <div class="columns">
    <div class="column is-one-quarter">
      <div class="box">
        <!-- Menu  -->
       <center><h5>Settings</h5></center>
    <el-menu
      default-active="0">
      <el-menu-item index="0">
        <i class="el-icon-user-solid"></i>
        <router-link class="link" to='profil'>Connections</router-link>
      </el-menu-item>
      <el-menu-item index="1" >
        <i class="el-icon-s-tools"></i>
      <router-link class="link" to='account'>You like</router-link>
      </el-menu-item>
      <el-menu-item index="2" >
        <i class="el-icon-view"></i>
          <router-link class="link" to='visite'>Who likes you ?</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-grape"></i>
          <router-link class="link" to='mutuallikes'>Mutual likes</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-view"></i>
          <router-link class="link" to='guests'>Guests</router-link>
      </el-menu-item>
        </el-menu>
        <!-- end -->
      </div>
    </div>
    <div class="column">
      <div class="box">
        <!-- Main -->

  <el-carousel :interval="5000" arrow="always">
    <el-carousel-item v-for="item in 4" :key="item">
      <!--<h3>{{ item }}</h3>
    <img class="img"  :style="like" src="../assets/like.png">
    <img class="img"  src="../assets/nope.png">-->
     
    </el-carousel-item>
  </el-carousel><div class="user-info">
      <p>Username, Age<br> Bio</p>        
      </div>
  <br>
 <center> 
      <el-button class="el-carousel-buttons" type="success" icon="custom-icon el-icon-check" @click="likeclicked()" circle></el-button>
  <el-button class="el-carousel-buttons" type="danger" icon="custom-icon el-icon-close" circle></el-button></center>
        <!-- End Main -->
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

axios.defaults.baseURL = "http://10.11.2.12:3000/";

export default {
  name: "UpdateProfil",
  data() {
    return {
      like: "display : none;"}
  },
  mounted() {
  },
  methods: {
    likeclicked() {
      this.like = "display : block;";
    }
  }
};
</script>
<style>

.link {
  color: rgb(0, 0, 0);
}
.link:hover {
   color: #00F;
}
.el-menu {
    border-right: none;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 500px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .el-carousel__container {
    position: relative;
    height: 500px;
}
/*.el-carousel-buttons {
  z-index: 5;
  position: relative;
  width: 75px;
  height: 75px;
  color:#fff;
  bottom:100px;
}*/
.custom-icon {
   font-size: 2rem;
}
.img{
  z-index: 3;
  position: relative;
  width: 30%;
  height: 30%;
  bottom:500px;
}
</style>