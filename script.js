let menu = document.getElementsByClassName('menu');
let menuRules = document.getElementsByClassName('menu__rules');
let btns = document.querySelectorAll('#menu__start button');
let choice = document.querySelectorAll('#menu__choice button');
let btnGoBack = document.getElementsByClassName('goback');
let gameWindow = document.querySelector('#mygameWindow');
let notification = gameWindow.querySelector('#mygameWindow_notification');
menu[0].style.display = "block";

btns[0].addEventListener('click', (event) => {
	menu[0].style.display = "none";
	menu[1].style.display = "block";
});

btns[1].addEventListener('click', (event) => {
	menu[0].style.display = "none";
	menuRules[0].style.display = "block";
});

btnGoBack[0].addEventListener('click', (event) => {
	menuRules[0].style.display = "none";
	menu[0].style.display = "block";
});

btnGoBack[1].addEventListener('click', (event) => {
	menu[1].style.display = "none";
	menu[0].style.display = "block";
});

let firstMove = '';

choice[0].addEventListener('click', (event) => {
	firstMove = 'ai';
	let game = new Game(firstMove, gameWindow);
});
choice[1].addEventListener('click', (event) => {
	firstMove = 'player';
	let game = new Game(firstMove, gameWindow);
});

