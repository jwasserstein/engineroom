export async function apiCall(type, url, data) {
	try {
		const resp = await fetch(process.env.REACT_APP_BACKEND_URL + '/api' + url, {
			method: type.toLowerCase(),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.token}`
			},
			body: JSON.stringify(data)
		});
		const d = await resp.json();
		return d;
	} catch(err) {
		return {error: err.message};
	}
}