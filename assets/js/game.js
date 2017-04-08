var HangMan = new Object();
var curObjName = new String();

$(window).on('load', function () {
	
	createObjects();

	$('#hangmanintro').click(function(){
		$('#wordpanel').removeClass('hide');
	});
	
	//change the category
	$('#category').change(function() {
		updateCat();	
		loadObject(curObjName);
	});

	//Click the start button listener
	$('#restartbtn').click(function(event){
		setObject(curObjName);
		loadObject(curObjName);
		event.preventDefault();		
	});

	$('#nextbtn').click(function(event){
		updateObject(curObjName);
		event.preventDefault();		
	});	

	
	//keybord key listener
	$(document).on('keyup', function(event){
		var curLetter = event.key.toLowerCase();
		var obj = HangMan[curObjName];
		if ( event.which < 65 || event.which > 90) {
			legKey = false;
		}else{
			for( i = 0 ; i < obj.guesses.length ; i++){
				if(curLetter === obj.guesses[i]){legKey = false};
			};
		};
		if (legKey) {
			var obj = HangMan[curObjName];
			var curLetter = event.key.toLowerCase();
			obj.guesses.push(curLetter);
			var guessStatus = updateGuesses(obj.word , curLetter , obj.falseg.length);
			if(guessStatus){
				obj.trueg.push(curLetter);
			}else{
				obj.falseg.push(curLetter);
			};
			var status = updateStatus(obj.word, obj.trueg.length , obj.falseg.length);
			if (status === 1){
				obj.wins++;
				$('#wins').html($('#wins').html()+1)
			}else if (status === 0){
				obj.loses++;
				$('#loses').html($('#wins').html()+1)
			};
		}; 
	});		
});

var namesArr = ['ava', 'Rey', 'Jona', 'John', 'Edgar', 'Brayan', 'Leonel', 'Garnet', 'Garland', 'Susannah'];
var colorsArr = ['red', 'blue', 'aqua', 'lime', 'black', 'white', 'maroon', 'orange', 'purple', 'fuchsia'];
var statesArr = ['ohio', 'iowa', 'idaho', 'texas', 'alaska', 'oregon', 'vermont', 'wyoming', 'delaware', 'maryland'];
var categories = ['namesObj', 'colorsObj','statesObj'];
var legKey = true;
var gameObj = {
	words : [],
	category : "",
	word : "",
	wins : 0,
	loses : 0,
	lives : 10,
	guesses : [],
	trueg : [],
	falseg : []
};

function updateCat(){
	curObjName = $('#category').val();
	$('#curobj').val(curObjName);		
}

//Creating objects for all categories
function createObjects(){
	HangMan.namesObj = Object.create(gameObj);
	HangMan.colorsObj = Object.create(gameObj);
	HangMan.statesObj = Object.create(gameObj);
	HangMan.namesObj.words = namesArr;
	HangMan.colorsObj.words = colorsArr;
	HangMan.statesObj.words = statesArr;
	setObject('namesObj');
	setObject('colorsObj');
	setObject('statesObj');
	var catIndex = Math.floor(Math.random() * categories.length);
	$('#category option:eq(' + catIndex + ')').prop('selected', true)
	updateCat();
	loadObject(categories[catIndex]);
};

function setObject(objectName){
	var obj = HangMan[objectName];
	obj.category = $('#category option[value=' + objectName + ']').text();
	obj.word = obj.words[Math.floor(Math.random() * obj.words.length)].toLowerCase();
	obj.wins = 0;
	obj.loses = 0;
	obj.lives = 10;
	obj.guesses = [];
	obj.trueg = [];
	obj.falseg = [];
};

//Updating the current category object to next word
function updateObject(objectName){
	var obj = HangMan[objectName];
	obj.word = obj.words[Math.floor(Math.random() * obj.words.length)].toLowerCase();
	obj.lives = 10;
	obj.guesses = [];
	obj.trueg = [];
	obj.falseg = [];
	loadObject(objectName);
};

//Loading the current category object into the page
function loadObject(objectName){
	var obj = HangMan[objectName];
	$('#catlabel').html($( "#category option:selected" ).text());
	$('#word').html(loadWord(obj.word));
	$('#letters').empty();
	$('#letters').html(obj.word.length);
	$('#wins').html(obj.wins);
	$('#loses').html(obj.loses);
	$('#remlive').html(obj.lives);
	$('#guesses').empty();
	$('.ilive').removeClass('off');
	$('.hang').addClass('hide');
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
 	legKey = true;
 	if (index < 0){
 		var font = '<font>'+ letter +'</font>';
 		$('#guesses').append(font);
 		if ( falseg < 9 ) {$('#hangman' + falseg).removeClass('hide')};
 		$('#live' + falseg).addClass('off');
 		var letterfailed = document.getElementById("letterfailed");
 		letterfailed.play();
 		return false;
 	}else{
		$('#word span:nth-child(' + (index + 1) + ')').html(letter);
		var lettersucceeded = document.getElementById("lettersucceeded");
		lettersucceeded.play();
		return true;
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