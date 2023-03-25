let buttonClicked = false;

let myButton = document.getElementById('myButton');

function waitForButtonClick(callback) {
	document.getElementById('myButton').addEventListener("click", callback);
}
  
  waitForButtonClick(function(event) {
	alert("Кнопка " + event.target.id + " нажата");
  });