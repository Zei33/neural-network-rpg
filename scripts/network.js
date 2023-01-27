const MAX_LINKS = 10;

class Neuron {
	constructor(network){
		this.network = network;
		this.links = [];
		this.linkPotential = 0;
		this.type = null;
		this.position = { x: null, y: null };
	}
	
	addLink(neuron){
		this.links.push(neuron);
	}
	
	addLinks(neurons){
		this.links = [...this.links, ...neurons];
	}
	
	setPosition(x, y){
		this.position.x = x;
		this.position.y = y;
	}
	
	get getPosition(){
		return this.position;
	}
	
	get getLinkPotential(){
		return this.linkPotential;
	}
	
	get getLinks(){
		return this.links;
	}
	
	get getType(){
		return this.type;
	}
	
	get getActive(){
		return true;
	}
}

class Input extends Neuron {
	constructor(network, type, options){
		super(network);
		
		this.linkPotential = Math.round((Math.random() * MAX_LINKS) * network.getAptitude);
		this.type = type;
		
		if (type == "threat" || type == "food"){
			this.direction = options.direction;
		}
	}
}

class Hidden extends Neuron {
	constructor(network, type, options){
		super(network);
		
		this.linkPotential = Math.round((Math.random() * MAX_LINKS) * network.getAptitude);
		this.type = type;
		
		if (type == "health"){
			this.healthRange = { min: options.min, max: options.max };
		}else if (type == "anonymous"){
			this.weight = options.weight;
		}
	}
	
	get getActive(){
		if (this.type == "health"){
			return (this.network.getHealth.currentHealth >= this.healthRange.min && this.network.getHealth.currentHealth <= this.healthRange.max);
		}else{
			return true;
		}
	}
}

class Output extends Neuron {
	constructor(network, type, options){
		super(network);
		
		this.linkPotential = 0;
		this.type = type;
		
		if (type == "movement"){
			this.direction = options.direction;
		}
	}
}

class Network {
	constructor(options = {}){
		this.neurons = {
			inputs: [],
			hidden: [],
			outputs: []
		};
		
		this.aptitude = options.aptitude ?? (Math.random() / 2) + 0.5;
		this.maxHealth = Math.round(options.maxHealth ?? 50 + (Math.random() * 50));
		this.currentHealth = this.maxHealth;
		
		this.generateNeurons();
		this.linkNeurons();
	}
	
	generateNeurons(){
		// Threat Directions
		this.neurons.inputs.push(new Input(this, "threat", { direction: 0 })); // North
		this.neurons.inputs.push(new Input(this, "threat", { direction: 1 })); // North-East
		this.neurons.inputs.push(new Input(this, "threat", { direction: 2 })); // East
		this.neurons.inputs.push(new Input(this, "threat", { direction: 3 })); // South-East
		this.neurons.inputs.push(new Input(this, "threat", { direction: 4 })); // South
		this.neurons.inputs.push(new Input(this, "threat", { direction: 5 })); // South-West
		this.neurons.inputs.push(new Input(this, "threat", { direction: 6 })); // West
		this.neurons.inputs.push(new Input(this, "threat", { direction: 7 })); // North-West
		
		this.neurons.inputs.push(new Input(this, "threat_nearby", { }));
		
		// Food Directions
		this.neurons.inputs.push(new Input(this, "food", { direction: 0 })); // North
		this.neurons.inputs.push(new Input(this, "food", { direction: 1 })); // North-East
		this.neurons.inputs.push(new Input(this, "food", { direction: 2 })); // East
		this.neurons.inputs.push(new Input(this, "food", { direction: 3 })); // South-East
		this.neurons.inputs.push(new Input(this, "food", { direction: 4 })); // South
		this.neurons.inputs.push(new Input(this, "food", { direction: 5 })); // South-West
		this.neurons.inputs.push(new Input(this, "food", { direction: 6 })); // West
		this.neurons.inputs.push(new Input(this, "food", { direction: 7 })); // North-West
		
		// Hidden 1
		for (let i = 1;i < 13;i++){
			this.neurons.hidden.push(new Hidden(this, "anonymous", { weight: i * 20 }));
		}
		
		this.neurons.hidden.push(new Hidden(this, "health", { min: 0, max: 25 }));
		this.neurons.hidden.push(new Hidden(this, "health", { min: 26, max: 50 }));
		this.neurons.hidden.push(new Hidden(this, "health", { min: 51, max: 75 }));
		this.neurons.hidden.push(new Hidden(this, "health", { min: 76, max: 100 }));
		
		// Movement Outputs
		this.neurons.outputs.push(new Output(this, "movement", { direction: 0 })); // North
		this.neurons.outputs.push(new Output(this, "movement", { direction: 1 })); // North-East
		this.neurons.outputs.push(new Output(this, "movement", { direction: 2 })); // East
		this.neurons.outputs.push(new Output(this, "movement", { direction: 3 })); // South-East
		this.neurons.outputs.push(new Output(this, "movement", { direction: 4 })); // South
		this.neurons.outputs.push(new Output(this, "movement", { direction: 5 })); // South-West
		this.neurons.outputs.push(new Output(this, "movement", { direction: 6 })); // West
		this.neurons.outputs.push(new Output(this, "movement", { direction: 7 })); // North-West
		
		// Attack Output
		this.neurons.outputs.push(new Output(this, "attack", {})); // North
	}
	
