(function () {
  // downloadButton.addEventListener('click', function () {
  //   if (input.value.trim() !== '') {
  //     loader.style.display = 'block';
  //     let XHR = new XMLHttpRequest();
  //     XHR.onload = (res) => {
  //       loader.style.display = 'none';
  //       save.style.display = 'block';
  //       console.log('res ', res);
  //       response = JSON.parse(res.currentTarget.response);
  //     };
  //     XHR.open("get", `/get-image?url=${input.value}`, true);
  //     XHR.send();
  //   }
  // });

  // save.addEventListener('click', function () {
  //   let link = document.createElement("a");
  //   link.setAttribute("href", response.result.image_url);
  //   link.setAttribute("download", 'ninja-copy');
  //   link.click();
  //   save.style.display = 'none';
  //   input.value = '';
  // });

  let vueApp = new Vue({
    el: '#app',
    data: {
      url: '',
      loaderStatus: false,
      previewImageArray: []

    },
    methods: {
      getAllPhotos() {
        this.loaderStatus = true;
        this.$http.get(`/get-image?url=${this.url}`).then((success) => {
          this.loaderStatus = false;
          let responseResult = success.body.result;
          if (responseResult.posts) {
            this.previewImageArray = this.previewImageArray.concat(responseResult.posts);
          } else if (responseResult.item) {
            this.previewImageArray.push(responseResult.item);
          }
        }, (error) => {
          console.log(error);
          this.loaderStatus = false;
        });
      }
    }
  });
})();