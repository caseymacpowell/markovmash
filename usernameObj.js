function createParams(username){
	var paramObj = {
		screen_name: username,
		include_rts: false,
		count: 200,
		contributor_details: false,
		trim_user: true
	};
	return paramObj;
}

module.exports = {
	createParams: createParams
};