	linkNeurons(){
		// Link inputs to hidden
		for (const input of this.getInputs){
			let hidden = this.getHidden;
			let selected = [];
			for (let i = 0;i < input.linkPotential;i++){
				selected.push(hidden.filter(x => !selected.includes(x))[Math.floor(Math.random() * hidden.filter(x => !selected.includes(x)).length)]);
			}
			input.addLinks(selected);
		}
		
		// Link hidden to outputs
		for (const hidden of this.getHidden){
			let outputs = this.getOutputs;
			let selected = [];
			for (let i = 0;i < hidden.linkPotential;i++){
				selected.push(outputs.filter(x => !selected.includes(x))[Math.floor(Math.random() * outputs.filter(x => !selected.includes(x)).length)]);
			}
			hidden.addLinks(selected);
		}
	}
	
	get getAptitude(){
		return this.aptitude;
	}
	
	get getHealth(){
		return { maxHealth: this.maxHealth, currentHealth: this.currentHealth };
	}
	
	get getInputs(){
		return this.neurons.inputs;
	}
	
	get getHidden(){
		return this.neurons.hidden;
	}
	
	get getOutputs(){
		return this.neurons.outputs;
	}
}

function drawNetwork(canvas, context, network){
	canvas.setAttribute("width", $(canvas).css("width"));
	canvas.setAttribute("height", $(canvas).css("height"));
	
	const size = canvas.getBoundingClientRect();
	const columnWidth = size.width / 3;
	
	// Draw inputs
	const inputsRowHeight = (size.height - 100) / network.getInputs.length;
	for(let [index, neuron] of network.getInputs.entries()){
		const columnCenter = (columnWidth * 0) + (columnWidth / 2);
		const rowCenter = (inputsRowHeight * index + 1) + (inputsRowHeight / 2);
		context.beginPath();
		context.arc(columnCenter, rowCenter, inputsRowHeight / 3, 0, 2 * Math.PI, false);
		context.fillStyle = "#12B01F";
		context.fill();
		context.lineWidth = 5;
		if (neuron.getType == "threat") context.strokeStyle = "#26DF3D";
		if (neuron.getType == "threat_nearby") context.strokeStyle = "#B1FF00";
		if (neuron.getType == "food") context.strokeStyle = "#9CFF65";
		context.stroke();
		
		neuron.setPosition(columnCenter, rowCenter);
	}
	
	// Draw hidden
	const hiddenRowHeight = (size.height - 100) / network.getHidden.length;
	for(let [index, neuron] of network.getHidden.entries()){
		const columnCenter = (columnWidth * 1) + (columnWidth / 2);
		const rowCenter = (hiddenRowHeight * index + 1) + (hiddenRowHeight / 2);
		context.beginPath();
		context.arc(columnCenter, rowCenter, hiddenRowHeight / 3, 0, 2 * Math.PI, false);
		if (neuron.getActive){
			context.fillStyle = "#CB1717";
		}else{
			context.fillStyle = "#B6B6B6";
		}
		context.fill();
		
		context.lineWidth = 5;
		if (neuron.getActive){
			if (neuron.getType == "anonymous") context.strokeStyle = "#E52020";
			if (neuron.getType == "health") context.strokeStyle = "#FF7000";
		}else{
			context.strokeStyle = "#DBDBDB";
		}
		context.stroke();
		
		neuron.setPosition(columnCenter, rowCenter);
	}
	
	// Draw outputs
	const outputsRowHeight = (size.height - 100) / network.getOutputs.length;
	for(let [index, neuron] of network.getOutputs.entries()){
		const columnCenter = (columnWidth * 2) + (columnWidth / 2);
		const rowCenter = (outputsRowHeight * index + 1) + (outputsRowHeight / 2);
		context.beginPath();
		context.arc(columnCenter, rowCenter, outputsRowHeight / 3, 0, 2 * Math.PI, false);
		context.fillStyle = "#A012CE";
		context.fill();
		context.lineWidth = 5;
		if (neuron.getType == "movement") context.strokeStyle = "#B41FE4";
		if (neuron.getType == "attack") context.strokeStyle = "#FF00C3";
		context.stroke();
		
		neuron.setPosition(columnCenter, rowCenter);
	}
	
	// Draw lines
	context.globalCompositeOperation = "destination-over";
	for (const neuron of network.getInputs){
		for (const link of neuron.getLinks){
			context.beginPath();
			context.moveTo(neuron.getPosition.x, neuron.getPosition.y);
			context.lineTo(link.getPosition.x, link.getPosition.y);
			context.lineWidth = 3;
			if (neuron.getActive) context.strokeStyle = "#FFEC00"
			else context.strokeStyle = "#999999";
			context.stroke();
		}
	}
	
	for (const neuron of network.getHidden){
		for (const link of neuron.getLinks){
			context.beginPath();
			context.moveTo(neuron.getPosition.x, neuron.getPosition.y);
			context.lineTo(link.getPosition.x, link.getPosition.y);
			context.lineWidth = 3;
			if (neuron.getActive) context.strokeStyle = "#E5007D"
			else context.strokeStyle = "#999999";
			context.stroke();
		}
	}
	context.restore();
	
	context.beginPath();
	context.moveTo(0, size.height - 100);
	context.lineTo(size.width, size.height - 100);
	context.lineWidth = 1;
	context.strokeStyle = "white";
	context.stroke();
	
	context.font = "24px Arial, Helvetica, sans-serif";
	context.fillStyle = "white";
	context.textBaseline = "top";
	context.fillText(`Aptitude: ${Math.round(network.getAptitude * 100)}%`, 5, size.height - 95);
	context.fillText(`Health: ${network.getHealth.currentHealth}/${network.getHealth.maxHealth}`, 5, size.height - 70);
}

var network = null;
$(function(){
	network = new Network();
	
	const canvas = document.querySelector("#network");
	const context = canvas.getContext("2d");
	
	drawNetwork(canvas, context, network);
});