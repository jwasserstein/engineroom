module.exports.checkMissingFields = function (body, requiredFields){
	const missingFields = [];
	for(let i of requiredFields){
		if(!(i in body)){
			missingFields.push(i);
		}
	}
	return missingFields;
}