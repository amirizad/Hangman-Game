var HangMan = new Object();
var curObjName = new String();

$(window).on('load', function () {
	curObjName = $('#category').val();
	$('#curobj').val(curObjName);
	createObjects();

	//change the category
	$('#category').change(function() {
		curObjName = $('#category').val();
		$('#curobj').val(curObjName);		
		loadObject(curObjName);
	});

	//Click the start button listener
	$('#startbtn').on('click',function(event){
		if($(this).val() === 'start'){
			$("#curobj").val(curObjName);
			$(this).html('Restart');
			$(this).val('restart');			
		}else{
			clearObject(objectName);
		}
		updateObject(curObjName);
		event.preventDefault();		
	});

	$('#next').on('click',function(event){
		updateObject(curObjName);
		event.preventDefault();		
	});	

	//keybord key listener
	$(document).keyup(function(event){
		var obj = HangMan[curObjName];
		var curLetter = event.key.toLowerCase();
		obj.geusses.push(curLetter);
		var guessStatus = updateGuesses(obj.word , curLetter , obj.falseg.length);
		if(guessStatus){
			obj.trueg.push(curLetter);
		}else{
			obj.falseg.push(curLetter);
		};
		var status = updateStatus(obj.word, obj.trueg.length , obj.falseg.length);
		if (status === 1){
			obj.wins++;
		}else if (status === 0){
			obj.loses++;
		};
	}).keydown(function(event){
		var curLetter = event.key.toLowerCase();
		var usedLetter = false;
		var obj = HangMan[curObjName];
		if (!obj.started){
	    usedLetter = true;
		}else if ( event.which == 13 || event.which == 32) {
		    usedLetter = true;
		  }else{
			  for(i=0;i<obj.geusses.length;i++){
			  	if(curLetter === obj.geusses[i]){usedLetter = true};
			  };
			}

	  if(usedLetter === true){
	  	event.preventDefault();
	  };		
	});
});

var namesArr = ['ava', 'Rey', 'Jona', 'John', 'Edgar', 'Brayan', 'Leonel', 'Garnet', 'Garland', 'Susannah'];
var colorsArr = ['red', 'blue', 'aqua', 'lime', 'black', 'white', 'maroon', 'orange', 'purple', 'fuchsia'];
var statesArr = ['ohio', 'iowa', 'idaho', 'texas', 'alaska', 'oregon', 'vermont', 'wyoming', 'delaware', 'maryland'];


var gameObj = {
	started : false,
  words : [],
	category : "",
	word : "",
	wins : 0,
	loses : 0,
	lives : 10,
	geusses : [],
	trueg : [],
	falseg : []

}

//Creating objects for all categories
function createObjects(){
	HangMan.namesObj = Object.create(gameObj);
	HangMan.colorsObj = Object.create(gameObj);
	HangMan.statesObj = Object.create(gameObj);
	HangMan.namesObj.words = namesArr;
	HangMan.colorsObj.words = colorsArr;
	HangMan.statesObj.words = statesArr;
	updateObject(curObjName);	
};

function clearObject(objectName){
	var obj = HangMan[objectName];
	obj.started = true;
	obj.category = $( "#category option:selected" ).text();;
	obj.word = obj.words[Math.floor(Math.random() * obj.words.length)].toLowerCase();
	obj.wins = 0;
	obj.loses = 0;
	obj.lives = 10;
	obj.geusses = [];
	obj.trueg = [];
	obj.falseg = [];
	loadObject(objectName);
};

//Updating the current category object to next word
function updateObject(objectName){
	var obj = HangMan[objectName];
	obj.started = true;
	obj.category = $( "#category option:selected" ).text();
	obj.word = obj.words[Math.floor(Math.random() * obj.words.length)].toLowerCase();
	loadObject(objectName);
};

//Loading the current category object into the page
function loadObject(newCat){
	var obj = HangMan[newCat];
	if(obj.started){
		$('#startbtn').html('Restart').val('restart');
	}else{
		$('#startbtn').html('Start').val('start');
	};
	$('#catlabel').html($( "#category option:selected" ).text());
	$('#word').html(loadWord(obj.word));
	$('#letters').html(obj.word.length);
	$('#wins').html(obj.wins);
	$('#loses').html(obj.loses);
	$('#remlive').html(obj.lives);
};

//Loading the word into the word panel
	function loadWord(word){
		var span = "";
		for (i=0;i<word.length;i++){
			span = span + '<span>_</span>';
		}
		return span;
	};


	function updateGuesses(word,letter,falseg){
	 	var index = word.indexOf(letter);
	 	if (index){
			$('#word span:nth-child(' + (index + 1) + ')').html(letter);
			var lettersucceeded = document.getElementById("lettersucceeded");
			lettersucceeded.play();
			return true;
	 	}else{
	 		var font = '<font>'+ letter +'</font>';
	 		$('#guesses').append(font);
	 		if ( falseg < 9 ) {$('#hangman' + falseg).css('display','block')};
	 		$('#live' + falseg).addClass('off');
	 		var letterfailed = document.getElementById("letterfailed");
	 		letterfailed.play();
	 		return false;
	 	}
	};

	function updateStatus(word, trueg, falseg){
		if (word.length === trueg){
			$('#hangmanw').css('display','block');
			$('#showword').html(word);
			var wordsucceeded = document.getElementById("wordsucceeded");
			wordsucceeded.play();
			return 1;
		}else if (word + 10 <= trueg + falseg){
			$('#hangmanl').css('display','block');
			var wordfailed = document.getElementById("wordfailed");
			wordfailed.play();
			return 0;
		}else{
			return -1;
		}
	};