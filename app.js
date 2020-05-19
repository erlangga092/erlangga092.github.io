// Class Book 
class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

// Class UI / handle event
class UI {
	static displayBooks() {
		const books = Storage.getBooks();
		
		if(books) {
			books.forEach(book => UI.addBookList(book));
		}
	}

	static addBookList(book) {
		const list = document.querySelector('.book-list');
		const row = document.createElement('tr');

		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td>
				<a href="" class="btn btn-danger btn-sm delete">&times;</a>
			</td>
		`;

		list.appendChild(row);
	}

	static clearFields() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}

	static deleteBook(el) {
		if(el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
			UI.showAlert('Successfull, Book deleted!');
		}
	}

	static showAlert(message, className = 'success') {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.querySelector('.book-form');
		container.insertBefore(div, form);

		// clear alert
		setTimeout(() => {
			document.querySelector('.alert').remove();
		}, 2000);
	}
}

// Class Storage / localStorage
class Storage {
	static getBooks() {
		let books;
		if(localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

	static addBook(book) {
		const books = Storage.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(isbn) {
		const books = Storage.getBooks();

		books.forEach((book, index) => {
			if(book.isbn == isbn) {
				books.splice(index, 1);
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}
}

// Event / display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event / add book
document.querySelector('.book-form')
	.addEventListener('submit', function(e) {
		e.preventDefault();
		
		const title = document.querySelector('#title').value.trim();
		const author = document.querySelector('#author').value.trim();
		const isbn = document.querySelector('#isbn').value.trim();
		
		// Validate
		if(!title || !author || !isbn) {
			UI.showAlert('Please, enter all fields!', 'danger');
		} else {
			const book = new Book(title, author, isbn);
			UI.addBookList(book);
			Storage.addBook(book);
			UI.showAlert('Successfull, Book added!');
			UI.clearFields();
		}

});

// Event / remove book
document.querySelector('.book-list')
	.addEventListener('click', function(e) {
		e.preventDefault();
		UI.deleteBook(e.target);
		Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
});