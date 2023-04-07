class Move {
	constructor(currentFruit) {
		this.currentFruit = currentFruit;
		this.src = this.currentFruit.src.substring(currentFruit.src.lastIndexOf('/') + 1);
		this.countPoints(this.src);
	}

	static countPoints(src) {
		let points = 0;

		switch (src) {
			case "orange.png":
				points = 15;
				break;
			case "banana.png":
				points = 17;
				break;
			case "watermelon.png":
				points = 25;
				break;
			case "abols.png":
				points = 20;
				break;
			case "bumbieris.png":
				points = 12;
				break;
		}
		return points;
	}
}