class Graph {
	constructor() {
		this.adjList = new Map();
	}

	addVertex(vertex) {
		this.adjList.set(vertex, []);
	}

	addEdge(vertex1, vertex2) {
		// console.log(vertex1);
		this.adjList.get(vertex1).push(vertex2);
	}
}

class Stavoklis {
	constructor(id = 0, fruitList = [], playerScore = 0) {
		this.id = id;
		this.fruitList = fruitList;
		this.playerScore = playerScore;
	}
}

const g = new Graph();
const zeroVertex = new Stavoklis(`A0`, ['apple', 'melone', 'banana']);
let father = Object.assign({}, zeroVertex);
let j = 1;
g.addVertex(father.id);
function nextMove(father, vertices) {
	if (vertices.length == 0) {
		return 0;
	}
	let currentMove = {};
	for (let i = 0; i < vertices.length; i++) {
		 if (father.fruitList == i) {
			continue;
		 }
		currentMove = Object.assign({},update(father, i, vertices, j));
		j++;
		// console.log(father);
		// console.log(currentMove);
		g.addVertex(currentMove.id);
		g.addEdge(father.id, currentMove.id);
		father = new Stavoklis(currentMove.id, currentMove.fruitList, currentMove.playerScore);
		nextMove(father, father.fruitList);
	}
	
}

function update(father, i, vertices, j) {
	let vertex = Object.assign({}, father);
	vertex.id = `A${j}`;
	vertex.fruitList = father.fruitList.slice();
	vertex.fruitList.splice(i,1);
	switch (vertices[i]) {
		case 'banana':
			vertex.playerScore += 17;
			break;
		case 'melone':
			vertex.playerScore += 25;
			break;
		case 'apple':
			vertex.playerScore += 20;
			break;
	}
	// vertex[fruitList].splice(0, 1);
	// console.log(vertex.fruitList);
	// console.log(father.fruitList);
	return vertex;
}

let fruits = father.fruitList.slice();
nextMove(father, fruits);
console.log(g.adjList);