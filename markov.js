
		var chain = {};


		function addToChain(firstWord, secondWord){
			// if we havent seen the first word before
			// add a new object to hold it
			if(chain[firstWord] === undefined){
				chain[firstWord] = {};
			}
			// if we havent seen the second word before
			// add a new onject to hold it
			if(chain[firstWord][secondWord] === undefined){
				chain[firstWord][secondWord] = 0;
			}
			// mark that we've seen the first -> second chain again
			chain[firstWord][secondWord] ++;
		}

		// lower case all words and remove punctuation
		function sanitize(word){
			return word.toLowerCase().replace(/[^a-z]/g, '');
		}

		function train(text){
			var words = text.split(/[ \n/]+/);
			words.push("[EOT]");
			words.unshift("[SOT]");
			// clearChain();
			for(var i = 0; i < words.length - 1; i++){
				addToChain(
					sanitize(words[i]),
					sanitize(words[i + 1])
					);
			}
		}

		function pickRandomNext(firstWord){
			var temp = [];
			// for each potential next word
			for(var secondWord in chain[firstWord]){
				// push copies of that word into temp, equal to probability
				for(var i = 0; i < chain[firstWord][secondWord]; i++){
					temp.push(secondWord);
				}
			}
			//return a random pick from temp
			return temp[Math.floor(Math.random() * temp.length)];
		}

		function generate(numWords){
			var currentWord = "sot";
			var output = "";
			while(currentWord !== "eot"){
				output += currentWord + " ";
				currentWord = pickRandomNext(currentWord);
			}
			output = output.substring(4);
			return output;
		}

		function clearChain(){
			chain = {};
		}



module.exports = {
	train: train,
	generate: generate,
	clearChain: clearChain
};