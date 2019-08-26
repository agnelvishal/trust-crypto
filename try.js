getPayoffs = function (move1, move2) {
	if (move1 == "CHEAT" && move2 == "CHEAT") return 0; // both punished
	if (move1 == "COOPERATE" && move2 == "CHEAT") return -1; // sucker - temptation
	if (move1 == "CHEAT" && move2 == "COOPERATE") return 3; // temptation - sucker
	if (move1 == "COOPERATE" && move2 == "COOPERATE") return 2; // both rewarded
};
