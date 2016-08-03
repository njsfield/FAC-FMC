const errorMessage= document.getElementById('error-message');
const errorBox = document.getElementById('error-box');
const errorHandler = function (error) {
  errorMessage.innerHTML = error;
  errorBox.removeAttribute('class', 'hidden');
  setTimeout(function(){
    errorBox.setAttribute('class', 'hidden');
  }, 5000);
};
