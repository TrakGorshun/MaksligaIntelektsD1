class Game {
	constructor(firstPlayerMove, gameWindow) {
		this.firstPlayerMove = firstPlayerMove;
		this.gameWindow = gameWindow;
		this.makeInterface();
	}

	makeInterface() {
		menu[1].style.display = "none";
		this.gameWindow.style.display = 'block';
		let fruits = ['apple', 'watermelon', 'orange', 'banana', 'pear'];

		let fruitList = this.makeFruits(fruits);
		this.gameWindow.style.width = '1400px';
		this.gameWindow.style.height = '900px';
		this.gameWindow.style.zIndex = 1;
		for (let i = 0; i < fruitList.length; i++) {
			const image = document.createElement('img');
			image.src = 'images/' + fruitList[i].image;
			image.id = 'fruit';
			image.style.width = '120px';
			image.style.height = '80px';
			image.style.marginLeft = '10px';
			image.style.marginRight = '10px';
			image.style.position = 'absolute';
			image.style.top = '3px';
			image.style.left = i * 135 + 'px';
			image.style.zIndex = 2;
			this.gameWindow.appendChild(image);
		}
		for(let i = 0; i < 2; i++) {
			const image = document.createElement('img');
			image.src = "images/groza.png";
			image.id = "groza";
			image.style.position = 'relative';
			image.style.width = '600px';
			image.style.height = '450px';
			image.style.marginRight = '100px';
			image.style.top = '380px';
			image.style.zIndex = 1;
			this.gameWindow.appendChild(image);
		}

		const images = this.gameWindow.querySelectorAll('#fruit');
		const grozas = this.gameWindow.querySelectorAll('#groza');
		let fruitMovement = new FruitMovement(images, grozas);

		const playerScoreTable = this.gameWindow.querySelectorAll('#player_score');
		
		playerScoreTable[0].innerHTML = 'Datora punkti: 0';
		playerScoreTable[1].innerHTML = 'Spēlētaja punkti: 0';

		this.startGame(fruitMovement, playerScoreTable, fruitList);
	}

	async startGame (fruitMovement, playerScoreTable, fruitList) {
		let self = this;
		let move = this.firstPlayerMove;
		let win = '';
		let rightMove = false;
		let playerScore = 0;
		let aiScore = 0;
		let player = '';
		let aiChoice = null;
		let playerPreviousSrc = '';
		let aiWatermelonMove = false;
			for (let i = 0; i < 10; i++) {
				if (move == 'player') {
					await new Promise((resolve, reject) => {
						let myinterval = setInterval (function () {
							if (typeof fruitMovement.currentFruit != 'undefined') {
								clearInterval(myinterval);
								resolve();
							}
						}, 500);
					}).then(function () {
						let src = 
							fruitMovement.currentFruit.src.substring
							(fruitMovement.currentFruit.src.lastIndexOf('/') + 1)
						;
						let indexOfChosenFruit = 
								Array.prototype.indexOf.call(fruitMovement.fruits, fruitMovement.currentFruit)
						;
						if (fruitMovement.currentFruit.style.visibility == 'visible') {
							rightMove = false;
						}
						else if (src == 'bumbieris.png') {
							playerScore += Move.countPoints(src);
							playerScore = Number((playerScore * 1.2).toFixed(1));
							rightMove = true;
						}
						else if (!self.checkWatermelonRules(playerPreviousSrc, src) && 
								(self.countOranges(fruitMovement) > 0 || self.countPears(fruitMovement) > 0)) {
								rightMove = false;
						}
						else if (!self.checkWatermelonRules(playerPreviousSrc, src) &&
								self.countOranges(fruitMovement) == 0 && self.countPears(fruitMovement) == 0) {

							playerScore += Number((Move.countPoints(src) / 2).toFixed(1));
							if (src == 'banana.png') {
								playerScore = Number((playerScore * 0.9).toFixed(1));
							}
							rightMove = true;
						}
						else {
							playerScore += Move.countPoints(src);
							if (src == 'banana.png') {
								playerScore = Number((playerScore * 0.9).toFixed(1));
							}
							rightMove = true;
						}

						if (rightMove) {
							playerScoreTable[1].innerHTML = `Spēlētaja punkti: ${playerScore}`;
							fruitMovement.currentFruit = undefined;
							playerPreviousSrc = src;
							fruitList[indexOfChosenFruit].fruit = null;
							move = 'ai';
						}
						else {
							fruitMovement.placeInBeginning();
							fruitMovement.currentFruit = undefined;
							i--;
						}
					});
				}
				else {
					let boardChoices= [];
					fruitList.forEach(element => {
						boardChoices.push(element.fruit);
					});
					const g = new Graph();
					const zeroVertex = new Stavoklis(`A0`, boardChoices, aiScore, playerScore, 'ai');
					// const zeroVertex = new Stavoklis(`A0`, [ 'watermelon', 'pear', 'banana',  ], aiScore, playerScore, 'ai');
					let j = 0;
					if (aiWatermelonMove) {
						zeroVertex.setLink(aiChoice);
					}
					const board = new Board(g, zeroVertex, j);
					let list = board.generateGraph();
					const minimaxMove = new Ai(board.graph, list);
					minimaxMove.minimax('A0', 0, true);
					
					const bestMove = minimaxMove.answer;
					aiChoice = minimaxMove.list.find(fruit => fruit.id == bestMove);
					const aiMove = aiChoice.move;
					aiScore = aiChoice.aiScore;
					
					if (aiMove == 'watermelon') {
						aiWatermelonMove = true;
					}

					fruitList[zeroVertex.fruitList.indexOf(aiMove)].fruit = null;

					fruitMovement.currentFruit = fruitMovement.fruits[zeroVertex.fruitList.indexOf(aiMove)];
					fruitMovement.currentFruit.style.left = '240px';
					fruitMovement.currentFruit.style.top = '640px';
					await new Promise(resolve => {
						let interval = setInterval(() => {
							clearInterval(interval);
							resolve();
						}, 3000);
					}).then(
						function() {
							fruitMovement.currentFruit.style.visibility = 'hidden';
							fruitMovement.currentFruit = undefined;
						});
						aiScore = Number((aiScore).toFixed(1));
						playerScoreTable[0].innerHTML = `Datora punkti: ${aiScore}`;
						move = 'player';
				}
		}
		win = aiScore > playerScore ? 'Dators' : `Jūs`;
		const notification = this.gameWindow.querySelector('#mygameWindow_notification');
		const newText = document.createElement('p');
		newText.textContent = `${win} uzvarēja! Vai vēlaties atkārtot spēle?`;
		notification.insertBefore(newText, notification.firstChild);
		newText.style.margin = '3px';
		notification.style.display = 'block';
		// this.buttonWasClicked = false;
		let notificationBtns = notification.querySelectorAll('button');

		function waitForButtonClick(callback) {
			notificationBtns[0].addEventListener('click', callback);
			notificationBtns[1].addEventListener('click', callback);
		}
		let restartGameClicked = false;
		let endGame = false;

		await new Promise((resolve) => {
			let myinterval = setInterval (function () {
				waitForButtonClick(function (event) {
					if (event.target.textContent == 'ja') {
						restartGameClicked = true;
					}
					else {
						endGame = true;
					}
				});
				if (restartGameClicked || endGame) {
					clearInterval(myinterval);
					resolve();
				}
			}, 500);
		});
		if (restartGameClicked) {
			fruitMovement.fruits.forEach(element => {
				element.remove();
			});
			fruitMovement.grozas.forEach(element => {
				element.remove();
			});
			const elementToRemove = notification.querySelector('p');
			notification.removeChild(elementToRemove);
			notification.style.display = 'none';
			playerScoreTable[0].innerHTML = `Datora punkti: 0`;
			playerScoreTable[1].innerHTML = `Spēlētaja punkti: 0`;

			const game = new Game(this.firstPlayerMove, this.gameWindow);
		}
		else {
			notification.style.display = 'none';
		}
	}

	countOranges(fruitMovement) {
		let quantity = 0;
		fruitMovement.fruits.forEach(element => {
			let src = element.src.substring
			(element.src.lastIndexOf('/') + 1);
			if (src == 'orange.png' && element.style.visibility != 'hidden') {
				quantity++;
			}
		});
		return quantity;
	}

	countPears(fruitMovement) {
		let quantity = 0;
		fruitMovement.fruits.forEach(element => {
			let src = element.src.substring
			(element.src.lastIndexOf('/') + 1);
			if (src == 'bumbieris.png' && element.style.visibility != 'hidden') {
				quantity++;
			}
		});
		return quantity;
	}

	checkWatermelonRules(playerPreviousSrc, src) {
		if (playerPreviousSrc == 'melone.png') {
			if (src == 'melone.png' || src == 'abols.png' || src == 'banana.png') {
				return false;
			}
		}
		return true;
	}

	makeFruits(fruits) {
		let array = [];
		for (let i = 0; i < 10; i++) {
			let randomIndex = Math.floor(Math.random() * fruits.length);
			let obj = {};
			obj['fruit'] = fruits[randomIndex];
			obj['image'] = this.findImage(fruits[randomIndex]);
			array[i] = obj;
		}
		return array;
	}

	findImage(fruit) {
		let src = '';

		switch(fruit) {
			case "apple":
				src = 'abols.png';
				break;
			case "orange":
				src = 'orange.png';
				break;
			case "pear":
				src = 'bumbieris.png';
				break;
			case "watermelon":
				src = 'melone.png';
				break;
			case "banana":
				src = 'banana.png';
				break;
		}
		return src;
	}
}