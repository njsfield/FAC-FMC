var errorMessage= document.getElementById('error-message');
var errorBox = document.getElementById('error-box');
var errorHandler = function (error) {
  errorMessage.innerHTML = error;
  errorBox.removeAttribute('class', 'hidden');
  setTimeout(function(){
    errorBox.setAttribute('class', 'hidden');
  }, 5000);
};
