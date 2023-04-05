class FruitMovement {
	constructor(fruits, grozas) {
		this.fruits = fruits;
		this.grozas = grozas;
		let self = this;
		let beginValues = false;
		this.fruits.forEach(element => {

			let isDragging = false;
			let startX, startY, initialX, initialY;

			let elementRect = element.getBoundingClientRect();
			const pirmaGrozaRect = grozas[0].getBoundingClientRect();
			self.firstBasket = pirmaGrozaRect;
			const otraGrozaRect = grozas[1].getBoundingClientRect();

			let inZoneOne = (
				elementRect.top >= pirmaGrozaRect.top &&
				elementRect.left >= pirmaGrozaRect.left &&
				elementRect.bottom <= pirmaGrozaRect.bottom &&
				elementRect.right <= pirmaGrozaRect.right
			);

			let inZoneTwo = (
				elementRect.top >= otraGrozaRect.top &&
				elementRect.left >= otraGrozaRect.left &&
				elementRect.bottom <= otraGrozaRect.bottom &&
				elementRect.right <= otraGrozaRect.right
			);

			element.addEventListener('mousedown', function(e) {
				if(!beginValues) {
					self.topBegin = element.style.top;
					self.leftBegin = element.style.left;
					self.bottomBegin = element.style.bottom;
					self.rightBegin = element.style.right;
					beginValues = true;
				}

				startX = e.clientX;
				startY = e.clientY;
				let left = element.style.left.slice(0, -2);
				let top = element.style.top.slice(0, -2);
				initialX = parseInt(left) ? parseInt(left) : 0;
				initialY = parseInt(top) ? parseInt(top) : 0;
				isDragging = true;
			});

			element.addEventListener('mousemove', function(e) {
				if (isDragging) {
					const dx = e.clientX - startX;
					const dy = e.clientY - startY;

					element.style.left = initialX + dx + 'px';
					element.style.top = initialY + dy + 'px';
					inZoneOne = (
						elementRect.top >= pirmaGrozaRect.top &&
						elementRect.left >= pirmaGrozaRect.left &&
						elementRect.bottom <= pirmaGrozaRect.bottom &&
						elementRect.right <= pirmaGrozaRect.right
					);
		
					inZoneTwo = (
						elementRect.top >= otraGrozaRect.top &&
						elementRect.left >= otraGrozaRect.left &&
						elementRect.bottom <= otraGrozaRect.bottom &&
						elementRect.right <= otraGrozaRect.right
					);
					elementRect = element.getBoundingClientRect();
				}
			});

			element.addEventListener('mouseup', function() {
				isDragging = false;
				self.currentFruit = element;
				beginValues = false;
				if (inZoneTwo) {
					self.currentFruit.style.visibility = 'hidden';
				}
				else {
					self.placeInBeginning();
				}
			});
		});
	}

	placeInBeginning() {
		this.currentFruit.style.top = this.topBegin;
		this.currentFruit.style.left = this.leftBegin;
		this.currentFruit.style.bottom= this.bottomBegin;
		this.currentFruit.style.right = this.rightBegin;

		this.currentFruit.style.visibility = 'visible';
	}
}