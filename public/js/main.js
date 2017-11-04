(function () {
  let downloadButton = document.getElementById('download');
  let input = document.getElementById('input');
  let save = document.getElementById('save');
  let loader = document.getElementsByClassName('loader')[0];
  let response;

  downloadButton.addEventListener('click', function () {
    if (input.value.trim() !== '') {
      loader.style.display = 'block';
      let XHR = new XMLHttpRequest();
      XHR.onload = (res) => {
        loader.style.display = 'none';
        save.style.display = 'block';
        console.log('res ', res);
        response = JSON.parse(res.currentTarget.response);
      };
      XHR.open("get", `/get-image?url=${input.value}`, true);
      XHR.send();
    }
  });

  save.addEventListener('click', function () {
    let link = document.createElement("a");
    link.setAttribute("href", response.result.image_url);
    link.setAttribute("download", 'ninja-copy');
    link.click();
    save.style.display = 'none';
    input.value = '';
  });
})();