class View extends HTMLElement {

	
	constructor() {
		super();

		if(this.hasAttribute('src')) this.src = this.getAttribute('src');
		// If no source, do nothing
		if(!this.src) return;

		this.no = window.location.pathname.substring(1)

		console.log(this.no)

    	// const table = document.createElement('table');
		// const thead = document.createElement('thead');
		// const tbody = document.createElement('tbody');


		// table.append(thead, tbody);

		// const nav = document.createElement('nav');
		// const navUl = document.createElement('ul');
		// navUl.className = "pagination"

		

		// const prevButton = document.createElement('li');
		// prevButton.className = "page-item"
		// prevButton.innerHTML = '<button type="button" class="btn btn-light">Previous</button>';

		// const nextButton = document.createElement('li');
		// nextButton.className = "page-item"
		// nextButton.innerHTML = '<button type="button" class="btn btn-light">Next</button>';

		// navUl.append(prevButton, nextButton);
		// // navUl.innerHTML = "<a></a>"

		// table.className = "table"

		// nav.style = 'float:right'

		// nav.append(navUl)
		// this.append(table)
		// this.append(nav)

		// // https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/
		// this.sort = this.sort.bind(this);

		// this.nextPage = this.nextPage.bind(this);
		// this.previousPage = this.previousPage.bind(this);

		// nextButton.addEventListener('click', this.nextPage, false);
		// prevButton.addEventListener('click', this.previousPage, false);

	}

	async load() {
		console.log('load', this.src);
	
		let result = await fetch(this.src + `/${this.no}`);
		this.data = await result.json();

		this.render();
	}

	
	render() {
		const title = document.getElementById('title-no')
		const inputDate = document.getElementById('input-date')
		const inputReportNumber = document.getElementById('input-report-number')
		const inputReportState = document.getElementById('input-report-state')
		const inputLevel = document.getElementById('input-level')
		const tableVehicleBody = document.getElementById('table-vehicle-body')
		const tableViolationsBody = document.getElementById('table-violations-body')

		title.innerText = this.no

		const date = new Date(this.data.date)
		const day = date.getUTCDate()
		const month = date.getUTCMonth() + 1
		const year = date.getUTCFullYear()

		inputDate.value = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
		inputReportNumber.value = this.data.no
		inputReportState.value = this.data.state
		inputLevel.value = this.data.level

		let vehicleListBody = ''
		this.data.vehicles.forEach(c => {
			let r = '<tr>'
			r += `<td>${c.unit}</td>`;
			r += `<td>${c.type}</td>`;
			r += `<td>${c.license_state}</td>`;
			r += `<td>${c.license_number}</td>`;
			r += `<td>${c.vin}</td>`;
			r += '</tr>';
			vehicleListBody += r
		});

		tableVehicleBody.innerHTML = vehicleListBody

		let violationsListBody = ''
		this.data.violations.forEach(c => {
			let r = '<tr>'
			r += `<td>${c.code}</td>`;
			r += `<td>${c.unit}</td>`;
			r += `<td>${c.oos}</td>`;
			r += `<td>${c.description}</td>`;
			r += `<td>${c.basic}</td>`;
			r += '</tr>';
			violationsListBody += r
		});

		tableViolationsBody.innerHTML = violationsListBody
	}

	static get observedAttributes() { return ['src']; }

	attributeChangedCallback(name, oldValue, newValue) {

		console.log(name)

		// even though we only listen to src, be sure
		if(name === 'src') {
			this.src = newValue;
			this.load();
		}
	}

}

// Define the new element
customElements.define('data-view', View);