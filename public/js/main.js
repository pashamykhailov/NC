(function () {
  let vueApp = new Vue({
    el: '#app',
    data: {
      query: '',
      // query: 'pashamykhailov',
      loaderStatus: false,
      previewPostsArray: [],
      currentUser: {},
      stories: [],
      responseType: ''
    },
    methods: {
      clearVariables() {
        this.previewPostsArray = [];
        this.stories = [];
        this.currentUser = {};
      },
      startLoader() {
        this.loaderStatus = true;
      },
      stopLoader() {
        this.loaderStatus = false;
      },
      decompositionResponse(response) {
        let responseResult = response.body.result;
        let currentUser = responseResult.user;
        let stories = responseResult.stories;
        let previewPostsArray = [];
        let responseType = response.body.type;

        if (responseResult.media.items) {
          previewPostsArray = responseResult.media.items;
        } else if (responseResult.media) {
          previewPostsArray.push(responseResult.media);
        }
        return {
          currentUser,
          stories,
          previewPostsArray,
          responseType
        }
      },
      getAllData() {
        this.clearVariables();
        this.startLoader();
        this.$http.get(`/get-data?query=${this.query}`).then((success) => {
          this.stopLoader();
          let decomposed = this.decompositionResponse(success);
          this.currentUser = decomposed.currentUser;
          this.stories = decomposed.stories;
          this.previewPostsArray = decomposed.previewPostsArray;
          this.responseType= decomposed.responseType;
        }, (error) => {
          console.log(error);
          this.stopLoader();
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
      },
      downloadProfileVideo(image) {
        this.$http.get(`http://api.ninja-miners.com/instagram/${image.code}`)
          .then((success) => {
          let createATag = document.createElement('a');
          createATag.href = success.body.result.media.source;
          createATag.download = '';
          createATag.click();
          }, (error) => {
          console.log('error ', error);
          });
      }
    },
    watch: {
      query() {
        this.query && this.query.length > 0 ? window.history.pushState("", "", `?q=${this.query}`) : window.history.pushState("", "", ``);
      }
    },
    created() {
      if (window.location.search) {
        let queryStartIndex = window.location.search.indexOf('?q=') + 3;
        this.query = window.location.search.substring(queryStartIndex);
        this.getAllData();
      }
    }
  });
})();