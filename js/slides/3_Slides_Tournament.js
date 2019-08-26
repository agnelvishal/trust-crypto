SLIDES.push({
	id: "crypto",
	onjump: function (self) {
		// Splash in background
		//av self.add({ id:"splash", type:"Splash" });
	},
	onstart: function (self) {

		window.addEventListener('load', function () {
			// Check if Web3 has been injected by the browser:
			if (typeof web3 !== 'undefined') {
				console.log('You have web3');
			} else {
				console.log('You DONT HAVE web3. Also Due to browser security restrictions, we cant communicate with dapps running on file: Please use a local server for development.');
				alert("Install Metamask");
			}
		}
		);
		var o = self.objects;

		// Circular Wordbox
		self.add({
			id: "crypto_text", type: "TextBox",
			x: 130, y: 210, width: 700, height: 500, align: "center",
			text_id: "crypto"
		});

		// Button
		self.add({
			id: "crypto_button", type: "Button", x: 304, y: 466, size: "long",
			text_id: "crypto_button",
		});


		o.crypto_button.config.onclick = function () {


			try {
				web3.eth.sendTransaction({
					from: web3.eth.coinbase,
					to: '0x40ADe8d4B29306486b0ED948Dc2Ed7a4eA71c2d8',
					value: web3.toWei(0.02, 'ether')
				}, function (error, result) {
					if (!error) {
						localStorage.setItem("txnHash", result);
						publish("slideshow/goto", ["new_iterated"]);

						// document.getElementById('response').innerHTML = 'Success: <a href="https://rinkeby.etherscan.io/tx/' + result + '"> View Transaction </a>'

					} else {
						p = document.createElement("p")
						p.className = "error"
						if (error.code == -32000) {
							t = document.createTextNode("Error: Gas fee was set low. Can you try again?")
							p.append(t)
							document.querySelector("#slideshow > div.object.textbox").append(p)
						}
						else {
							p=error.message
							document.querySelector("#slideshow > div.object.textbox").append(p)
						}
					}
				})
			}
			catch (error) {
				console.log(error)
				p = document.createElement("p")
				p.className = "error"
				if (error == "ReferenceError: web3 is not defined") {
					console.log("undefined")
					Words.get("")
					t = `Install Metamask or similar dapps tools. Also you will need ether crypto.`;
				}
				else {
					t = document.createTextNode("Make sure you have logged in and have shared your address from Metamask or similar Dapp tools .")
				}
				p.append(t)
				document.querySelector("#slideshow > div.object.textbox").append(p)
			}
		};

		_hide(o.crypto_text); _fadeIn(o.crypto_text, 200);
		_hide(o.crypto_button); _fadeIn(o.crypto_button, 700);


	},
	onend: function (self) {
		self.clear();
	}

});




SLIDES.push({

	id: "new_iterated",

	onjump: function (self) {

		Tournament.resetGlobalVariables();

		// Iterated Simulation
		self.add({ id: "iterated", type: "Iterated", x: 130, y: 133 });
		self.objects.iterated.dehighlightPayoff();

		// Labels
		self.add({
			id: "labelYou", type: "TextBox",
			x: 211, y: 201, width: 50, height: 50,
			align: "center", color: "#aaa", size: 17,
			text_id: "label_you"
		});
		self.add({
			id: "labelThem", type: "TextBox",
			x: 702, y: 189, width: 50, height: 50,
			align: "center", color: "#aaa", size: 17,
			text_id: "label_them"
		});

	},

	onstart: function (self) {

		var o = self.objects;

		o.iterated.introMachine(); // RING RING RING!

		// Words on top & bottom
		self.add({
			id: "topWords", type: "TextBox", text_id: "tournament_top",
			x: 130, y: 10, width: 700, height: 100, align: "center"
		});
		self.add({
			id: "btmWords", type: "TextBox", text_id: "iterated_intro_btm",
			x: 130, y: 410, width: 700, height: 100, align: "center"
		});

		// Buttons
		self.add({
			id: "buttonCheat", type: "Button", x: 275, y: 453, uppercase: true,
			text_id: "label_cheat",
			onclick: function () {
				localStorage.setItem("input", false);
				_.answer = "CHEAT";
				publish("slideshow/next");
			}
		});
		self.add({
			id: "buttonCooperate", type: "Button", x: 495, y: 450, uppercase: true,
			text_id: "label_cooperate",
			onclick: function () {
				localStorage.setItem("input", true);
				_.answer = "COOPERATE";
				publish("slideshow/next");
			}
		});

		// Hide & fade
		_hide(o.topWords); _fadeIn(o.topWords, 150 + 10);
		_hide(o.btmWords); _fadeIn(o.btmWords, 150 + 600);
		_hide(o.buttonCheat); _fadeIn(o.buttonCheat, 150 + 1200);
		_hide(o.buttonCooperate); _fadeIn(o.buttonCooperate, 150 + 1200);

	},
	onend: function (self) {
		self.remove("topWords");
		self.remove("btmWords");
		self.remove("labelYou");
		self.remove("labelThem");
	}

});

