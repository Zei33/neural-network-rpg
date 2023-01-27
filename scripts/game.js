class Game {
	constructor(canvas, context){
		this.images = {
			grass: { url: "/images/grass.png", data: null, loaded: false }
		};
		this.render = null;
		this.canvas = canvas;
		this.context = context;
		
		this.canvas.setAttribute("width", $(this.canvas).css("width"));
		this.canvas.setAttribute("height", $(this.canvas).css("height"));
	}
	
	initiate(){
		this.drawFrame();
		this.render = setInterval(() => this.drawFrame(), 1000 / 30);
	}
	
	preloadImages(){
		for (const imageName in this.images){
			let image = this.images[imageName];
			image.data = new Image();
			image.data.addEventListener("load", () => image.loaded = true, false);
			image.data.src = image.url;
		}
	}
	
	drawFrame(){
		const size = this.canvas.getBoundingClientRect();
		
		// Background
		const grassWidth = this.images.grass.data.naturalWidth;
		const grassHeight = this.images.grass.data.naturalHeight;
		console.log(grassWidth, grassHeight);
		for (let x = 0;x < size.width;x += grassWidth){
			for (let y = 0;y < size.height;y += grassHeight){
				this.context.drawImage(this.images.grass.data, x, y);
			}
		}
	}
	
	get getImages(){
		return this.images;
	}
}

var game = null;
$(function(){
	const canvas = document.querySelector("#game");
	const context = canvas.getContext("2d");
	
	game = new Game(canvas, context);
	game.preloadImages();
	
	let interval = setInterval(() => {
		if (network != null && !Object.values(game.getImages).filter(x => !x.loaded).length){
			game.initiate();
			clearInterval(interval); 
		} 
	}, 10);
}); 