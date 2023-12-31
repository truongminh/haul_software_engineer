class DataTable extends HTMLElement {


	constructor() {
		super();

		if (this.hasAttribute('src')) this.src = this.getAttribute('src');
		// If no source, do nothing
		if (!this.src) return;

		// attributes to do, datakey 
		if (this.hasAttribute('cols')) this.cols = this.getAttribute('cols').split(',');

		this.pageSize = 10;
		if (this.hasAttribute('pagesize')) this.pageSize = this.getAttribute('pagesize');

		// helper values for sorting and paging
		this.sortAsc = false;
		this.curPage = 1;

		// const shadow = this.attachShadow({
		// 	mode: 'open'
		// });



		const table = document.createElement('table');
		const thead = document.createElement('thead');
		const tbody = document.createElement('tbody');


		table.append(thead, tbody);

		const nav = document.createElement('nav');
		const navUl = document.createElement('ul');
		navUl.className = "pagination"



		const prevButton = document.createElement('li');
		prevButton.className = "page-item"
		prevButton.innerHTML = '<button type="button" class="btn btn-light">Previous</button>';

		const nextButton = document.createElement('li');
		nextButton.className = "page-item"
		nextButton.innerHTML = '<button type="button" class="btn btn-light">Next</button>';

		navUl.append(prevButton, nextButton);
		// navUl.innerHTML = "<a></a>"

		table.className = "table"

		nav.style = 'float:right'

		nav.append(navUl)
		this.append(table)
		this.append(nav)

		// https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/
		this.sort = this.sort.bind(this);

		this.nextPage = this.nextPage.bind(this);
		this.previousPage = this.previousPage.bind(this);

		nextButton.addEventListener('click', this.nextPage, false);
		prevButton.addEventListener('click', this.previousPage, false);

		const that = this

		const selectBasic = document.getElementById('select-basic')
		selectBasic.addEventListener('change', function () {
			console.log(selectBasic.value)
			that.filterBasic = selectBasic.value
			that.load()
		})
	}

	async load() {
		console.log('load', this.src, this.filterBasic);
		// error handling needs to be done :|
		let result = await fetch(this.src + `?sort_by=${this.sortCol}&sort_order=${this.sortAsc ? 'asc' : 'desc'}&basic=${this.filterBasic ?? ''}&page_size=${this.pageSize}&page_number=${this.curPage}`);
		let data = await result.json();

		this.data = data.data
		this.meta = data.meta

		this.render();
	}

	nextPage() {
		if ((this.curPage * this.pageSize) < this.meta.count) this.curPage++;
		this.load()
	}

	previousPage() {
		if (this.curPage > 1) this.curPage--;
		this.load()
	}

	render() {
		console.log('render time', this.data, this.page);
		if (!this.cols) this.cols = ["Date", "Inspection Number", "Vehicle Plate", "BASIC", "Weight", "Links"];

		this.renderHeader();
		this.renderBody();
	}

	renderBody() {

		let result = '';
		this.data.forEach(c => {

			let date = new Date(c["date"])
			let day = date.getUTCDate()
			let month = date.getUTCMonth() + 1
			let year = date.getUTCFullYear()

			let r = '<tr>';
			// this.cols.forEach(col => {
			r += `<td>${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}</td>`;
			r += `<td>${c["no"]}</td>`;
			r += `<td>${c["plate"]}</td>`;
			r += `<td>${c["basic"] ?? "-"}</td>`;
			r += `<td>${c["weight"]}</td>`;
			r += `<td><a href="/${c["no"]}"><svg class="bi pe-none me-2" width="40" height="32"><use xlink:href="#person"/></svg></a></td>`
			// });
			r += '</tr>';
			result += r;
		});

		let tbody = this.querySelector('tbody')
		tbody.innerHTML = result;

	}

	renderHeader() {

		let header = '<tr>';
		this.cols.forEach(col => {
			let name = col;
			if (this.sortCol === this.getSortCol(col)) {
				const caret = this.sortAsc > 0 ? '&#9650;' : '&#9660;'
				name = `${col} ${caret}`;
			}
			header += `<th style="color:gray; cursor: pointer;" data-sort="${col}">${name}</th>`;
		});
		let thead = this.querySelector('thead')
		thead.innerHTML = header;

		this.querySelectorAll('thead tr th').forEach(t => {
			t.addEventListener('click', this.sort, false);
		});

	}

	getSortCol(colName) {
		let sortBy = colName.toString().replace(' ', '_').toLowerCase()
		switch (sortBy) {
			case 'inspection_number': {
				sortBy = 'no'
				break
			}

			case 'vehicle_plate': {
				sortBy = 'plate'
				break
			}
		}
		return sortBy;
	}

	async sort(e) {
		let colName = e.target.dataset.sort;
		const sortBy = this.getSortCol(colName) || 'no';
		if (this.sortCol && this.sortCol === sortBy) this.sortAsc = !this.sortAsc;
		console.log('sort by', colName.toString(), sortBy, this.sortAsc);
		this.sortCol = sortBy;
		this.load();
	}

	static get observedAttributes() { return ['src']; }

	attributeChangedCallback(name, oldValue, newValue) {

		console.log(name)

		// even though we only listen to src, be sure
		if (name === 'src') {
			this.src = newValue;
			this.load();
		}
	}

}

// Define the new element
customElements.define('data-table', DataTable);

// Element.define('table', DataTable)