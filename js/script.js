const books = [];
let searchingBooks=[];
const RENDER_EVENT = 'render-book';
const SEARCH_RENDER_EVENT = 'render-search-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APP';
const Title = document.getElementById('inputBookTitle');
const Author = document.getElementById('inputBookAuthor');
const Year = document.getElementById('inputBookYear');


const generateId = () => {
    return +new Date();
};

const generateBook = (id, title, author, year, isCompleted) => {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
};

const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
};

const findBookIndex = (bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
};

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
    }
    return true;
};

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

const loadFromDataStorage = () => {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};

const makeBookList = (bookObject) => {
    const {id, title, author, year, isCompleted} = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis : ${author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun : ${year}`;

    const bookShelf = document.createElement('article');
    bookShelf.classList.add('book_item',);
    bookShelf.append(textTitle, textAuthor, textYear);
    bookShelf.setAttribute('id', `book-${id}`);

    if (isCompleted) {
        const moveButton = document.createElement('button');
        moveButton.classList.add('green');
        moveButton.innerText = 'Selesai dibaca';
        moveButton.addEventListener('click', () => {
            undoCompletedBook(id);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';
        deleteButton.addEventListener('click', () => {
            deleteCompletedBook(id);
        });
        const action = document.createElement('div');
        action.classList.add('action');
        action.append(moveButton, deleteButton);

        bookShelf.append(action);
    } else {
        const moveButton = document.createElement('button');
        moveButton.classList.add('green');
        moveButton.innerText = 'Selesai dibaca';
        moveButton.addEventListener('click', () => {
            addToCompletedBook(id);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus Buku';
        deleteButton.addEventListener('click', () => {
            deleteCompletedBook(id);
        });
        const action = document.createElement('div');
        action.classList.add('action');
        action.append(moveButton, deleteButton);

        bookShelf.append(action);
    }
    return bookShelf;
};

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};
    
const isBetween = (length, min, max) => length < min || length > max ? false : true;

const checkTitle = () => {
    let valid = false;
    const newTitle = Title.value;
    
    if (newTitle === '') {
        setError(Title, 'Judul tidak boleh kosong');
    } else {
        setSuccess(Title);
        valid = true;
    }
    return valid;
};

const checkAuthor = () => {
    let valid = false;
    const newAuthor = Author.value;
    
    if (newAuthor === '') {
        setError(Author, 'Penulis tidak boleh kosong');
    } else {
        setSuccess(Author);
        valid = true;
    }
    return valid;
};

const checkYear = () => {
    let valid = false;
    const newYear = Year.value;
    
    if (newYear === '') {
        setError(Year, 'Tahun tidak boleh kosong');
    
    } else if (isNaN(newYear)) {
        setError(Year, 'Tahun harus berupa angka');
    } else if (!isBetween(newYear.length,1,4)) {
        setError(Year, 'Tahun maksimal 4 angka');
    } else {
        setSuccess(Year);
        valid = true;
    }
    return valid;
};

const addBook = () => {
    const newTitle = Title.value;
    const newAuthor = Author.value;
    const newYear = Year.value;
    const checkbox = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();

    let isTitleValid = checkTitle(),
        isAuthorValid = checkAuthor(),
        isYearValid = checkYear();
    
    let isFormValid = isTitleValid && isAuthorValid && isYearValid;

    if (isFormValid) {
        const bookObject = generateBook(generateID, newTitle, newAuthor, newYear, checkbox);
        books.push(bookObject);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

};

const addToCompletedBook = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const undoCompletedBook = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const deleteCompletedBook = (bookId) => {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
const searchTitle = (books) => {
    const searchBookTitle = document.getElementById('searchBookTitle').value;
    if (books.title === searchBookTitle) {
        return books;   
    }
};
const searchBookTitle = document.getElementById('searchBookTitle');
const searchBook = (books) => {
    searchingBooks = books.filter(searchTitle);
    if (searchingBooks.length >= 1) {
        document.dispatchEvent(new Event(SEARCH_RENDER_EVENT));
        setSuccess(searchBookTitle);
    } else if (searchingBooks) {
        document.dispatchEvent(new Event(RENDER_EVENT));
        setError(searchBookTitle, 'Judul yang dicari tidak ada');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
    });

    const searchSubmit = document.getElementById('searchBook');
    searchSubmit.addEventListener('submit', (event) => {
        event.preventDefault();
        searchBook(books);
    });
    
    if (isStorageExist()) {
        loadFromDataStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
    const toast = document.querySelector(".toast")
      closeIcon = document.querySelector(".close"),
      progress = document.querySelector(".progress");

      let timer1, timer2;

      toast.classList.add("active");
      progress.classList.add("active");

      timer1 = setTimeout(() => {
          toast.classList.remove("active");
      }, 4000);

      timer2 = setTimeout(() => {
        progress.classList.remove("active");
      }, 4300);
      closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");
        
        setTimeout(() => {
          progress.classList.remove("active");
        }, 300);

        clearTimeout(timer1);
        clearTimeout(timer2);
      });
});

document.addEventListener(RENDER_EVENT, () => {
    const complete = document.getElementById('completeBookshelfList');
    const incomplete = document.getElementById('incompleteBookshelfList');

    complete.innerHTML = '';
    incomplete.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBookList(bookItem);
        if (bookItem.isCompleted) {
            complete.append(bookElement);
        } else {
            incomplete.append(bookElement);
        }
    }
});

document.addEventListener(SEARCH_RENDER_EVENT, () => {
    const complete = document.getElementById('completeBookshelfList');
    const incomplete = document.getElementById('incompleteBookshelfList');

    complete.innerHTML = '';
    incomplete.innerHTML = '';

    for (const bookItem of searchingBooks) {
        const bookElement = makeBookList(bookItem);
        if (bookItem.isCompleted) {
            complete.append(bookElement);
        } else {
            incomplete.append(bookElement);
        }
    }
});