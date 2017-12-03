(function () {
  let vueApp = new Vue({
    el: '#app',
    data: {
      query: '',
      // query: 'pashamykhailov',
      loaderStatus: false,
      previewPostsArray: [],
      privateAccount: false,
      currentUser: {},
      stories: []
    },
    methods: {
      getAllPhotos() {
        this.previewPostsArray = [];
        this.loaderStatus = true;
        this.$http.get(`/get-data?query=${this.query}`).then((success) => {
          this.loaderStatus = false;
          let responseResult = success.body.result;
          this.currentUser = responseResult.user;
          this.stories = responseResult.stories;
          this.previewPostsArray = responseResult.media.items;
          console.log(responseResult);
          console.log(this.previewPostsArray);

        }, (error) => {
          console.log(error);
          this.loaderStatus = false;
        });
      },
      downloadSinglePhoto(src) {
        let obj;
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext("2d");
        obj = new Image();
        obj.setAttribute('crossOrigin', 'anonymous');
        obj.setAttribute('src', src);
        obj.onload = () => {
          canvas.width = obj.width;
          canvas.height = obj.height;
          ctx.drawImage(obj, 0, 0);
          download(canvas.toDataURL(), 'ninja-copy', 'image/jpeg');
        };
      }
    }
  });
})();