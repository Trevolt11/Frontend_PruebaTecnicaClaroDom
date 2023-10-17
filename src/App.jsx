import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState, useEffect } from 'react';


function App() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchId, setSearchId] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [editedBook, setEditedBook] = useState({
    id: 0,
    title: '',
    description: '',
    pageCount: 0,
    excerpt: '',
    publishDate: new Date().toISOString(),
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Realiza una solicitud GET para obtener la lista de libros
    fetch('https://localhost:7007/api/Books')
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch(error => {
        alert('Error al obtener la lista de libros: ' + error.message);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleDelete = (id) => {
    // Realiza una solicitud DELETE para eliminar un libro por ID
    fetch(`https://localhost:7007/api/Books/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          // Actualiza la lista de libros después de eliminar
          const updatedBooks = books.filter(book => book.id !== id);
          setBooks(updatedBooks);
          setFilteredBooks(updatedBooks);
        } else {
          alert('Error al eliminar el libro.');
        }
      })
      .catch(error => {
        alert('Error al eliminar el libro: ' + error.message);
      });
  };

  const handleSearch = () => {
    if (searchId === '') {
      setFilteredBooks(books);
    } else {
      // Realiza una solicitud GET para buscar un libro por ID
      fetch(`https://localhost:7007/api/Books/${searchId}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Libro no encontrado');
          }
        })
        .then(data => {
          setFilteredBooks([data]);
        })
        .catch(error => {
          alert('Error al buscar el libro: ' + error.message);
          setFilteredBooks([]);
        });
    }
  };

  const handleEdit = (book) => {
    // Muestra el libro seleccionado en el formulario de edición
    setEditedBook({ ...book });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Realiza una solicitud PUT para editar el libro
    fetch(`https://localhost:7007/api/Books/${editedBook.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedBook),
    })
      .then(response => {
        if (response.ok) {
          alert('Libro editado exitosamente.');
          setIsEditing(false);
        } else {
          alert('Error al editar el libro.');
        }
      })
      .catch(error => {
        alert('Error al editar el libro: ' + error.message);
      });
  };

  const handleCancelEdit = () => {
    // Cancela la edición y vuelve a la vista de lista
    setIsEditing(false);
  };

  const renderPageNumbers = pageNumbers.map(number => (
    <li key={number}>
      <button
        onClick={() => setCurrentPage(number)}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline`}
      >
        {number}
      </button>
    </li>
  ));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Lista de Libros</h1>
      <div className="mb-4">
        {isEditing ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Editar Libro</h2>
            <button
              onClick={handleSaveEdit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mr-2 focus:outline-none focus:shadow-outline"
            >
              Guardar
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <input
            type="text"
            placeholder="Buscar por ID"
            className="p-2 border rounded-md mr-2"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        )}
        <button
          onClick={isEditing ? null : handleSearch}
          className={`${isEditing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline'
            }`}
        >
          {isEditing ? 'Editar en progreso' : 'Buscar'}
        </button>
      </div>
      {isEditing ? (
        <form>
          <div className="mb-2">
            <label className="block text-gray-700 font-bold text-sm mb-2" htmlFor="title">
              Título
            </label>
            <input
              className="border rounded-md p-2 w-full"
              type="text"
              id="title"
              value={editedBook.title}
              onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 font-bold text-sm mb-2" htmlFor="description">
              Descripción
            </label>
            <textarea
              className="border rounded-md p-2 w-full"
              id="description"
              value={editedBook.description}
              onChange={(e) => setEditedBook({ ...editedBook, description: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 font-bold text-sm mb-2" htmlFor="pageCount">
              Páginas
            </label>
            <input
              className="border rounded-md p-2 w-full"
              type="number"
              id="pageCount"
              value={editedBook.pageCount}
              onChange={(e) => setEditedBook({ ...editedBook, pageCount: parseInt(e.target.value) })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 font-bold text-sm mb-2" htmlFor="excerpt">
              Extracto
            </label>
            <textarea
              className="border rounded-md p-2 w-full"
              id="excerpt"
              value={editedBook.excerpt}
              onChange={(e) => setEditedBook({ ...editedBook, excerpt: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 font-bold text-sm mb-2" htmlFor="publishDate">
              Fecha de Publicación
            </label>
            <input
              className="border rounded-md p-2 w-full"
              type="datetime-local"
              id="publishDate"
              value={editedBook.publishDate}
              onChange={(e) => setEditedBook({ ...editedBook, publishDate: e.target.value })}
            />
          </div>
        </form>
      ) : (
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-200">ID</th>
              <th className="px-4 py-2 bg-gray-200">Título</th>
              <th className="px-4 py-2 bg-gray-200">Descripción</th>
              <th className="px-4 py-2 bg-gray-200">Páginas</th>
              <th className="px-4 py-2 bg-gray-200">Fecha de Publicación</th>
              <th className="px-4 py-2 bg-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map(book => (
              <tr key={book.id} className="border-b">
                <td className="px-4 py-2">{book.id}</td>
                <td className="px-4 py-2">{book.title}</td>
                <td className="px-4 py-2">{book.description}</td>
                <td className="px-4 py-2">{book.pageCount}</td>
                <td className="px-4 py-2">{book.publishDate}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mr-2 focus:outline-none focus:shadow-outline"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ul className="flex justify-center mt-4 space-x-2">
        {renderPageNumbers}
      </ul>
    </div>
  );
}

export default App;