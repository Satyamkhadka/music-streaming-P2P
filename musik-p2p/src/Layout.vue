<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawerLeft" app clipped left>
      <v-list dense>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Open Temporary Drawer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="drawerRight" app clipped right>
      <v-list dense>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{peer.id}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-right clipped-left color="blue-grey" dark>
      <v-app-bar-nav-icon @click.stop="drawerLeft = !drawerLeft"></v-app-bar-nav-icon>
      <v-toolbar-title>{{appName +" :: "+ peer.id}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-col class="shrink">
            <v-btn dark color="orange darken-2" v-on:click="makeMeAServer">Make Me a Server</v-btn>
          </v-col>
          <v-col class="shrink">
            <v-btn dark color="orange darken-2" v-on:click="connectToServer">Make Me a Client</v-btn>
          </v-col>

          <v-col class="shrink">
            <v-btn dark color="orange darken-2" v-on:click="sendHiToServer">Send a Hello</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>

    <v-footer app color="blue-grey" class="white--text">
      <v-layout justify-center>
        <vuetify-audio :file="file" color="success" :ended="audioFinish" downloadable></vuetify-audio>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
// const axios = require("axios");
import Peer from "peerjs";
export default {
  props: {
    source: String,
  },
  components: {
    VuetifyAudio: () => import("vuetify-audio"),
  },
  data: () => ({
    drawerLeft: false,
    drawerRight: false,
    file: "http://www.hochmuth.com/mp3/Boccherini_Concerto_478-1.mp3",
    appName: process.env.VUE_APP_NAME,
    peer: { id: "loading.." },
    connection: null,
    server: true,
    text: null,
    snackbar: false,
    timeout: 2000,
  }),

  mounted() {
    // axios
    //   .get("https://api.coindesk.com/v1/bpi/currentprice.json")
    //   .then((response) => {
    //     this.info = response.data;
    //     console.log(this.info);
    //   });
  },

  methods: {
    audioFinish() {},
    connectToServer() {
      this.peer = new Peer();
      this.peer.on("open", (id) => {
        this.text = "Peer Id created ::::" + id;
        this.snackbar = true;
      });
      this.connection = this.peer.connect("terobaukotauko2");
      this.connection.on("open", () => {
        this.text = "Connection open";
        this.snackbar = true;
        this.connection.send("Initial:" + this.peer);
      });
    },
    makeMeAServer() {
      this.peer = new Peer("terobaukotauko2");
      this.peer.on("open", (id) => {
        this.text = "Awaiting Connections on id:: " + id;
        this.snackbar = true;
      });

      console.log(this.peer);
      this.peer.on("connection", (connection) => {
        console.log("reached at connectoin level");
        this.text = "Connection established";
        this.snackbar = true;
        this.connection = connection;
        this.connection.on("data", (data) => {
          // Will print 'hi!'
          this.text = data;
          this.snackbar = true;
          console.log(data);
        });
        this.connection.on("open", () => {
          this.connection.send("hello!");
        });
      });
    },
    sendHiToServer() {
      this.connection.on("open", () => {
        this.connection.send("hello!");
      });
    },
  },
};
</script>


