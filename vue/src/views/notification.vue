<template>
<div class="opd">
  <div v-loading="notifLoading" class="box">
    <div class="box is-hidden-desktop" v-for="(notif, index) in notifi" :key="index" :style="notif.read ? 'background-color: rgb(238, 241, 250)' : ''">
        <el-badge is-dot v-if="notifi.read">
            <i class="el-icon-folder" style="font-size: 1.5em;"></i>
        </el-badge>
        <i class="el-icon-folder-opened" style="font-size: 1.5em;"></i>
        <span class="title is-5">&nbsp;&nbsp;{{notif.title}}</span>
        <br>
        <span class="subtitle is-6">{{notif.msg}}</span>
    </div>
    <div class="is-hidden-touch">
    <article class="message is-warning">
        <div class="message-header">
            <p>Sorry!</p>
        </div>
        <div class="message-body">
            you can't see this page because its only available for mobile users.<br>
            click the bell button on navbar to see your notification
        </div>
    </article>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      NewNotification: false,
      notifi: [],
      notifLoading: true
    };
  },
  sockets: function(data) {
      data.read = 1;
      //console.log('i got notification on notifcation.vue');
      //console.log(data);
      // Add data to the Beginning of notifi
      this.notifi.unshift(data);
      this.NewNotification = true;
  },
  mounted() {
    // get notification
    // after page render
    this.$nextTick(this.notification());
  },
  computed: {
    user: function() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    getNotification() {
      return new Promise((resolve, reject) => {
      //  console.log("send notification req!");
        this.$http
          .get("/notification")
          .then(res => {
            var data = res.data;
            resolve(data);
          })
          .catch(err => reject(err));
      });
    },
    SetAllNotification() {
      return new Promise((resolve, reject) => {
        this.$http
          .post("SetAllNotification/")
          .then(res => {
          //  console.log(res.data);
            resolve(res.data);
          })
          .catch(err => {
      //      console.log(err);
            reject(err);
          });
      });
    },
    notification() {
      this.notifLoading = true;
      this.NewNotification = false;
      // set all notification as read
      this.getNotification().then(
        data => {
          this.notifi = data;
          //console.log(data);
          this.$http
            .post("SetAllNotification/")
            .then(res => {
              res;
            //  console.log(res.data);
            })
            .catch(err => {
              console.log(err);
            });
          this.NewNotification = false;
          this.nbrNotification = 0;
          this.notifLoading = false;
        },
        err => console.log(err)
      );
    }
  }
};
</script>

<style>
@media screen and (min-width: 1268px)
{
.opd {
    padding-left: 20%;
    padding-right: 20%;
}
}
</style>