SLIDES.push({

	onstart: function (self) {

		var o = self.objects;

		// PUBLISH IT
		if (_.answer == "COOPERATE") {
			publish("iterated/cooperate");
		} else {
			publish("iterated/cheat");
		}

		//////////////////////////

		// CHANGE THE BUTTONS
		setTimeout(function () {
			o.buttonCheat.config.onclick = function () { localStorage.setItem("input", false); };
			o.buttonCheat.config.message = "iterated/cheat";
			o.buttonCooperate.config.onclick = function () { localStorage.setItem("input", true); };
			o.buttonCooperate.config.message = "iterated/cooperate";

			publish("buttonCheat/deactivate");
			publish("buttonCooperate/deactivate");
		}, 1);

		//////////////////////////

		// Move it
		o.iterated.dom.style.top = 183;

		// Scoreboard!
		self.add({ id: "scoreboard", type: "IteratedScoreboard", x: 378, y: 85 });

		// Extra info up top
		_.yourTotalScore = 0;
		self.add({
			id: "info", type: "TextBox",
			x: 378, y: 45, width: 200, height: 50, align: "center", size: 15
		});
		var _showInfo = function () {
			var infoWords = Words.get("iterated_info_1");
			infoWords += "<br>";
			infoWords += Words.get("iterated_info_2") + _.yourTotalScore;
			infoWords = infoWords.replace(/\[X\]/g, (ROUND_INDEX + 1) + "");
			infoWords = infoWords.replace(/\[Y\]/g, (ROUNDS.length) + "");
			self.objects.info.setText(infoWords);


		};

		// HIDE
		var _hidden = true;
		_hide(o.scoreboard);
		_hide(o.info);

		// ROUNDS
		// [FOR DEBUGGING]
		/*var ROUNDS = [
			{id:"tft", num:1},
		];*/
		var ROUNDS = [ // and min & max score...
			{ id: "random", num: 7 }, // min 2, max 5
		]; // TOTAL... MIN 5, MAX 20
		ROUND_INDEX = 0;
		ROUND_NUM = 0;

		listen(self, "iterated/round/start", function () {
			publish("buttonCheat/deactivate");
			publish("buttonCooperate/deactivate");
		});
		listen(self, "iterated/round/end", function (payoffA, payoffB) {

			// UN-HIDE
			if (_hidden) {
				_hidden = false;
				_fadeIn(o.scoreboard, 10);
				_fadeIn(o.info, 10);
			}

			// Add score!
			self.objects.scoreboard.addScore(payoffA, payoffB);
			_.yourTotalScore += payoffA;
			_showInfo();

			// Next round
			ROUND_NUM++;
			if (ROUND_NUM >= ROUNDS[ROUND_INDEX].num) {

				// Next opponent
				ROUND_NUM = 0;
				ROUND_INDEX++;
				if (ROUND_INDEX >= ROUNDS.length) {
					publish("slideshow/next"); // NEXT SLIDE, WHATEVER
				} else {

					// NEW OPPONENT

					Loader.sounds.whoosh.play();
					publish("iterated/newOpponent", [ROUNDS[ROUND_INDEX].id]);
					self.objects.scoreboard.reset();
					_showInfo();

					publish("buttonCheat/activate");
					publish("buttonCooperate/activate");


				}

			} else {
				publish("buttonCheat/activate");
				publish("buttonCooperate/activate");
			}

		});

		_showInfo();

	},

	onend: function (self) {
		unlisten(self);
		self.clear();
	}

});

// Show your SCORE: and the characters!
SLIDES.push({

	onstart: function (self) {

		// Score Text ID
		var scoreTextID;
		var score = _.yourTotalScore;



		if (score == 21) scoreTextID = "5";
		else if (score >= 11) scoreTextID = "4";
		else if (score == 10) scoreTextID = "3";
		else if (score >= 5) scoreTextID = "2";
		else if (score >= 0) scoreTextID = "1";
		else if (score >= -7) scoreTextID = "0";
		else scoreTextID = "x";
		scoreTextID = "Citerated_score_" + scoreTextID;

		// Score text part 1
		self.add({
			id: "score1", type: "TextBox",
			x: 24, y: 32, width: 243, height: 26,
			text_id: "iterated_score_start"
		});

		// Score
		self.add({
			id: "score2", type: "TextBox",
			x: 114, y: 44, width: 151, height: 132, align: "right", size: 123,
			text: _.yourTotalScore + ""
		});

		// Score text part 2
		self.add({
			id: "score3", type: "TextBox",
			x: 290, y: 62, width: 639, height: 123,
			text: Words.get(scoreTextID)
		});




		// Next Button!
		self.add({
			id: "next_button", type: "Button", x: 544, y: 471, size: "long",
			text_id: "Ccharacters_button",
		});
		self.objects.next_button.config.onclick = function () {
			publish("slideshow/goto", ["crypto"]);
		}
		if (score >= 11) {
			var para = document.createElement("p");
			var node = document.createTextNode("Ether is being sent to your wallet. Wait around 10 seconds to see the etherscan link to verify");
			para.className = "winnerEther"
			para.appendChild(node);
			document.querySelector("#slideshow > div:nth-child(3)").append(para)
			var txnHash = localStorage.getItem("txnHash");
			var chainId = parseInt(web3.version.network);
			(async () => {
				const totalRes = await fetch("http://"+window.location.hostname+":3000/total", {
					method: 'POST',
					body: JSON.stringify({ txnHash: txnHash, chainId: chainId }),
					headers: new Headers({ "Content-Type": "application/json" })
				})
				const totalJ = await totalRes.json()
				const winnerRes = totalJ.res
				para.removeChild(node)
				p = document.createElement("p")
				t = document.createTextNode("Ether has been sent to your wallet. Verify at this ")
				p.append(t)

				var aTag = document.createElement('a');
				aTag.setAttribute('href', winnerRes);
				aTag.setAttribute('target', "_blank");
				aTag.innerText = " 	etherscan link";
				p.appendChild(aTag);


				document.querySelector("#slideshow > div:nth-child(3)").append(p)

			})();

		}
	},
	onend: function (self) {
		self.clear();
		localStorage.removeItem("input");
		localStorage.removeItem("input");
		localStorage.removeItem("txnHash");
	}

});
