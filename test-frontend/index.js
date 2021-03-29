var colorCombo = () => {
	return [360 * Math.random(), 50 + 50 * Math.random(), 80 + 15 * Math.random()];
}

var getColor = (cc) => { 
  	return "hsl(" + cc[0] + ',' +
		cc[1] + '%,' + 
		cc[2] + '%)'
}

var setEventListeners = () => {
	// JOIN PRIVATE

	document.getElementById("joinprivate").addEventListener("click",function(){
		document.getElementById("joinprivate").classList.add("invis");
		document.getElementById("codeinput").classList.remove("invis");
	});

	document.getElementById("host").addEventListener("click", function(){
		document.getElementById("joinprivate").classList.remove("invis");
		document.getElementById("codeinput").classList.add("invis");
	});

	document.getElementById("joinpublic").addEventListener("click", function(){
		document.getElementById("joinprivate").classList.remove("invis");
		document.getElementById("codeinput").classList.add("invis");
	})

	// JOIN PUBLIC

	document.getElementById("joinpublic").addEventListener("click",function(){
		document.getElementById("publicgameslist").classList.remove("invis");
	});

	document.getElementById("host").addEventListener("click", function(){
		document.getElementById("publicgameslist").classList.add("invis");
	});

	document.getElementById("joinprivate").addEventListener("click", function(){
		document.getElementById("publicgameslist").classList.add("invis");
	})
}

window.onload = () => {
	cc = colorCombo()

	document.body.style.backgroundColor = getColor(cc);

	cc[1] = 70;
	cc[2] = 40;
	document.documentElement.style.setProperty("--dark-color", getColor(cc));

	setEventListeners();
}