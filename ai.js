class Ai {
	constructor(graph, list) {
		this.graph = graph;
		this.list = list;
		this.scoreMin = Infinity;
		this.scoreMax = -Infinity;
	}

	minimax(element, depth, isMaxPlayer) {
		
		if (depth == 5 || (this.graph.adjList.get(element).length == 0)) {
			const currentStavoklis = this.list.find(stavoklis => stavoklis.id == element);
			let heuristicVal =  currentStavoklis.aiScore - currentStavoklis.playerScore;
			return heuristicVal;
		}
		if (isMaxPlayer) {
			let maxScore = -Infinity;
			let numberOfChoises = this.graph.adjList.get(element).length;
			for (let i = 0; i < numberOfChoises; i++) {
				maxScore = Math.max(this.minimax(this.graph.adjList.get(element)[i], depth + 1, false), maxScore);
				let answer = this.graph.adjList.get(element)[i];
				if (depth == 0) {
					if (maxScore > this.scoreMax) {
						this.scoreMax = maxScore;
						this.answer = answer;
					}
				}
			}
			return maxScore;
		}
		else {
			let minScore = Infinity;
			let numberOfChoises = this.graph.adjList.get(element).length;
			for (let i = 0; i < numberOfChoises; i++) {
				minScore = Math.min(this.minimax(this.graph.adjList.get(element)[i], depth + 1, true), minScore);
				let answer = this.graph.adjList.get(element)[i];
				if (depth == 0) {
					if (minScore < this.scoreMin) {
						this.scoreMin = minScore;
						this.answer = answer;
					}
				}
			}
			return minScore;
		}
	}
}