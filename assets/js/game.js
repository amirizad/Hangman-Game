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
		displayNextWordFor(curObjName);
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
		displayNextWordFor(curObjName);
		event.preventDefault();		
	});	

	
	//keybord key listener
	$(document).on('keyup', function(event){
		if(HangMan.gameReady){
			var letter = event.key.toLowerCase();
			if ( event.which < 65 || event.which > 90) {
				event.preventDefault();
			} else if(!newLetter(letter)) {
				event.preventDefault();
			} else {
				processLetter(letter);
			};
		}
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

//Checking if the input letter is new.
function newLetter(letter){
	var valid = true;
	for( i = 0 ; i < HangMan[curObjName].guesses.length ; i++){
		if(letter === HangMan[curObjName].guesses[i]){
			valid = false;
			break;
		};
	};
	return valid;
};

//Change Game to new category
function changeCategory(){
	curObjName = $('#category').val();
	$('#curobj').val(curObjName);		
};

//Creating objects for all categories
function createObjects(){
	HangMan.gameReady = true;
	HangMan.namesObj = Object.create(gameObj);
	HangMan.colorsObj = Object.create(gameObj);
	HangMan.statesObj = Object.create(gameObj);
	HangMan.namesObj.words = namesArr;
	HangMan.colorsObj.words = colorsArr;
	HangMan.statesObj.words = statesArr;
	HangMan.categories = categories;
	for(i = 0 ; i < HangMan.categories.length ; i++){
		setObject(HangMan.categories[i]);
	}
	var catIndex = Math.floor(Math.random() * categories.length);
	$('#category option:eq(' + catIndex + ')').prop('selected', true)
	changeCategory();
	loadObject(categories[catIndex]);
};

//Set a clear Hangman object
function setObject(objectName){
	var obj = HangMan[objectName];
	HangMan.gameReady = true;	
	obj.category = $('#category option[value=' + objectName + ']').text();
	obj.word = obj.words[Math.floor(Math.random() * obj.words.length)].toLowerCase();
	obj.wins = 0;
	obj.loses = 0;
	obj.lives = 10;
	obj.guesses = [];
	obj.trueg = [];
	for ( j = 0 ; j < obj.word.length ; j++ ){obj.trueg.push('0')};
	obj.falseg = [];
};

//Updating the current category object to next word.
function displayNextWordFor(objectName){
	var obj = HangMan[objectName];
	HangMan.gameReady = true;
	obj.word = obj.words[Math.floor(Math.random() * obj.words.length)].toLowerCase();
	obj.lives = 10;
	obj.guesses = [];
	obj.trueg = [];
	for ( i = 0 ; i < obj.word.length ; i++ ){obj.trueg.push('0')};
	obj.falseg = [];
	loadObject(objectName);
};

//Loading the current category object into the page.
function loadObject(objectName){
	var obj = HangMan[objectName];
	$('#catlabel').html($( "#category option:selected" ).text());
	$('#word').html(loadWord(obj.word, true));
	$('#letters').empty();
	$('#letters').html(obj.word.length);
	$('#wins').html(obj.wins);
	$('#loses').html(obj.loses);
	$('#remlive').html(obj.lives);
	$('#guesses').empty();
	$('.ilive').removeClass('off');
	$('.hang').addClass('hide');
};

//Loading the word into the word panel.
function loadWord(word, guess){
	var span = "";
	for (i=0;i<word.length;i++){
		if(guess){
			span = span + '<span>_</span>';
		}else{
			span = span + '<span>' + word[i] + '</span>';
		}
	};
	return span;
};

//Return the number of times letter occurs in the word.
function charOccur(string,char) {
	var re = new RegExp(char,"gi");
	re = string.match(re) === null ? "" : string.match(re);
	return re.length;
};

//Return the indexes of a letter in a word.
function findIndex(letter,word){
	var indexArray = [];
	for(var i = 0; i < word.length; i++){
		if ( letter === word[i]){
			indexArray.push(i);
		}
	}
	return indexArray;
};

//Processing the input letter.
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
 		var falsegC = falseg.length - 1;
 		if ( falsegC < 9 ) {$('#hangman' + falsegC).removeClass('hide')};
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
		HangMan.gameReady = false;
		$('#nextbtn').focus();
	}else if (falseg.length === 10){
		$('#hangmanl').removeClass('hide');
		var wordfailed = document.getElementById("wordfailed");
		wordfailed.play();
		obj.loses++;
		$('#loses').html(parseInt($('#loses').html()) + 1);
		$('#word').html(loadWord(obj.word, false));
		HangMan.gameReady = false;
		$('#nextbtn').focus();
	};
};