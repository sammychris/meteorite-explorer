const createItems = (id, child) => {
	let father = typeof id == 'string'?  document.getElementById(id): id;
	if(!father) {
		let ans = document.getElementById('data');
		father = document.createElement('ul');
		father.id = 'list';
		ans.append(father);
	}
	let c = document.createElement(child)
	father.append(c);
	return c;
}

const deleteItems = (id) => {
	let f =  document.getElementById('data');
	let child = document.getElementById(id);
	f.removeChild(child);
}

const multiDimensional = (arr, size) => {
	var res = []; 
	for(var i=0;i < arr.length;i = i+size)
		res.push(arr.slice(i,i+size));
	return res;
}

const filtering = (items, item) => {
	if (item === 'latitude' || item === 'longitude') {
		if(!items.geolocation) return 'unknown';
		items[item] = items.geolocation.longitude
		items[item] = items.geolocation.latitude;
		return items[item]
	}
	if(!items[item]) {
		return 'unknown';
	}
	if(item === 'year') {
		return items[item].replace(/-.+/, '');
	}
	return items[item];
}


const each = (items) => {
	let li = createItems('list', 'li');
	let keys = [
		'name', 'id', 'nametype','recclass', 'mass',
		'fall', 'year', 'latitude', 'longitude'
		];

	for(let i in keys){
		let span = createItems(li, 'span');
		span.className = keys[i];
		span.innerText = filtering(items, keys[i]);
	}
}

const paginationHandler = () => {

}

const searchHandler = () => {

}

const loadData = (data) => {
	let pageBtns = document.getElementsByTagName('a');

	let newData = multiDimensional(data, 10);
	newData[0].forEach(obj=> each(obj));

	const activeTag = (a) => document.getElementById(a);

	let firstBtn = document.getElementById('first');
	let lastBtn = document.getElementById('last');
	let prevBtn = document.getElementById('prev');
	let nextBtn = document.getElementById('next');
	let numbersBtn = document.getElementsByClassName('numbers');
	let nextPrev = false;
	let count;
	let select = 0;


	const PAGI = (index = 1, start = false, sign = true) => {
		if(sign){
			for(let i = 0; i < numbersBtn.length; i++){
				numbersBtn[i].innerText = start? i+1:  Number(numbersBtn[i].innerText) + index;
			}
		}else {
			for(let i = 0; i < numbersBtn.length; i++){
				numbersBtn[i].innerText = start? i-1:  Number(numbersBtn[i].innerText) - index;
			}
		}
	}


	for(let i = 0; i < pageBtns.length; i++){
		pageBtns[i].onclick = function(event) {
			let clickedTag = event.target;
			let page = Number(activeTag('active').innerText);
			count = nextPrev? page - 2 : count;

			deleteItems('list');
			
			if(clickedTag.id === 'first'){ // clicked Tag is a number...
				select = 0;
				newData[0].forEach(obj=> each(obj));
				activeTag('active').id = '';
				numbersBtn[select].id = 'active'; 
				lastBtn.className = '';
				nextBtn.className = '';
				firstBtn.className = 'disable';
				prevBtn.className = 'disable';
				PAGI(1, true);
			}
			else if(clickedTag.id === 'last'){
				select = 9;
				nextPrev = true;
				newData[99].forEach(obj=> each(obj));
				activeTag('active').id = '';
				numbersBtn[numbersBtn.length - 1].id = 'active'; 
				firstBtn.className = '';
				prevBtn.className = '';
				lastBtn.className = 'disable';
				nextBtn.className = 'disable';
				PAGI(91 - numbersBtn[0].innerText, false,);
			}
			else if(clickedTag.id === 'next') { // clicked Tag is equal to next...
				nextPrev = true;
				newData[page].forEach(obj=> each(obj));
				if(page >= 6 && page < 96) {
					select = 5;
					activeTag('active').id = '';
					numbersBtn[select].id = 'active';
					if(numbersBtn[numbersBtn.length - 1].innerText < 100 ) {
						PAGI();
					}
				}else {
					select++;
					activeTag('active').id = '';
					numbersBtn[select].id = 'active';
					firstBtn.className = '';
					prevBtn.className = '';

				}

				if(activeTag('active').innerText === '100'){
					lastBtn.className = 'disable';
					nextBtn.className = 'disable';
				}
			}
			else if(clickedTag.id === 'prev') { // clicked Tag is equal to previous...
				nextPrev = false;
				newData[count].forEach(obj=> each(obj));
				count--;
				if(page > 6 && page < 97) {
					select = 5;
					activeTag('active').id = '';
					numbersBtn[select].id = 'active';
					if(numbersBtn[0].innerText > 1){
						PAGI(1,false,false);
					}
				}else {
					select--;
					activeTag('active').id = '';
					numbersBtn[select].id = 'active';
					if(activeTag('active').innerText === '1'){
						firstBtn.className = 'disable';
						prevBtn.className = 'disable';
					}else {
						firstBtn.className = '';
						prevBtn.className = '';
						nextBtn.className = '';
						lastBtn.className = '';
					}
				}
			}
			else if(clickedTag.className === 'numbers') { // clicked Tag is equal to First...
				nextPrev = true;
				newData[Number(clickedTag.innerText) - 1].forEach(obj=> each(obj));
				if(clickedTag.innerText >= 6 && clickedTag.innerText < 97) {
					activeTag('active').id = '';
					numbersBtn[5].id = 'active';
					firstBtn.className = '';
					prevBtn.className = '';
					PAGI(clickedTag.innerText - numbersBtn[5].innerText);
				} 
				else {
					activeTag('active').id = '';
					clickedTag.id = 'active';
					if(activeTag('active').innerText === '1'){
						firstBtn.className = 'disable';
						prevBtn.className = 'disable';
					}else {
						firstBtn.className = '';
						prevBtn.className = '';
					}

					if(activeTag('active').innerText === '100'){
						lastBtn.className = 'disable';
						nextBtn.className = 'disable';
					}else {
						lastBtn.className = '';
						nextBtn.className = '';
					}

				}
			}				
		}
	}

	// Handles the search items
	document.getElementById('search-btn').onclick = function () {

		let search = document.getElementById('search-box').value.toLowerCase();
		deleteItems('list');

		if(!search.trim()){
			newData = multiDimensional(data, 10);
			newData[0].forEach(obj=> each(obj));

			activeTag('active').id = '';
			numbersBtn[0].id = 'active'; 
			firstBtn.className = 'disable';
			prevBtn.className = 'disable';
			PAGI(1, true);
		}else {
			let searchedData = data.filter(a => a.name.toLowerCase().includes(search));
			newData = multiDimensional(searchedData, 10);

			activeTag('active').id = '';
			numbersBtn[0].id = 'active'; 
			firstBtn.className = 'disable';
			prevBtn.className = 'disable';
			PAGI(1, true);

			if(!searchedData.length) {
				let ans = document.getElementById('data');
				let div = document.createElement('div');
				div.id = 'list';
				div.className = 'search-not-found';
				ans.append(div);
				div.innerText = 'Search Not Found!';
			}else {
				newData[0].forEach(obj => each(obj));
			}
		} 
	}
}


fetch('https://data.nasa.gov/resource/gh4g-9sfh.json')
	.then(e => e.json())
	.then(data => {
		loadData(data);
	});