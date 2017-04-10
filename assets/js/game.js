var HangMan = new Object();
var curObjName = new String();

$(window).on('load', function () {
	
	createObjects();

	//Startup image click listener
	$('#startup').click(function(){
		$('#wordpanel').removeClass('hide');
		$('#hangman').removeClass('hide');
	});
	
	//change the category
	$('#category').change(function() {
		changeCategory();	
		updateObject(curObjName);
		loadObject(curObjName);
	});

	//Click the Restart button listener
	$('#restartbtn').click(function(event){
		setObject(curObjName);
		loadObject(curObjName);
		event.preventDefault();		
	});

	//Click the Next button listener	
	$('#nextbtn').click(function(event){
		updateObject(curObjName);
		event.preventDefault();		
	});	

	
	//keybord key listener
	$(document).on('keyup', function(event){
		var legKey = true;
		var letter = event.key.toLowerCase();
		var obj = HangMan[curObjName];
		if ( event.which < 65 || event.which > 90) {
			legKey = false;
		}else{
			for( i = 0 ; i < obj.guesses.length ; i++){
				if(letter === obj.guesses[i]){
					legKey = false;
					break;
				};
			};
		};
		if (legKey) {
			processLetter(event.key.toLowerCase());
		}else{
			event.preventDefault();
		}; 
	});		
});

var namesArr = ['ava', 'Rey', 'Jona', 'John', 'Edgar', 'Brayan', 'Leonel', 'Garnet', 'Garland', 'Susannah'];
var colorsArr = ['red', 'blue', 'aqua', 'lime', 'black', 'white', 'maroon', 'orange', 'purple', 'fuchsia'];
var statesArr = ['ohio', 'iowa', 'idaho', 'texas', 'alaska', 'oregon', 'vermont', 'wyoming', 'delaware', 'maryland'];
var categories = ['namesObj', 'colorsObj','statesObj'];
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

//Change Game to new category
function changeCategory(){
	curObjName = $('#category').val();
	$('#curobj').val(curObjName);		
};

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
	changeCategory();
	loadObject(categories[catIndex]);
};

//Set a clear Hangman object
function setObject(objectName){
	var obj = HangMan[objectName];
	obj.category = $('#category option[value=' + objectName + ']').text();
	obj.word = obj.words[Math.floor(Math.random() * obj.words.length)].toLowerCase();
	obj.wins = 0;
	obj.loses = 0;
	obj.lives = 10;
	obj.guesses = [];
	obj.trueg = [];
	for ( i = 0 ; i < obj.word.length ; i++ ){obj.trueg.push('0')};
	obj.falseg = [];
};

//Updating the current category object to next word
function updateObject(objectName){
	var obj = HangMan[objectName];
	obj.word = obj.words[Math.floor(Math.random() * obj.words.length)].toLowerCase();
	obj.lives = 10;
	obj.guesses = [];
	obj.trueg = [];
	for ( i = 0 ; i < obj.word.length ; i++ ){obj.trueg.push('0')};
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

function charOccur(string,char) {
	var re = new RegExp(char,"gi");
	re = string.match(re) === null ? "" : string.match(re);
	return re.length;
};

//Loading the word into the word panel
function loadWord(word){
	var span = "";
	for (i=0;i<word.length;i++){
		span = span + '<span>_</span>';
	}
	return span;
};

//Return the indexes of a letter in a word
function findIndex(letter,word){
	var indexArray = [];
	for(var i = 0; i < word.length; i++){
		if ( letter === word[i]){
			indexArray.push(i);
		}
	}
	return indexArray;
};

//Processing the input letter
function processLetter(letter){
	var obj = HangMan[curObjName];
	var word = obj.word;
	var guesses = obj.guesses;
	var falseg = obj.falseg;
	var trueg = obj.trueg;
	guesses.push(letter);
 	var letterIndex = findIndex(letter,word);
 	if (letterIndex.length === 0){
 		falseg.push(letter);
 		var font = '<font>'+ letter +'</font>';
 		$('#guesses').append(font);
 		if ( falseg < 9 ) {$('#hangman' + falseg).removeClass('hide')};
 		var remLive = parseInt($('#remlive').html()) - 1;
 		$('#remlive').html(remLive);
 		$('#live' + falseg.length).addClass('off');
 		var letterfailed = document.getElementById("letterfailed");
 		if( remLive > 0 ){ letterfailed.play() };
 	}else{
 		for( i = 0 ; i < letterIndex.length ; i++){
 			var j = letterIndex[i];
 			trueg[j] = "1";
 			$('#word span:nth-child(' + (j + 1) + ')').html(letter);
 		}
 		var lettersucceeded = document.getElementById("lettersucceeded");
		lettersucceeded.play();
 	};
	if (charOccur(trueg.join(''),'0') === 0){
		var wordsucceeded = document.getElementById("wordsucceeded");
		wordsucceeded.play();
		$('#hangmanw').removeClass('hide');
		$('#showword').html(word);
		obj.wins++;
		$('#wins').html(parseInt($('#wins').html()) + 1);		
	}else if (falseg.length === 10){
		$('#hangmanl').removeClass('hide');
		var wordfailed = document.getElementById("wordfailed");
		wordfailed.play();
		obj.loses++;
		$('#loses').html(parseInt($('#loses').html()) + 1);
	};
};