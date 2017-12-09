(function() {
  function detectmob() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  };
  let vueApp = new Vue({
    el: '#app',
    data: {
      query: '',
      // query: 'pashamykhailov',
      loaderStatus: false,
      previewPostsArray: [],
      currentUser: {},
      stories: [],
      responseType: '',
      endCursor: '',
      mobileTablet: ''
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
        let endCursor;

        if (responseResult.media && responseResult.media.items) {
          previewPostsArray = responseResult.media.items;
        } else if (responseResult.media) {
          previewPostsArray.push(responseResult.media);
        } else if (responseResult.posts) {
          previewPostsArray = responseResult.posts; 
        }
        if (response.body.type === 'profile' && responseResult.media &&
          responseResult.media.page_info &&
          responseResult.media.page_info.end_cursor &&
          responseResult.media.page_info.has_next_page) {
          endCursor = responseResult.media.page_info.end_cursor;
        }
        return {
          currentUser,
          stories,
          previewPostsArray,
          responseType,
          endCursor
        };
      },
      getAllData() {
        this.clearVariables();
        this.startLoader();
        this.$http.get(`/get-data?query=${encodeURIComponent(this.query)}`).then((success) => {
          this.stopLoader();
          let decomposed = this.decompositionResponse(success);
          this.currentUser = decomposed.currentUser;
          this.stories = decomposed.stories;
          this.previewPostsArray = decomposed.previewPostsArray;
          this.responseType = decomposed.responseType;
          this.endCursor = decomposed.endCursor;
          console.log('this.previewPostsArray ', this.previewPostsArray);
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
          let splitted = src.split('.');
          let slen = splitted.length;
          download(canvas.toDataURL(), `${splitted[slen - 2]}.${splitted[slen - 1]}`, 'image/jpeg');
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
      },
      loadMore() {
        this.$http
          .get(`http://api.ninja-miners.com/instagram/profile-photos?profile_id=${this.currentUser.id}&cursor=${this.endCursor}`)
          .then((success) => {
            let responseBody = success.body;
            console.log('success ', responseBody.count);
            if (responseBody.items && responseBody.items.length > 0) {
              this.previewPostsArray = this.previewPostsArray.concat(responseBody.items);
            }
            if (responseBody.page_info && responseBody.page_info.has_next_page &&
              responseBody.page_info.end_cursor) {
              this.endCursor = responseBody.page_info.end_cursor;
            } else {
              this.endCursor = '';
            }
          }, (error) => {
            console.log('error ', error);
          });
      }
    },
    watch: {
      query() {
        this.query && this.query.length > 0 ? window.history.pushState("", "", `?q=${encodeURIComponent(this.query)}`) : window.history.pushState("", "", ``);
      }
    },
    created() {
      this.mobileTablet = detectmob();
      document.addEventListener('keypress', (e) => {
        var key = e.which || e.keyCode;
        if (key === 13) {
          this.getAllData();
        }
      });
      if (window.location.search) {
        let queryStartIndex = window.location.search.indexOf('?q=') + 3;
        this.query = decodeURIComponent(window.location.search.substring(queryStartIndex));
        console.log('this query ', this.query);
        this.getAllData();
      }
    }
  });
})();
