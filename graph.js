class Graph {
	constructor() {
	  this.adjList = new Map();
	}
  
	addVertex(vertex) {
	  this.adjList.set(vertex, []);
	}
  
	addEdge(vertex1, vertex2) {
	  this.adjList.get(vertex1).push(vertex2);
	}
  }

class Stavoklis {
	constructor(id = 0, fruitList = [], aiScore = 0, playerScore = 0, moveChoice = '', move = '') {
	  this.id = id;
	  this.fruitList = fruitList;
	  this.aiScore = aiScore;
	  this.playerScore = playerScore;
	  this.moveChoice = moveChoice;
	  this.move = move;
	  this.link = '';
	}
	setLink(link) {
		this.link = link;
	}
}
class Board {
	constructor(graph, father, j) {
	  this.graph = graph;
	  this.father = father;
	  this.j = j;
	  this.graph.addVertex(this.father.id);
	}

	generateGraph() {
		let stack = [[this.father]];
		let list = [];
		list.push(this.father);
		let moveArray = [];
		let id = this.father.id;
		let lengthOfDepth = 0;
		this.father.fruitList.forEach((element) => {
			if(element != null) {
				lengthOfDepth++;
			}
		});
		lengthOfDepth = lengthOfDepth < 5 ? lengthOfDepth : 5;
		for (let k = 0; k < lengthOfDepth; k++) {
			let parentElements = [];
			stack.forEach(option => {
				option.forEach(value => {
					parentElements.push(value);
				});
			});
			const length = parentElements.length;
			const stackLength = stack.length;
			
			for (let i = 0; i < length; i++) {
				moveArray = this.generateMove(parentElements[i].fruitList.slice(),
					this.j, parentElements[i].aiScore, parentElements[i].playerScore , parentElements[i])
				;
				this.j = moveArray[1];
				moveArray = moveArray[0].slice();
				stack.push(moveArray);
			}
			for (let i = 0; i < stackLength; i++) {
				stack.splice(0, 1);
			}
			stack.forEach(element => {
				element.forEach(elem => {
					list.push(elem);
				});
			});
			// console.log(stack);
			for (let i = 0; i < parentElements.length; i++) {
				id = parentElements[i].id;
				stack[i].forEach(child => {
					this.graph.addVertex(child.id);
					this.graph.addEdge(id, child.id);
				});
			}
		}
		return list;
	}

	generateMove(fruits, j, aiScore, playerScore, parentElement) {
		let result = [];
		let fruitsFull = fruits.slice();
		let length = fruits.length;
		let score = 0;
		let aiMove = parentElement.moveChoice;
		let checkWatermelonMove = parentElement.link.move;
		if (aiMove == 'ai') {
			score = aiScore;
		}
		else {
			score = playerScore;
		}
		let previousScore = score;
		for (let i = 0; i < length; i++) {
			j++;
			let chosenFruit = fruits.splice(i, 1)[0];
			if (chosenFruit == null) {
				j--;
				score = previousScore;
				fruits = fruitsFull.slice();
				continue;
			}

			if (chosenFruit == 'banana' || chosenFruit == 'apple' || chosenFruit == 'watermelon') {
				if (checkWatermelonMove == 'watermelon' && (this.hasPears(fruits) || this.hasOranges(fruits))) {
					j--;
					score = previousScore;
					fruits = fruitsFull.slice();
					continue;
				}
				else if (checkWatermelonMove == 'watermelon') {
					if (chosenFruit == 'banana') {
						score = (score + this.findScore(chosenFruit)/ 2) * 0.9;
					}
					else {
						score = (score + this.findScore(chosenFruit)/ 2);
					}
				}
				else if (chosenFruit == 'watermelon') {
					score = score + this.findScore(chosenFruit);
				}
				else if (chosenFruit == 'banana') {
					score = (score + this.findScore(chosenFruit)) * 0.9;
				}
				else {
					score = score + this.findScore(chosenFruit);
				}
			}
			else {
				if (chosenFruit == 'pear') {
					score = (score + this.findScore(chosenFruit)) * 1.2;
				}
				else {
					score = score + this.findScore(chosenFruit);
				}
			}
			if (aiMove == 'ai') {
				result.push(new Stavoklis(`A${j}`, fruits, score, playerScore, 'player', chosenFruit));
				result[result.length - 1].setLink(parentElement);
				score = previousScore;
				fruits = fruitsFull.slice();
			}
			else {
				result.push(new Stavoklis(`A${j}`, fruits, aiScore, score, 'ai', chosenFruit));
				result[result.length - 1].setLink(parentElement);
				score = previousScore;
				fruits = fruitsFull.slice();
			}
		}
		return [result.slice(), j];
	}

	findScore(fruit) {
		switch (fruit) {
			case 'banana':
				return 17;
			case 'watermelon':
				return 25;
			case 'apple':
				return 20;
			case 'pear':
				return 12;
			case 'orange':
				return 15;
			default:
				return 0;
		}
	}

	checkRulesForWatermelon(fruit, parentFruit) {
		if (parentFruit == 'watermelon') {
			switch (fruit) {
				case 'banana':
					return false;
				case 'watermelon':
					return false;
				case 'apple':
					return false;
				default:
					return true;
				}
		}
		return true;
	}

	hasPears(fruits) {
		if (fruits.includes('pear')) {
			return true;
		}
		return false;
	}

	hasOranges(fruits) {
		if (fruits.includes('orange')) {
			return true;
		}
		return false;
	}
}
  
